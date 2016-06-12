/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

this.EXPORTED_SYMBOLS = ["Extension", "ExtensionData"];

/* globals Extension ExtensionData */

/*
 * This file is the main entry point for extensions. When an extension
 * loads, its bootstrap.js file creates a Extension instance
 * and calls .startup() on it. It calls .shutdown() when the extension
 * unloads. Extension manages any extension-specific state in
 * the chrome process.
 */

const Ci = Components.interfaces;
const Cc = Components.classes;
const Cu = Components.utils;
const Cr = Components.results;

Cu.importGlobalProperties(["TextEncoder"]);

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "EventEmitter",
                                  "resource://devtools/shared/event-emitter.js");
XPCOMUtils.defineLazyModuleGetter(this, "Locale",
                                  "resource://gre/modules/Locale.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "Log",
                                  "resource://gre/modules/Log.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "MatchPattern",
                                  "resource://gre/modules/MatchPattern.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "NetUtil",
                                  "resource://gre/modules/NetUtil.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "FileUtils",
                                  "resource://gre/modules/FileUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "OS",
                                  "resource://gre/modules/osfile.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "PrivateBrowsingUtils",
                                  "resource://gre/modules/PrivateBrowsingUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "Preferences",
                                  "resource://gre/modules/Preferences.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "Schemas",
                                  "resource://gre/modules/Schemas.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "Task",
                                  "resource://gre/modules/Task.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "AppConstants",
                                  "resource://gre/modules/AppConstants.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "MessageChannel",
                                  "resource://gre/modules/MessageChannel.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "AddonManager",
                                  "resource://gre/modules/AddonManager.jsm");

Cu.import("resource://gre/modules/ExtensionManagement.jsm");

// Register built-in parts of the API. Other parts may be registered
// in browser/, mobile/, or b2g/.
ExtensionManagement.registerScript("chrome://extensions/content/ext-alarms.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-backgroundPage.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-cookies.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-downloads.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-notifications.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-i18n.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-idle.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-runtime.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-extension.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-webNavigation.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-webRequest.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-storage.js");
ExtensionManagement.registerScript("chrome://extensions/content/ext-test.js");

const BASE_SCHEMA = "chrome://extensions/content/schemas/manifest.json";

ExtensionManagement.registerSchema("chrome://extensions/content/schemas/alarms.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/cookies.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/downloads.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/extension.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/extension_types.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/i18n.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/idle.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/runtime.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/storage.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/test.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/web_navigation.json");
ExtensionManagement.registerSchema("chrome://extensions/content/schemas/web_request.json");

Cu.import("resource://gre/modules/ExtensionUtils.jsm");
var {
  BaseContext,
  LocaleData,
  MessageBroker,
  Messenger,
  injectAPI,
  instanceOf,
  extend,
  flushJarCache,
} = ExtensionUtils;

const LOGGER_ID_BASE = "addons.webextension.";

var scriptScope = this;

var ExtensionPage, GlobalManager;

// This object loads the ext-*.js scripts that define the extension API.
var Management = {
  initialized: null,
  scopes: [],
  apis: [],
  schemaApis: [],
  emitter: new EventEmitter(),

  // Loads all the ext-*.js scripts currently registered.
  lazyInit() {
    if (this.initialized) {
      return this.initialized;
    }

    // Load order matters here. The base manifest defines types which are
    // extended by other schemas, so needs to be loaded first.
    let promise = Schemas.load(BASE_SCHEMA).then(() => {
      let promises = [];
      for (let schema of ExtensionManagement.getSchemas()) {
        promises.push(Schemas.load(schema));
      }
      return Promise.all(promises);
    });

    for (let script of ExtensionManagement.getScripts()) {
      let scope = {extensions: this,
                   global: scriptScope,
                   ExtensionPage: ExtensionPage,
                   GlobalManager: GlobalManager};
      Services.scriptloader.loadSubScript(script, scope, "UTF-8");

      // Save the scope to avoid it being garbage collected.
      this.scopes.push(scope);
    }

    this.initialized = promise;
    return this.initialized;
  },

  // Called by an ext-*.js script to register an API. The |api|
  // parameter should be an object of the form:
  // {
  //   tabs: {
  //     create: ...,
  //     onCreated: ...
  //   }
  // }
  // This registers tabs.create and tabs.onCreated as part of the API.
  registerAPI(api) {
    this.apis.push({api});
  },

  // Same as above, but only register the API is the add-on has the
  // given permission.
  registerPrivilegedAPI(permission, api) {
    this.apis.push({api, permission});
  },

  registerSchemaAPI(namespace, permission, api) {
    this.schemaApis.push({namespace, permission, api});
  },

  // Mash together into a single object all the APIs registered by the
  // functions above. Return the merged object.
  generateAPIs(extension, context, apis) {
    let obj = {};

    // Recursively copy properties from source to dest.
    function copy(dest, source) {
      for (let prop in source) {
        let desc = Object.getOwnPropertyDescriptor(source, prop);
        if (typeof(desc.value) == "object") {
          if (!(prop in dest)) {
            dest[prop] = {};
          }
          copy(dest[prop], source[prop]);
        } else {
          Object.defineProperty(dest, prop, desc);
        }
      }
    }

    for (let api of apis) {
      if (api.permission) {
        if (!extension.hasPermission(api.permission)) {
          continue;
        }
      }

      api = api.api(extension, context);
      copy(obj, api);
    }

    return obj;
  },

  // The ext-*.js scripts can ask to be notified for certain hooks.
  on(hook, callback) {
    this.emitter.on(hook, callback);
  },

  // Ask to run all the callbacks that are registered for a given hook.
  emit(hook, ...args) {
    this.emitter.emit(hook, ...args);
  },

  off(hook, callback) {
    this.emitter.off(hook, callback);
  },
};

// A MessageBroker that's used to send and receive messages for
// extension pages (which run in the chrome process).
var globalBroker = new MessageBroker([Services.mm, Services.ppmm]);

var gContextId = 0;

// An extension page is an execution context for any extension content
// that runs in the chrome process. It's used for background pages
// (type="background"), popups (type="popup"), and any extension
// content loaded into browser tabs (type="tab").
//
// |params| is an object with the following properties:
// |type| is one of "background", "popup", or "tab".
// |contentWindow| is the DOM window the content runs in.
// |uri| is the URI of the content (optional).
// |docShell| is the docshell the content runs in (optional).
// |incognito| is the content running in a private context (default: false).
ExtensionPage = class extends BaseContext {
  constructor(extension, params) {
    super();

    let {type, contentWindow, uri} = params;
    this.extension = extension;
    this.type = type;
    this.contentWindow = contentWindow || null;
    this.uri = uri || extension.baseURI;
    this.incognito = params.incognito || false;
    this.contextId = gContextId++;
    this.unloaded = false;

    // This is the MessageSender property passed to extension.
    // It can be augmented by the "page-open" hook.
    let sender = {id: extension.uuid};
    if (uri) {
      sender.url = uri.spec;
    }
    let delegate = {
      getSender() {},
    };
    Management.emit("page-load", this, params, sender, delegate);

    // Properties in |filter| must match those in the |recipient|
    // parameter of sendMessage.
    let filter = {extensionId: extension.id};
    this.messenger = new Messenger(this, globalBroker, sender, filter, delegate);

    this.extension.views.add(this);
  }

  get cloneScope() {
    return this.contentWindow;
  }

  get principal() {
    return this.contentWindow.document.nodePrincipal;
  }

  // A wrapper around MessageChannel.sendMessage which adds the extension ID
  // to the recipient object, and ensures replies are not processed after the
  // context has been unloaded.
  sendMessage(target, messageName, data, recipient = {}, sender = {}) {
    recipient.extensionId = this.extension.id;
    sender.extensionId = this.extension.id;
    sender.contextId = this.contextId;

    return MessageChannel.sendMessage(target, messageName, data, recipient, sender);
  }

  // Called when the extension shuts down.
  shutdown() {
    Management.emit("page-shutdown", this);
    this.unload();
  }

  // This method is called when an extension page navigates away or
  // its tab is closed.
  unload() {
    // Note that without this guard, we end up running unload code
    // multiple times for tab pages closed by the "page-unload" handlers
    // triggered below.
    if (this.unloaded) {
      return;
    }

    this.unloaded = true;

    MessageChannel.abortResponses({
      extensionId: this.extension.id,
      contextId: this.contextId,
    });

    Management.emit("page-unload", this);

    this.extension.views.delete(this);

    super.unload();
  }
};

// For extensions that have called setUninstallURL(), send an event
// so the browser can display the URL.
let UninstallObserver = {
  init: function() {
    AddonManager.addAddonListener(this);
  },

  onUninstalling: function(addon) {
    let extension = GlobalManager.extensionMap.get(addon.id);
    if (extension) {
      Management.emit("uninstall", extension);
    }
  },
};

// Responsible for loading extension APIs into the right globals.
GlobalManager = {
  // Number of extensions currently enabled.
  count: 0,

  // Map[docShell -> {extension, context}] where context is an ExtensionPage.
  docShells: new Map(),

  // Map[extension ID -> Extension]. Determines which extension is
  // responsible for content under a particular extension ID.
  extensionMap: new Map(),

  init(extension) {
    if (this.count == 0) {
      Services.obs.addObserver(this, "content-document-global-created", false);
      UninstallObserver.init();
    }
    this.count++;

    this.extensionMap.set(extension.id, extension);
  },

  uninit(extension) {
    this.count--;
    if (this.count == 0) {
      Services.obs.removeObserver(this, "content-document-global-created");
    }

    for (let [docShell, data] of this.docShells) {
      if (extension == data.extension) {
        this.docShells.delete(docShell);
      }
    }

    this.extensionMap.delete(extension.id);
  },

  injectInDocShell(docShell, extension, context) {
    this.docShells.set(docShell, {extension, context});
  },

  observe(contentWindow, topic, data) {
    let inject = (extension, context) => {
      // We create two separate sets of bindings, one for the `chrome`
      // global, and one for the `browser` global. The latter returns
      // Promise objects if a callback is not passed, while the former
      // does not.
      let injectObject = (name, defaultCallback) => {
        let browserObj = Cu.createObjectIn(contentWindow, {defineAs: name});

        let api = Management.generateAPIs(extension, context, Management.apis);
        injectAPI(api, browserObj);

        let schemaApi = Management.generateAPIs(extension, context, Management.schemaApis);

        // Add in any extra API namespaces which do not have implementations
        // outside of their schema file.
        schemaApi.extensionTypes = {};

        function findPath(path) {
          let obj = schemaApi;
          for (let elt of path) {
            if (!(elt in obj)) {
              return null;
            }
            obj = obj[elt];
          }
          return obj;
        }
        let schemaWrapper = {
          get cloneScope() {
            return context.cloneScope;
          },

          callFunction(path, name, args) {
            return findPath(path)[name](...args);
          },

          callAsyncFunction(path, name, args, callback) {
            // We pass an empty stub function as a default callback for
            // the `chrome` API, so promise objects are not returned,
            // and lastError values are reported immediately.
            if (callback === null) {
              callback = defaultCallback;
            }

            let promise;
            try {
              promise = findPath(path)[name](...args);
            } catch (e) {
              if (e instanceof context.cloneScope.Error) {
                promise = Promise.reject(e);
              } else {
                Cu.reportError(e);
                promise = Promise.reject({message: "An unexpected error occurred"});
              }
            }

            return context.wrapPromise(promise || Promise.resolve(), callback);
          },

          shouldInject(path, name) {
            return findPath(path) != null;
          },

          getProperty(path, name) {
            return findPath(path)[name];
          },

          setProperty(path, name, value) {
            findPath(path)[name] = value;
          },

          addListener(path, name, listener, args) {
            return findPath(path)[name].addListener.call(null, listener, ...args);
          },
          removeListener(path, name, listener) {
            return findPath(path)[name].removeListener.call(null, listener);
          },
          hasListener(path, name, listener) {
            return findPath(path)[name].hasListener.call(null, listener);
          },
        };
        Schemas.inject(browserObj, schemaWrapper);
      };

      injectObject("browser", null);
      injectObject("chrome", () => {});
    };

    let id = ExtensionManagement.getAddonIdForWindow(contentWindow);

    // We don't inject privileged APIs into sub-frames of a UI page.
    const {FULL_PRIVILEGES} = ExtensionManagement.API_LEVELS;
    if (ExtensionManagement.getAPILevelForWindow(contentWindow, id) !== FULL_PRIVILEGES) {
      return;
    }

    // We don't inject privileged APIs if the addonId is null
    // or doesn't exist.
    if (!this.extensionMap.has(id)) {
      return;
    }

    let docShell = contentWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                                .getInterface(Ci.nsIWebNavigation)
                                .QueryInterface(Ci.nsIDocShellTreeItem)
                                .sameTypeRootTreeItem
                                .QueryInterface(Ci.nsIDocShell);

    if (this.docShells.has(docShell)) {
      let {extension, context} = this.docShells.get(docShell);
      if (context && extension.id == id) {
        inject(extension, context);
      }
      return;
    }

    let extension = this.extensionMap.get(id);
    let uri = contentWindow.document.documentURIObject;
    let incognito = PrivateBrowsingUtils.isContentWindowPrivate(contentWindow);
    let context = new ExtensionPage(extension, {type: "tab", contentWindow, uri, docShell, incognito});
    inject(extension, context);

    let eventHandler = docShell.chromeEventHandler;
    let listener = event => {
      if (event.target != docShell.contentViewer.DOMDocument) {
        return;
      }
      eventHandler.removeEventListener("unload", listener, true);
      context.unload();
    };
    eventHandler.addEventListener("unload", listener, true);
  },
};

// Represents the data contained in an extension, contained either
// in a directory or a zip file, which may or may not be installed.
// This class implements the functionality of the Extension class,
// primarily related to manifest parsing and localization, which is
// useful prior to extension installation or initialization.
//
// No functionality of this class is guaranteed to work before
// |readManifest| has been called, and completed.
this.ExtensionData = function(rootURI) {
  this.rootURI = rootURI;

  this.manifest = null;
  this.id = null;
  this.localeData = null;
  this._promiseLocales = null;

  this.errors = [];
};

ExtensionData.prototype = {
  builtinMessages: null,

  get logger() {
    let id = this.id || "<unknown>";
    return Log.repository.getLogger(LOGGER_ID_BASE + id);
  },

  // Report an error about the extension's manifest file.
  manifestError(message) {
    this.packagingError(`Reading manifest: ${message}`);
  },

  // Report an error about the extension's general packaging.
  packagingError(message) {
    this.errors.push(message);
    this.logger.error(`Loading extension '${this.id}': ${message}`);
  },

  readDirectory: Task.async(function* (path) {
    if (this.rootURI instanceof Ci.nsIFileURL) {
      let uri = NetUtil.newURI(this.rootURI.resolve("./" + path));
      let fullPath = uri.QueryInterface(Ci.nsIFileURL).file.path;

      let iter = new OS.File.DirectoryIterator(fullPath);
      let results = [];

      try {
        yield iter.forEach(entry => {
          results.push(entry);
        });
      } catch (e) {
        // Always return a list, even if the directory does not exist (or is
        // not a directory) for symmetry with the ZipReader behavior.
      }
      iter.close();

      return results;
    }

    if (!(this.rootURI instanceof Ci.nsIJARURI &&
          this.rootURI.JARFile instanceof Ci.nsIFileURL)) {
      // This currently happens for app:// URLs passed to us by
      // UserCustomizations.jsm
      return [];
    }

    // FIXME: We need a way to do this without main thread IO.

    let file = this.rootURI.JARFile.file;
    let zipReader = Cc["@mozilla.org/libjar/zip-reader;1"].createInstance(Ci.nsIZipReader);
    try {
      zipReader.open(file);

      let results = [];

      // Normalize the directory path.
      path = path.replace(/\/\/+/g, "/").replace(/^\/|\/$/g, "") + "/";

      // Escape pattern metacharacters.
      let pattern = path.replace(/[[\]()?*~|$\\]/g, "\\$&");

      let enumerator = zipReader.findEntries(pattern + "*");
      while (enumerator.hasMore()) {
        let name = enumerator.getNext();
        if (!name.startsWith(path)) {
          throw new Error("Unexpected ZipReader entry");
        }

        // The enumerator returns the full path of all entries.
        // Trim off the leading path, and filter out entries from
        // subdirectories.
        name = name.slice(path.length);
        if (name && !/\/./.test(name)) {
          results.push({
            name: name.replace("/", ""),
            isDir: name.endsWith("/"),
          });
        }
      }

      return results;
    } finally {
      zipReader.close();
    }
  }),

  readJSON(path) {
    return new Promise((resolve, reject) => {
      let uri = this.rootURI.resolve(`./${path}`);

      NetUtil.asyncFetch({uri, loadUsingSystemPrincipal: true}, (inputStream, status) => {
        if (!Components.isSuccessCode(status)) {
          reject(new Error(status));
          return;
        }
        try {
          let text = NetUtil.readInputStreamToString(inputStream, inputStream.available(),
                                                     {charset: "utf-8"});
          resolve(JSON.parse(text));
        } catch (e) {
          reject(e);
        }
      });
    });
  },

  // Reads the extension's |manifest.json| file, and stores its
  // parsed contents in |this.manifest|.
  readManifest() {
    return Promise.all([
      this.readJSON("manifest.json"),
      Management.lazyInit(),
    ]).then(([manifest]) => {
      this.manifest = manifest;
      this.rawManifest = manifest;

      if (manifest && manifest.default_locale) {
        return this.initLocale();
      }
    }).then(() => {
      let context = {
        url: this.baseURI && this.baseURI.spec,

        principal: this.principal,

        logError: error => {
          this.logger.warn(`Loading extension '${this.id}': Reading manifest: ${error}`);
        },

        preprocessors: {},
      };

      if (this.localeData) {
        context.preprocessors.localize = this.localize.bind(this);
      }

      let normalized = Schemas.normalize(this.manifest, "manifest.WebExtensionManifest", context);
      if (normalized.error) {
        this.manifestError(normalized.error);
      } else {
        this.manifest = normalized.value;
      }

      try {
        this.id = this.manifest.applications.gecko.id;
      } catch (e) {
        // Errors are handled by the type checks above.
      }

      return this.manifest;
    });
  },

  localizeMessage(...args) {
    return this.localeData.localizeMessage(...args);
  },

  localize(...args) {
    return this.localeData.localize(...args);
  },

  // If a "default_locale" is specified in that manifest, returns it
  // as a Gecko-compatible locale string. Otherwise, returns null.
  get defaultLocale() {
    if (this.manifest.default_locale != null) {
      return this.normalizeLocaleCode(this.manifest.default_locale);
    }

    return null;
  },

  // Normalizes a Chrome-compatible locale code to the appropriate
  // Gecko-compatible variant. Currently, this means simply
  // replacing underscores with hyphens.
  normalizeLocaleCode(locale) {
    return String.replace(locale, /_/g, "-");
  },

  // Reads the locale file for the given Gecko-compatible locale code, and
  // stores its parsed contents in |this.localeMessages.get(locale)|.
  readLocaleFile: Task.async(function* (locale) {
    let locales = yield this.promiseLocales();
    let dir = locales.get(locale) || locale;
    let file = `_locales/${dir}/messages.json`;

    try {
      let messages = yield this.readJSON(file);
      return this.localeData.addLocale(locale, messages, this);
    } catch (e) {
      this.packagingError(`Loading locale file ${file}: ${e}`);
      return new Map();
    }
  }),

  // Reads the list of locales available in the extension, and returns a
  // Promise which resolves to a Map upon completion.
  // Each map key is a Gecko-compatible locale code, and each value is the
  // "_locales" subdirectory containing that locale:
  //
  // Map(gecko-locale-code -> locale-directory-name)
  promiseLocales() {
    if (!this._promiseLocales) {
      this._promiseLocales = Task.spawn(function* () {
        let locales = new Map();

        let entries = yield this.readDirectory("_locales");
        for (let file of entries) {
          if (file.isDir) {
            let locale = this.normalizeLocaleCode(file.name);
            locales.set(locale, file.name);
          }
        }

        this.localeData = new LocaleData({
          defaultLocale: this.defaultLocale,
          locales,
          builtinMessages: this.builtinMessages,
        });

        return locales;
      }.bind(this));
    }

    return this._promiseLocales;
  },

  // Reads the locale messages for all locales, and returns a promise which
  // resolves to a Map of locale messages upon completion. Each key in the map
  // is a Gecko-compatible locale code, and each value is a locale data object
  // as returned by |readLocaleFile|.
  initAllLocales: Task.async(function* () {
    let locales = yield this.promiseLocales();

    yield Promise.all(Array.from(locales.keys(),
                                 locale => this.readLocaleFile(locale)));

    let defaultLocale = this.defaultLocale;
    if (defaultLocale) {
      if (!locales.has(defaultLocale)) {
        this.manifestError('Value for "default_locale" property must correspond to ' +
                           'a directory in "_locales/". Not found: ' +
                           JSON.stringify(`_locales/${this.manifest.default_locale}/`));
      }
    } else if (locales.size) {
      this.manifestError('The "default_locale" property is required when a ' +
                         '"_locales/" directory is present.');
    }

    return this.localeData.messages;
  }),

  // Reads the locale file for the given Gecko-compatible locale code, or the
  // default locale if no locale code is given, and sets it as the currently
  // selected locale on success.
  //
  // Pre-loads the default locale for fallback message processing, regardless
  // of the locale specified.
  //
  // If no locales are unavailable, resolves to |null|.
  initLocale: Task.async(function* (locale = this.defaultLocale) {
    if (locale == null) {
      return null;
    }

    let promises = [this.readLocaleFile(locale)];

    let {defaultLocale} = this;
    if (locale != defaultLocale && !this.localeData.has(defaultLocale)) {
      promises.push(this.readLocaleFile(defaultLocale));
    }

    let results = yield Promise.all(promises);

    this.localeData.selectedLocale = locale;
    return results[0];
  }),
};

// All moz-extension URIs use a machine-specific UUID rather than the
// extension's own ID in the host component. This makes it more
// difficult for web pages to detect whether a user has a given add-on
// installed (by trying to load a moz-extension URI referring to a
// web_accessible_resource from the extension). getExtensionUUID
// returns the UUID for a given add-on ID.
function getExtensionUUID(id) {
  const PREF_NAME = "extensions.webextensions.uuids";

  let pref = Preferences.get(PREF_NAME, "{}");
  let map = {};
  try {
    map = JSON.parse(pref);
  } catch (e) {
    Cu.reportError(`Error parsing ${PREF_NAME}.`);
  }

  if (id in map) {
    return map[id];
  }

  let uuidGenerator = Cc["@mozilla.org/uuid-generator;1"].getService(Ci.nsIUUIDGenerator);
  let uuid = uuidGenerator.generateUUID().number;
  uuid = uuid.slice(1, -1); // Strip of { and } off the UUID.

  map[id] = uuid;
  Preferences.set(PREF_NAME, JSON.stringify(map));
  return uuid;
}

// We create one instance of this class per extension. |addonData|
// comes directly from bootstrap.js when initializing.
this.Extension = function(addonData) {
  ExtensionData.call(this, addonData.resourceURI);

  this.uuid = getExtensionUUID(addonData.id);

  if (addonData.cleanupFile) {
    Services.obs.addObserver(this, "xpcom-shutdown", false);
    this.cleanupFile = addonData.cleanupFile || null;
    delete addonData.cleanupFile;
  }

  this.addonData = addonData;
  this.id = addonData.id;
  this.baseURI = Services.io.newURI("moz-extension://" + this.uuid, null, null);
  this.baseURI.QueryInterface(Ci.nsIURL);
  this.principal = this.createPrincipal();

  this.views = new Set();

  this.onStartup = null;

  this.hasShutdown = false;
  this.onShutdown = new Set();

  this.uninstallURL = null;

  this.permissions = new Set();
  this.whiteListedHosts = null;
  this.webAccessibleResources = new Set();

  this.emitter = new EventEmitter();
};

/**
 * This code is designed to make it easy to test a WebExtension
 * without creating a bunch of files. Everything is contained in a
 * single JSON blob.
 *
 * Properties:
 *   "background": "<JS code>"
 *     A script to be loaded as the background script.
 *     The "background" section of the "manifest" property is overwritten
 *     if this is provided.
 *   "manifest": {...}
 *     Contents of manifest.json
 *   "files": {"filename1": "contents1", ...}
 *     Data to be included as files. Can be referenced from the manifest.
 *     If a manifest file is provided here, it takes precedence over
 *     a generated one. Always use "/" as a directory separator.
 *     Directories should appear here only implicitly (as a prefix
 *     to file names)
 *
 * To make things easier, the value of "background" and "files"[] can
 * be a function, which is converted to source that is run.
 *
 * The generated extension is stored in the system temporary directory,
 * and an nsIFile object pointing to it is returned.
 */
this.Extension.generateXPI = function(id, data) {
  let manifest = data.manifest;
  if (!manifest) {
    manifest = {};
  }

  let files = data.files;
  if (!files) {
    files = {};
  }

  function provide(obj, keys, value, override = false) {
    if (keys.length == 1) {
      if (!(keys[0] in obj) || override) {
        obj[keys[0]] = value;
      }
    } else {
      if (!(keys[0] in obj)) {
        obj[keys[0]] = {};
      }
      provide(obj[keys[0]], keys.slice(1), value, override);
    }
  }

  provide(manifest, ["applications", "gecko", "id"], id);

  provide(manifest, ["name"], "Generated extension");
  provide(manifest, ["manifest_version"], 2);
  provide(manifest, ["version"], "1.0");

  if (data.background) {
    let uuidGenerator = Cc["@mozilla.org/uuid-generator;1"].getService(Ci.nsIUUIDGenerator);
    let bgScript = uuidGenerator.generateUUID().number + ".js";

    provide(manifest, ["background", "scripts"], [bgScript], true);
    files[bgScript] = data.background;
  }

  provide(files, ["manifest.json"], manifest);

  let ZipWriter = Components.Constructor("@mozilla.org/zipwriter;1", "nsIZipWriter");
  let zipW = new ZipWriter();

  let file = FileUtils.getFile("TmpD", ["generated-extension.xpi"]);
  file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);

  const MODE_WRONLY = 0x02;
  const MODE_TRUNCATE = 0x20;
  zipW.open(file, MODE_WRONLY | MODE_TRUNCATE);

  // Needs to be in microseconds for some reason.
  let time = Date.now() * 1000;

  function generateFile(filename) {
    let components = filename.split("/");
    let path = "";
    for (let component of components.slice(0, -1)) {
      path += component + "/";
      if (!zipW.hasEntry(path)) {
        zipW.addEntryDirectory(path, time, false);
      }
    }
  }

  for (let filename in files) {
    let script = files[filename];
    if (typeof(script) == "function") {
      script = "(" + script.toString() + ")()";
    } else if (instanceOf(script, "Object")) {
      script = JSON.stringify(script);
    }

    if (!instanceOf(script, "ArrayBuffer")) {
      script = new TextEncoder("utf-8").encode(script).buffer;
    }

    let stream = Cc["@mozilla.org/io/arraybuffer-input-stream;1"].createInstance(Ci.nsIArrayBufferInputStream);
    stream.setData(script, 0, script.byteLength);

    generateFile(filename);
    zipW.addEntryStream(filename, time, 0, stream, false);
  }

  zipW.close();

  return file;
};

/**
 * Generates a new extension using |Extension.generateXPI|, and initializes a
 * new |Extension| instance which will execute it.
 */
this.Extension.generate = function(id, data) {
  let file = this.generateXPI(id, data);

  flushJarCache(file);
  Services.ppmm.broadcastAsyncMessage("Extension:FlushJarCache", {path: file.path});

  let fileURI = Services.io.newFileURI(file);
  let jarURI = Services.io.newURI("jar:" + fileURI.spec + "!/", null, null);

  return new Extension({
    id,
    resourceURI: jarURI,
    cleanupFile: file,
  });
};

Extension.prototype = extend(Object.create(ExtensionData.prototype), {
  on(hook, f) {
    return this.emitter.on(hook, f);
  },

  off(hook, f) {
    return this.emitter.off(hook, f);
  },

  emit(...args) {
    return this.emitter.emit(...args);
  },

  testMessage(...args) {
    Management.emit("test-message", this, ...args);
  },

  createPrincipal(uri = this.baseURI) {
    return Services.scriptSecurityManager.createCodebasePrincipal(
      uri, {addonId: this.id});
  },

  // Checks that the given URL is a child of our baseURI.
  isExtensionURL(url) {
    let uri = Services.io.newURI(url, null, null);

    let common = this.baseURI.getCommonBaseSpec(uri);
    return common == this.baseURI.spec;
  },

  // Representation of the extension to send to content
  // processes. This should include anything the content process might
  // need.
  serialize() {
    return {
      id: this.id,
      uuid: this.uuid,
      manifest: this.manifest,
      resourceURL: this.addonData.resourceURI.spec,
      baseURL: this.baseURI.spec,
      content_scripts: this.manifest.content_scripts || [],  // eslint-disable-line camelcase
      webAccessibleResources: this.webAccessibleResources,
      whiteListedHosts: this.whiteListedHosts.serialize(),
      localeData: this.localeData.serialize(),
    };
  },

  broadcast(msg, data) {
    return new Promise(resolve => {
      let count = Services.ppmm.childCount;
      if (AppConstants.MOZ_NUWA_PROCESS) {
        // The nuwa process is frozen, so don't expect it to answer.
        count--;
      }
      Services.ppmm.addMessageListener(msg + "Complete", function listener() {
        count--;
        if (count == 0) {
          Services.ppmm.removeMessageListener(msg + "Complete", listener);
          resolve();
        }
      });
      Services.ppmm.broadcastAsyncMessage(msg, data);
    });
  },

  runManifest(manifest) {
    let permissions = manifest.permissions || [];
    let webAccessibleResources = manifest.web_accessible_resources || [];

    let whitelist = [];
    for (let perm of permissions) {
      this.permissions.add(perm);
      if (!/^\w+(\.\w+)*$/.test(perm)) {
        whitelist.push(perm);
      }
    }
    this.whiteListedHosts = new MatchPattern(whitelist);

    let resources = new Set();
    for (let url of webAccessibleResources) {
      resources.add(url);
    }
    this.webAccessibleResources = resources;

    for (let directive in manifest) {
      if (manifest[directive] !== null) {
        Management.emit("manifest_" + directive, directive, this, manifest);
      }
    }

    let data = Services.ppmm.initialProcessData;
    if (!data["Extension:Extensions"]) {
      data["Extension:Extensions"] = [];
    }
    let serial = this.serialize();
    data["Extension:Extensions"].push(serial);

    return this.broadcast("Extension:Startup", serial);
  },

  callOnClose(obj) {
    this.onShutdown.add(obj);
  },

  forgetOnClose(obj) {
    this.onShutdown.delete(obj);
  },

  get builtinMessages() {
    return new Map([
      ["@@extension_id", this.uuid],
    ]);
  },

  // Reads the locale file for the given Gecko-compatible locale code, or if
  // no locale is given, the available locale closest to the UI locale.
  // Sets the currently selected locale on success.
  initLocale: Task.async(function* (locale = undefined) {
    if (locale === undefined) {
      let locales = yield this.promiseLocales();

      let localeList = Array.from(locales.keys(), locale => {
        return {name: locale, locales: [locale]};
      });

      let match = Locale.findClosestLocale(localeList);
      locale = match ? match.name : this.defaultLocale;
    }

    return ExtensionData.prototype.initLocale.call(this, locale);
  }),

  startup() {
    try {
      ExtensionManagement.startupExtension(this.uuid, this.addonData.resourceURI, this);
    } catch (e) {
      return Promise.reject(e);
    }

    return this.readManifest().then(() => {
      if (!this.hasShutdown) {
        return this.initLocale();
      }
    }).then(() => {
      if (this.errors.length) {
        // b2g add-ons generate manifest errors that we've silently
        // ignoring prior to adding this check.
        if (!this.rootURI.schemeIs("app")) {
          return Promise.reject({errors: this.errors});
        }
      }

      if (this.hasShutdown) {
        return;
      }

      GlobalManager.init(this);

      Management.emit("startup", this);

      return this.runManifest(this.manifest);
    }).catch(e => {
      dump(`Extension error: ${e.message} ${e.filename || e.fileName}:${e.lineNumber} :: ${e.stack || new Error().stack}\n`);
      Cu.reportError(e);

      ExtensionManagement.shutdownExtension(this.uuid);

      this.cleanupGeneratedFile();

      throw e;
    });
  },

  cleanupGeneratedFile() {
    if (!this.cleanupFile) {
      return;
    }

    let file = this.cleanupFile;
    this.cleanupFile = null;

    Services.obs.removeObserver(this, "xpcom-shutdown");

    this.broadcast("Extension:FlushJarCache", {path: file.path}).then(() => {
      // We can't delete this file until everyone using it has
      // closed it (because Windows is dumb). So we wait for all the
      // child processes (including the parent) to flush their JAR
      // caches. These caches may keep the file open.
      file.remove(false);
    });
  },

  shutdown() {
    this.hasShutdown = true;
    if (!this.manifest) {
      ExtensionManagement.shutdownExtension(this.uuid);

      this.cleanupGeneratedFile();
      return;
    }

    GlobalManager.uninit(this);

    for (let view of this.views) {
      view.shutdown();
    }

    for (let obj of this.onShutdown) {
      obj.close();
    }

    Management.emit("shutdown", this);

    Services.ppmm.broadcastAsyncMessage("Extension:Shutdown", {id: this.id});

    MessageChannel.abortResponses({extensionId: this.id});

    ExtensionManagement.shutdownExtension(this.uuid);

    this.cleanupGeneratedFile();
  },

  observe(subject, topic, data) {
    if (topic == "xpcom-shutdown") {
      this.cleanupGeneratedFile();
    }
  },

  hasPermission(perm) {
    return this.permissions.has(perm);
  },

  get name() {
    return this.localize(this.manifest.name);
  },
});
