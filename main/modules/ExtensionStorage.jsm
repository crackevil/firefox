/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

this.EXPORTED_SYMBOLS = ["ExtensionStorage"];

const Ci = Components.interfaces;
const Cc = Components.classes;
const Cu = Components.utils;
const Cr = Components.results;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/osfile.jsm");
Cu.import("resource://gre/modules/AsyncShutdown.jsm");

/* globals OS ExtensionStorage */

var Path = OS.Path;
var profileDir = OS.Constants.Path.profileDir;

function jsonReplacer(key, value) {
  switch (typeof(value)) {
    // Serialize primitive types as-is.
    case "string":
    case "number":
    case "boolean":
      return value;

    case "object":
      if (value === null) {
        return value;
      }

      switch (Cu.getClassName(value, true)) {
        // Serialize arrays and ordinary objects as-is.
        case "Array":
        case "Object":
          return value;

        // Serialize Date objects and regular expressions as their
        // string representations.
        case "Date":
        case "RegExp":
          return String(value);
      }
      break;
  }

  if (!key) {
    // If this is the root object, and we can't serialize it, serialize
    // the value to an empty object.
    return {};
  }

  // Everything else, omit entirely.
  return undefined;
}

this.ExtensionStorage = {
  cache: new Map(),
  listeners: new Map(),

  extensionDir: Path.join(profileDir, "browser-extension-data"),

  /**
   * Sanitizes the given value, and returns a JSON-compatible
   * representation of it, based on the privileges of the given global.
   */
  sanitize(value, global) {
    // We can't trust that the global has privileges to access this
    // value enough to clone it using a privileged JSON object.
    let JSON_ = Cu.waiveXrays(global.JSON);

    let json = JSON_.stringify(value, jsonReplacer);
    return JSON.parse(json);
  },

  getExtensionDir(extensionId) {
    return Path.join(this.extensionDir, extensionId);
  },

  getStorageFile(extensionId) {
    return Path.join(this.extensionDir, extensionId, "storage.js");
  },

  read(extensionId) {
    if (this.cache.has(extensionId)) {
      return this.cache.get(extensionId);
    }

    let path = this.getStorageFile(extensionId);
    let decoder = new TextDecoder();
    let promise = OS.File.read(path);
    promise = promise.then(array => {
      return JSON.parse(decoder.decode(array));
    }).catch(() => {
      Cu.reportError("Unable to parse JSON data for extension storage.");
      return {};
    });
    this.cache.set(extensionId, promise);
    return promise;
  },

  write(extensionId) {
    let promise = this.read(extensionId).then(extData => {
      let encoder = new TextEncoder();
      let array = encoder.encode(JSON.stringify(extData));
      let path = this.getStorageFile(extensionId);
      OS.File.makeDir(this.getExtensionDir(extensionId), {ignoreExisting: true, from: profileDir});
      let promise = OS.File.writeAtomic(path, array);
      return promise;
    }).catch(() => {
      // Make sure this promise is never rejected.
      Cu.reportError("Unable to write JSON data for extension storage.");
    });

    AsyncShutdown.profileBeforeChange.addBlocker(
      "ExtensionStorage: Finish writing extension data",
      promise);

    return promise.then(() => {
      AsyncShutdown.profileBeforeChange.removeBlocker(promise);
    });
  },

  set(extensionId, items, global) {
    return this.read(extensionId).then(extData => {
      let changes = {};
      for (let prop in items) {
        let item = this.sanitize(items[prop], global);
        changes[prop] = {oldValue: extData[prop], newValue: item};
        extData[prop] = item;
      }

      this.notifyListeners(extensionId, changes);

      return this.write(extensionId);
    });
  },

  remove(extensionId, items) {
    return this.read(extensionId).then(extData => {
      let changes = {};
      for (let prop of [].concat(items)) {
        changes[prop] = {oldValue: extData[prop]};
        delete extData[prop];
      }

      this.notifyListeners(extensionId, changes);

      return this.write(extensionId);
    });
  },

  clear(extensionId) {
    return this.read(extensionId).then(extData => {
      let changes = {};
      for (let prop of Object.keys(extData)) {
        changes[prop] = {oldValue: extData[prop]};
        delete extData[prop];
      }

      this.notifyListeners(extensionId, changes);

      return this.write(extensionId);
    });
  },

  get(extensionId, keys) {
    return this.read(extensionId).then(extData => {
      let result = {};
      if (keys === null) {
        Object.assign(result, extData);
      } else if (typeof(keys) == "object" && !Array.isArray(keys)) {
        for (let prop in keys) {
          if (prop in extData) {
            result[prop] = extData[prop];
          } else {
            result[prop] = keys[prop];
          }
        }
      } else {
        for (let prop of [].concat(keys)) {
          if (prop in extData) {
            result[prop] = extData[prop];
          }
        }
      }

      return result;
    });
  },

  addOnChangedListener(extensionId, listener) {
    let listeners = this.listeners.get(extensionId) || new Set();
    listeners.add(listener);
    this.listeners.set(extensionId, listeners);
  },

  removeOnChangedListener(extensionId, listener) {
    let listeners = this.listeners.get(extensionId);
    listeners.delete(listener);
  },

  notifyListeners(extensionId, changes) {
    let listeners = this.listeners.get(extensionId);
    if (listeners) {
      for (let listener of listeners) {
        listener(changes);
      }
    }
  },

  init() {
    Services.obs.addObserver(this, "extension-invalidate-storage-cache", false);
    Services.obs.addObserver(this, "xpcom-shutdown", false);
  },

  observe(subject, topic, data) {
    if (topic == "xpcom-shutdown") {
      Services.obs.removeObserver(this, "extension-invalidate-storage-cache");
      Services.obs.removeObserver(this, "xpcom-shutdown");
    } else if (topic == "extension-invalidate-storage-cache") {
      this.cache.clear();
    }
  },
};

ExtensionStorage.init();
