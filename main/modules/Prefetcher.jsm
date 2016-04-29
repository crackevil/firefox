// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

this.EXPORTED_SYMBOLS = ["Prefetcher"];

const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "Preferences",
                                  "resource://gre/modules/Preferences.jsm");

// Rules are defined at the bottom of this file.
var PrefetcherRules = {};

/*
 * When events that trigger in the content process are forwarded to
 * add-ons in the chrome process, we expect the add-ons to send a lot
 * of CPOWs to query content nodes while processing the events. To
 * speed this up, the prefetching system anticipates which properties
 * will be read and reads them ahead of time. The prefetched
 * properties are passed to the chrome process along with each
 * event. A typical scenario might work like this:
 *
 * 1. "load" event fires in content
 * 2. Content process prefetches:
 *      event.target.defaultView = <win 1>
 *      <win 1>.location = <location obj>
 *      event.target.getElementsByTagName("form") = [<elt 1>, <elt 2>]
 *      <elt 1>.id = "login-form"
 *      <elt 2>.id = "subscribe-form"
 * 3. Content process forwards "load" event to add-on along with
 *    prefetched data
 * 4. Add-on reads:
 *      event.target.defaultView (already prefetched)
 *      event.target.getElementsByTagName("form") (already prefetched)
 *      <elt 1>.id (already prefetched)
 *      <elt 1>.className (not prefetched; CPOW must be sent)
 *
 * The amount of data to prefetch is determined based on the add-on ID
 * and the event type. The specific data to select is determined using
 * a set of Datalog-like rules (http://en.wikipedia.org/wiki/Datalog).
 *
 * Rules operate on a series of "tables" like in a database. Each
 * table contains a set of content-process objects. When an event
 * handler runs, it seeds some initial tables with objects of
 * interest. For example, the Event table might start out containing
 * the event that fired.
 *
 * Objects are added to tables using a set of rules of the form "if X
 * is in table A, then add F(X) to table B", where F(X) is typically a
 * property access or a method call. The most common functions F are:
 *
 * PropertyOp(destTable, sourceTable, property):
 *   For each object X in sourceTable, add X.property to destTable.
 * MethodOp(destTable, sourceTable, method, args):
 *   For each object X in sourceTable, add X.method(args) to destTable.
 * CollectionOp(destTable, sourceTable):
 *   For each object X in sourceTable, add X[i] to destTable for
 *   all i from 0 to X.length - 1.
 *
 * To generate the prefetching in the example above, the following
 * rules would work:
 *
 * 1. PropertyOp("EventTarget", "Event", "target")
 * 2. PropertyOp("Window", "EventTarget", "defaultView")
 * 3. MethodOp("FormCollection", "EventTarget", "getElementsByTagName", "form")
 * 4. CollectionOp("Form", "FormCollection")
 * 5. PropertyOp(null, "Form", "id")
 *
 * Rules are written at the bottom of this file.
 *
 * When a rule runs, it will usually generate some cache entries that
 * will be passed to the chrome process. For example, when PropertyOp
 * prefetches obj.prop and gets the value X, it caches the value of
 * obj and X. When the chrome process receives this data, it creates a
 * two-level map [obj -> [prop -> X]]. When the add-on accesses a
 * property on obj, the add-on shim code consults this map to see if
 * the property has already been cached.
 */

const PREF_PREFETCHING_ENABLED = "extensions.interposition.prefetching";

function isPrimitive(v) {
  if (!v)
    return true;
  let type = typeof(v);
  return type !== "object" && type !== "function";
}

function objAddr(obj)
{
/*
  if (!isPrimitive(obj)) {
    return String(obj) + "[" + Cu.getJSTestingFunctions().objectAddress(obj) + "]";
  }
  return String(obj);
*/
}

function log(/*...args*/)
{
/*
  for (let arg of args) {
    dump(arg);
    dump(" ");
  }
  dump("\n");
*/
}

function logPrefetch(/*kind, value1, component, value2*/)
{
/*
  log("prefetching", kind, objAddr(value1) + "." + component, "=", objAddr(value2));
*/
}

/*
 * All the Op classes (representing Datalog rules) have the same interface:
 *   outputTable: Table that objects generated by the rule are added to.
 *     Note that this can be null.
 *   inputTable: Table that the rule draws objects from.
 *   addObject(database, obj): Called when an object is added to inputTable.
 *     This code should take care of adding objects to outputTable.
 *     Data to be cached should be stored by calling database.cache.
 *   makeCacheEntry(item, cache):
 *     Called by the chrome process to create the two-level map of
 *     prefetched objects. |item| holds the cached data
 *     generated by the content process. |cache| is the map to be
 *     generated.
 */

function PropertyOp(outputTable, inputTable, prop)
{
  this.outputTable = outputTable;
  this.inputTable = inputTable;
  this.prop = prop;
}

PropertyOp.prototype.addObject = function(database, obj)
{
  let has = false, propValue;
  try {
    if (this.prop in obj) {
      has = true;
      propValue = obj[this.prop];
    }
  } catch (e) {
    // Don't cache anything if an exception is thrown.
    return;
  }

  logPrefetch("prop", obj, this.prop, propValue);
  database.cache(this.index, obj, has, propValue);
  if (has && !isPrimitive(propValue) && this.outputTable) {
    database.add(this.outputTable, propValue);
  }
}

PropertyOp.prototype.makeCacheEntry = function(item, cache)
{
  let [index, obj, has, propValue] = item;

  let desc = { configurable: false, enumerable: true, writable: false, value: propValue };

  if (!cache.has(obj)) {
    cache.set(obj, new Map());
  }
  let propMap = cache.get(obj);
  propMap.set(this.prop, desc);
}

function MethodOp(outputTable, inputTable, method, ...args)
{
  this.outputTable = outputTable;
  this.inputTable = inputTable;
  this.method = method;
  this.args = args;
}

MethodOp.prototype.addObject = function(database, obj)
{
  let result;
  try {
    result = obj[this.method].apply(obj, this.args);
  } catch (e) {
    // Don't cache anything if an exception is thrown.
    return;
  }

  logPrefetch("method", obj, this.method + "(" + this.args + ")", result);
  database.cache(this.index, obj, result);
  if (!isPrimitive(result) && this.outputTable) {
    database.add(this.outputTable, result);
  }
}

MethodOp.prototype.makeCacheEntry = function(item, cache)
{
  let [index, obj, result] = item;

  if (!cache.has(obj)) {
    cache.set(obj, new Map());
  }
  let propMap = cache.get(obj);
  let fallback = propMap.get(this.method);

  let method = this.method;
  let selfArgs = this.args;
  let methodImpl = function(...args) {
    if (args.length == selfArgs.length && args.every((v, i) => v === selfArgs[i])) {
      return result;
    }

    if (fallback) {
      return fallback.value(...args);
    } else {
      return obj[method](...args);
    }
  };

  let desc = { configurable: false, enumerable: true, writable: false, value: methodImpl };
  propMap.set(this.method, desc);
}

function CollectionOp(outputTable, inputTable)
{
  this.outputTable = outputTable;
  this.inputTable = inputTable;
}

CollectionOp.prototype.addObject = function(database, obj)
{
  let elements = [];
  try {
    let len = obj.length;
    for (let i = 0; i < len; i++) {
      logPrefetch("index", obj, i, obj[i]);
      elements.push(obj[i]);
    }
  } catch (e) {
    // Don't cache anything if an exception is thrown.
    return;
  }

  database.cache(this.index, obj, ...elements);
  for (let i = 0; i < elements.length; i++) {
    if (!isPrimitive(elements[i]) && this.outputTable) {
      database.add(this.outputTable, elements[i]);
    }
  }
}

CollectionOp.prototype.makeCacheEntry = function(item, cache)
{
  let [index, obj, ...elements] = item;

  if (!cache.has(obj)) {
    cache.set(obj, new Map());
  }
  let propMap = cache.get(obj);

  let lenDesc = { configurable: false, enumerable: true, writable: false, value: elements.length };
  propMap.set("length", lenDesc);

  for (let i = 0; i < elements.length; i++) {
    let desc = { configurable: false, enumerable: true, writable: false, value: elements[i] };
    propMap.set(i, desc);
  }
}

function CopyOp(outputTable, inputTable)
{
  this.outputTable = outputTable;
  this.inputTable = inputTable;
}

CopyOp.prototype.addObject = function(database, obj)
{
  database.add(this.outputTable, obj);
}

function Database(trigger, addons)
{
  // Create a map of rules that apply to this specific trigger and set
  // of add-ons. The rules are indexed based on their inputTable.
  this.rules = new Map();
  for (let addon of addons) {
    let addonRules = PrefetcherRules[addon] || {};
    let triggerRules = addonRules[trigger] || [];
    for (let rule of triggerRules) {
      let inTable = rule.inputTable;
      if (!this.rules.has(inTable)) {
        this.rules.set(inTable, new Set());
      }
      let set = this.rules.get(inTable);
      set.add(rule);
    }
  }

  // this.tables maps table names to sets of objects contained in them.
  this.tables = new Map();

  // todo is a worklist of items added to tables that have not had
  // rules run on them yet.
  this.todo = [];

  // Cached data to be sent to the chrome process.
  this.cached = [];
}

Database.prototype = {
  // Add an object to a table.
  add: function(table, obj) {
    if (!this.tables.has(table)) {
      this.tables.set(table, new Set());
    }
    let tableSet = this.tables.get(table);
    if (tableSet.has(obj)) {
      return;
    }
    tableSet.add(obj);

    this.todo.push([table, obj]);
  },

  cache: function(...args) {
    this.cached.push(args);
  },

  // Run a fixed-point iteration that adds objects to table based on
  // this.rules until there are no more objects to add.
  process: function() {
    while (this.todo.length) {
      let [table, obj] = this.todo.pop();
      let rules = this.rules.get(table);
      if (!rules) {
        continue;
      }
      for (let rule of rules) {
        rule.addObject(this, obj);
      }
    }
  },
};

var Prefetcher = {
  init: function() {
    // Give an index to each rule and store it in this.ruleMap based
    // on the index. The index is used to serialize and deserialize
    // data from content to chrome.
    let counter = 0;
    this.ruleMap = new Map();
    for (let addon in PrefetcherRules) {
      for (let trigger in PrefetcherRules[addon]) {
        for (let rule of PrefetcherRules[addon][trigger]) {
          rule.index = counter++;
          this.ruleMap.set(rule.index, rule);
        }
      }
    }

    this.prefetchingEnabled = Preferences.get(PREF_PREFETCHING_ENABLED, false);
    Services.prefs.addObserver(PREF_PREFETCHING_ENABLED, this, false);
    Services.obs.addObserver(this, "xpcom-shutdown", false);
  },

  observe: function(subject, topic, data) {
    if (topic == "xpcom-shutdown") {
      Services.prefs.removeObserver(PREF_PREFETCHING_ENABLED, this);
      Services.obs.removeObserver(this, "xpcom-shutdown");
    } else if (topic == PREF_PREFETCHING_ENABLED) {
      this.prefetchingEnabled = Preferences.get(PREF_PREFETCHING_ENABLED, false);
    }
  },

  // Called when an event occurs in the content process. The event is
  // described by the trigger string. |addons| is a list of addons
  // that have listeners installed for the event. |args| is
  // event-specific data (such as the event object).
  prefetch: function(trigger, addons, args) {
    if (!this.prefetchingEnabled) {
      return [[], []];
    }

    let db = new Database(trigger, addons);
    for (let table in args) {
      log("root", table, "=", objAddr(args[table]));
      db.add(table, args[table]);
    }

    // Prefetch objects and add them to tables.
    db.process();

    // Data passed to sendAsyncMessage must be split into a JSON
    // portion and a CPOW portion. This code splits apart db.cached
    // into these two pieces. Any object in db.cache is added to an
    // array of CPOWs and replaced with {cpow: <index in array>}.
    let cpowIndexes = new Map();
    let prefetched = [];
    let cpows = [];
    for (let item of db.cached) {
      item = item.map((elt) => {
        if (!isPrimitive(elt)) {
          if (!cpowIndexes.has(elt)) {
            let index = cpows.length;
            cpows.push(elt);
            cpowIndexes.set(elt, index);
          }
          return {cpow: cpowIndexes.get(elt)};
        } else {
          return elt;
        }
      });

      prefetched.push(item);
    }

    return [prefetched, cpows];
  },

  cache: null,

  // Generate a two-level mapping based on cached data received from
  // the content process.
  generateCache: function(prefetched, cpows) {
    let cache = new Map();
    for (let item of prefetched) {
      // Replace anything of the form {cpow: <index>} with the actual
      // object in |cpows|.
      item = item.map((elt) => {
        if (!isPrimitive(elt)) {
          return cpows[elt.cpow];
        }
        return elt;
      });

      let index = item[0];
      let op = this.ruleMap.get(index);
      op.makeCacheEntry(item, cache);
    }
    return cache;
  },

  // Run |func|, using the prefetched data in |prefetched| and |cpows|
  // as a cache.
  withPrefetching: function(prefetched, cpows, func) {
    if (!this.prefetchingEnabled) {
      return func();
    }

    this.cache = this.generateCache(prefetched, cpows);

    try {
      log("Prefetching on");
      return func();
    } finally {
      // After we return from this event handler, the content process
      // is free to continue executing, so we invalidate our cache.
      log("Prefetching off");
      this.cache = null;
    }
  },

  // Called by shim code in the chrome process to check if target.prop
  // is cached.
  lookupInCache: function(addon, target, prop) {
    if (!this.cache || !Cu.isCrossProcessWrapper(target)) {
      return null;
    }

    let propMap = this.cache.get(target);
    if (!propMap) {
      return null;
    }

    return propMap.get(prop);
  },
};

var AdblockId = "{d10d0bf8-f5b5-c8b4-a8b2-2b9879e08c5d}";
var AdblockRules = {
  "ContentPolicy.shouldLoad": [
    new MethodOp("Node", "InitNode", "QueryInterface", Ci.nsISupports),
    new PropertyOp("Document", "Node", "ownerDocument"),
    new PropertyOp("Window", "Node", "defaultView"),
    new PropertyOp("Window", "Document", "defaultView"),
    new PropertyOp("TopWindow", "Window", "top"),
    new PropertyOp("WindowLocation", "Window", "location"),
    new PropertyOp(null, "WindowLocation", "href"),
    new PropertyOp("Window", "Window", "parent"),
    new PropertyOp(null, "Window", "name"),
    new PropertyOp("Document", "Window", "document"),
    new PropertyOp("TopDocumentElement", "Document", "documentElement"),
    new MethodOp(null, "TopDocumentElement", "getAttribute", "data-adblockkey"),
  ]
};
PrefetcherRules[AdblockId] = AdblockRules;

var LastpassId = "support@lastpass.com";
var LastpassRules = {
  "EventTarget.handleEvent": [
    new PropertyOp("EventTarget", "Event", "target"),
    new PropertyOp("EventOriginalTarget", "Event", "originalTarget"),
    new PropertyOp("Window", "EventOriginalTarget", "defaultView"),

    new CopyOp("Frame", "Window"),
    new PropertyOp("FrameCollection", "Window", "frames"),
    new CollectionOp("Frame", "FrameCollection"),
    new PropertyOp("FrameCollection", "Frame", "frames"),
    new PropertyOp("FrameDocument", "Frame", "document"),
    new PropertyOp(null, "Frame", "window"),
    new PropertyOp(null, "FrameDocument", "defaultView"),

    new PropertyOp("FrameDocumentLocation", "FrameDocument", "location"),
    new PropertyOp(null, "FrameDocumentLocation", "href"),
    new PropertyOp("FrameLocation", "Frame", "location"),
    new PropertyOp(null, "FrameLocation", "href"),

    new MethodOp("FormCollection", "FrameDocument", "getElementsByTagName", "form"),
    new MethodOp("FormCollection", "FrameDocument", "getElementsByTagName", "FORM"),
    new CollectionOp("Form", "FormCollection"),
    new PropertyOp("FormElementCollection", "Form", "elements"),
    new CollectionOp("FormElement", "FormElementCollection"),
    new PropertyOp("Style", "Form", "style"),

    new PropertyOp(null, "FormElement", "type"),
    new PropertyOp(null, "FormElement", "name"),
    new PropertyOp(null, "FormElement", "value"),
    new PropertyOp(null, "FormElement", "tagName"),
    new PropertyOp(null, "FormElement", "id"),
    new PropertyOp("Style", "FormElement", "style"),

    new PropertyOp(null, "Style", "visibility"),

    new MethodOp("MetaElementsCollection", "EventOriginalTarget", "getElementsByTagName", "meta"),
    new CollectionOp("MetaElement", "MetaElementsCollection"),
    new PropertyOp(null, "MetaElement", "httpEquiv"),

    new MethodOp("InputElementCollection", "FrameDocument", "getElementsByTagName", "input"),
    new MethodOp("InputElementCollection", "FrameDocument", "getElementsByTagName", "INPUT"),
    new CollectionOp("InputElement", "InputElementCollection"),
    new PropertyOp(null, "InputElement", "type"),
    new PropertyOp(null, "InputElement", "name"),
    new PropertyOp(null, "InputElement", "tagName"),
    new PropertyOp(null, "InputElement", "form"),

    new PropertyOp("BodyElement", "FrameDocument", "body"),
    new PropertyOp("BodyInnerText", "BodyElement", "innerText"),

    new PropertyOp("DocumentFormCollection", "FrameDocument", "forms"),
    new CollectionOp("DocumentForm", "DocumentFormCollection"),
  ]
};
PrefetcherRules[LastpassId] = LastpassRules;
