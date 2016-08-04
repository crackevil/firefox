/* jshint moz: true, esnext: true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const Cu = Components.utils;
Cu.import("resource://gre/modules/IndexedDBHelper.jsm");
Cu.import("resource://gre/modules/Preferences.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.importGlobalProperties(["indexedDB"]);

this.EXPORTED_SYMBOLS = ["PushDB"];

XPCOMUtils.defineLazyGetter(this, "console", () => {
  let {ConsoleAPI} = Cu.import("resource://gre/modules/Console.jsm", {});
  return new ConsoleAPI({
    maxLogLevelPref: "dom.push.loglevel",
    prefix: "PushDB",
  });
});

this.PushDB = function PushDB(dbName, dbVersion, dbStoreName, keyPath, model) {
  console.debug("PushDB()");
  this._dbStoreName = dbStoreName;
  this._keyPath = keyPath;
  this._model = model;

  // set the indexeddb database
  this.initDBHelper(dbName, dbVersion,
                    [dbStoreName]);
};

this.PushDB.prototype = {
  __proto__: IndexedDBHelper.prototype,

  toPushRecord: function(record) {
    if (!record) {
      return;
    }
    return new this._model(record);
  },

  isValidRecord: function(record) {
    return record && typeof record.scope == "string" &&
           typeof record.originAttributes == "string" &&
           record.quota >= 0 &&
           typeof record[this._keyPath] == "string";
  },

  upgradeSchema: function(aTransaction, aDb, aOldVersion, aNewVersion) {
    if (aOldVersion <= 3) {
      //XXXnsm We haven't shipped Push during this upgrade, so I'm just going to throw old
      //registrations away without even informing the app.
      if (aDb.objectStoreNames.contains(this._dbStoreName)) {
        aDb.deleteObjectStore(this._dbStoreName);
      }

      let objectStore = aDb.createObjectStore(this._dbStoreName,
                                              { keyPath: this._keyPath });

      // index to fetch records based on endpoints. used by unregister
      objectStore.createIndex("pushEndpoint", "pushEndpoint", { unique: true });

      // index to fetch records by identifiers.
      // In the current security model, the originAttributes distinguish between
      // different 'apps' on the same origin. Since ServiceWorkers are
      // same-origin to the scope they are registered for, the attributes and
      // scope are enough to reconstruct a valid principal.
      objectStore.createIndex("identifiers", ["scope", "originAttributes"], { unique: true });
      objectStore.createIndex("originAttributes", "originAttributes", { unique: false });
    }

    if (aOldVersion < 4) {
      let objectStore = aTransaction.objectStore(this._dbStoreName);

      // index to fetch active and expired registrations.
      objectStore.createIndex("quota", "quota", { unique: false });
    }
  },

  /*
   * @param aRecord
   *        The record to be added.
   */

  put: function(aRecord) {
    console.debug("put()", aRecord);
    if (!this.isValidRecord(aRecord)) {
      return Promise.reject(new TypeError(
        "Scope, originAttributes, and quota are required! " +
          JSON.stringify(aRecord)
        )
      );
    }

    return new Promise((resolve, reject) =>
      this.newTxn(
        "readwrite",
        this._dbStoreName,
        (aTxn, aStore) => {
          aTxn.result = undefined;

          aStore.put(aRecord).onsuccess = aEvent => {
            console.debug("put: Request successful. Updated record",
              aEvent.target.result);
            aTxn.result = this.toPushRecord(aRecord);
          };
        },
        resolve,
        reject
      )
    );
  },

  /*
   * @param aKeyID
   *        The ID of record to be deleted.
   */
  delete: function(aKeyID) {
    console.debug("delete()");

    return new Promise((resolve, reject) =>
      this.newTxn(
        "readwrite",
        this._dbStoreName,
        function txnCb(aTxn, aStore) {
          console.debug("delete: Removing record", aKeyID);
          aStore.get(aKeyID).onsuccess = event => {
            aTxn.result = event.target.result;
            aStore.delete(aKeyID);
          };
        },
        resolve,
        reject
      )
    );
  },

  // testFn(record) is called with a database record and should return true if
  // that record should be deleted.
  clearIf: function(testFn) {
    console.debug("clearIf()");
    return new Promise((resolve, reject) =>
      this.newTxn(
        "readwrite",
        this._dbStoreName,
        (aTxn, aStore) => {
          aTxn.result = undefined;

          aStore.openCursor().onsuccess = event => {
            let cursor = event.target.result;
            if (cursor) {
              let record = this.toPushRecord(cursor.value);
              if (testFn(record)) {
                let deleteRequest = cursor.delete();
                deleteRequest.onerror = e => {
                  console.error("clearIf: Error removing record",
                    record.keyID, e);
                }
              }
              cursor.continue();
            }
          }
        },
        resolve,
        reject
      )
    );
  },

  getByPushEndpoint: function(aPushEndpoint) {
    console.debug("getByPushEndpoint()");

    return new Promise((resolve, reject) =>
      this.newTxn(
        "readonly",
        this._dbStoreName,
        (aTxn, aStore) => {
          aTxn.result = undefined;

          let index = aStore.index("pushEndpoint");
          index.get(aPushEndpoint).onsuccess = aEvent => {
            let record = this.toPushRecord(aEvent.target.result);
            console.debug("getByPushEndpoint: Got record", record);
            aTxn.result = record;
          };
        },
        resolve,
        reject
      )
    );
  },

  getByKeyID: function(aKeyID) {
    console.debug("getByKeyID()");

    return new Promise((resolve, reject) =>
      this.newTxn(
        "readonly",
        this._dbStoreName,
        (aTxn, aStore) => {
          aTxn.result = undefined;

          aStore.get(aKeyID).onsuccess = aEvent => {
            let record = this.toPushRecord(aEvent.target.result);
            console.debug("getByKeyID: Got record", record);
            aTxn.result = record;
          };
        },
        resolve,
        reject
      )
    );
  },

  /**
   * Reduces all records associated with an origin to a single value.
   *
   * @param {String} origin The origin, matched as a prefix against the scope.
   * @param {String} originAttributes Additional origin attributes. Requires
   *  an exact match.
   * @param {Function} callback A function with the signature `(result,
   *  record, cursor)`, where `result` is the value returned by the previous
   *  invocation, `record` is the registration, and `cursor` is an `IDBCursor`.
   * @param {Object} [initialValue] The value to use for the first invocation.
   * @returns {Promise} Resolves with the value of the last invocation.
   */
  reduceByOrigin: function(origin, originAttributes, callback, initialValue) {
    console.debug("forEachOrigin()");

    return new Promise((resolve, reject) =>
      this.newTxn(
        "readwrite",
        this._dbStoreName,
        (aTxn, aStore) => {
          aTxn.result = initialValue;

          let index = aStore.index("identifiers");
          let range = IDBKeyRange.bound(
            [origin, originAttributes],
            [origin + "\x7f", originAttributes]
          );
          index.openCursor(range).onsuccess = event => {
            let cursor = event.target.result;
            if (!cursor) {
              return;
            }
            let record = this.toPushRecord(cursor.value);
            aTxn.result = callback(aTxn.result, record, cursor);
            cursor.continue();
          };
        },
        resolve,
        reject
      )
    );
  },

  // Perform a unique match against { scope, originAttributes }
  getByIdentifiers: function(aPageRecord) {
    console.debug("getByIdentifiers()", aPageRecord);
    if (!aPageRecord.scope || aPageRecord.originAttributes == undefined) {
      console.error("getByIdentifiers: Scope and originAttributes are required",
        aPageRecord);
      return Promise.reject(new TypeError("Invalid page record"));
    }

    return new Promise((resolve, reject) =>
      this.newTxn(
        "readonly",
        this._dbStoreName,
        (aTxn, aStore) => {
          aTxn.result = undefined;

          let index = aStore.index("identifiers");
          let request = index.get(IDBKeyRange.only([aPageRecord.scope, aPageRecord.originAttributes]));
          request.onsuccess = aEvent => {
            aTxn.result = this.toPushRecord(aEvent.target.result);
          };
        },
        resolve,
        reject
      )
    );
  },

  _getAllByKey: function(aKeyName, aKeyValue) {
    return new Promise((resolve, reject) =>
      this.newTxn(
        "readonly",
        this._dbStoreName,
        (aTxn, aStore) => {
          aTxn.result = undefined;

          let index = aStore.index(aKeyName);
          // It seems ok to use getAll here, since unlike contacts or other
          // high storage APIs, we don't expect more than a handful of
          // registrations per domain, and usually only one.
          let getAllReq = index.mozGetAll(aKeyValue);
          getAllReq.onsuccess = aEvent => {
            aTxn.result = aEvent.target.result.map(
              record => this.toPushRecord(record));
          };
        },
        resolve,
        reject
      )
    );
  },

  // aOriginAttributes must be a string!
  getAllByOriginAttributes: function(aOriginAttributes) {
    if (typeof aOriginAttributes !== "string") {
      return Promise.reject("Expected string!");
    }
    return this._getAllByKey("originAttributes", aOriginAttributes);
  },

  getAllKeyIDs: function() {
    console.debug("getAllKeyIDs()");

    return new Promise((resolve, reject) =>
      this.newTxn(
        "readonly",
        this._dbStoreName,
        (aTxn, aStore) => {
          aTxn.result = undefined;
          aStore.mozGetAll().onsuccess = event => {
            aTxn.result = event.target.result.map(
              record => this.toPushRecord(record));
          };
        },
        resolve,
        reject
      )
    );
  },

  _getAllByPushQuota: function(range) {
    console.debug("getAllByPushQuota()");

    return new Promise((resolve, reject) =>
      this.newTxn(
        "readonly",
        this._dbStoreName,
        (aTxn, aStore) => {
          aTxn.result = [];

          let index = aStore.index("quota");
          index.openCursor(range).onsuccess = event => {
            let cursor = event.target.result;
            if (cursor) {
              aTxn.result.push(this.toPushRecord(cursor.value));
              cursor.continue();
            }
          };
        },
        resolve,
        reject
      )
    );
  },

  getAllUnexpired: function() {
    console.debug("getAllUnexpired()");
    return this._getAllByPushQuota(IDBKeyRange.lowerBound(1));
  },

  getAllExpired: function() {
    console.debug("getAllExpired()");
    return this._getAllByPushQuota(IDBKeyRange.only(0));
  },

  /**
   * Updates an existing push registration.
   *
   * @param {String} aKeyID The registration ID.
   * @param {Function} aUpdateFunc A function that receives the existing
   *  registration record as its argument, and returns a new record. If the
   *  function returns `null` or `undefined`, the record will not be updated.
   *  If the record does not exist, the function will not be called.
   * @returns {Promise} A promise resolved with either the updated record, or
   *  `undefined` if the record was not updated.
   */
  update: function(aKeyID, aUpdateFunc) {
    return new Promise((resolve, reject) =>
      this.newTxn(
        "readwrite",
        this._dbStoreName,
        (aTxn, aStore) => {
          aStore.get(aKeyID).onsuccess = aEvent => {
            aTxn.result = undefined;

            let record = aEvent.target.result;
            if (!record) {
              console.error("update: Record does not exist", aKeyID);
              return;
            }
            let newRecord = aUpdateFunc(this.toPushRecord(record));
            if (!this.isValidRecord(newRecord)) {
              console.error("update: Ignoring invalid update",
                aKeyID, newRecord);
              return;
            }
            function putRecord() {
              let req = aStore.put(newRecord);
              req.onsuccess = aEvent => {
                console.debug("update: Update successful", aKeyID, newRecord);
                aTxn.result = newRecord;
              };
            }
            if (aKeyID === newRecord.keyID) {
              putRecord();
            } else {
              // If we changed the primary key, delete the old record to avoid
              // unique constraint errors.
              aStore.delete(aKeyID).onsuccess = putRecord;
            }
          };
        },
        resolve,
        reject
      )
    );
  },

  drop: function() {
    console.debug("drop()");

    return new Promise((resolve, reject) =>
      this.newTxn(
        "readwrite",
        this._dbStoreName,
        function txnCb(aTxn, aStore) {
          aStore.clear();
        },
        resolve,
        reject
      )
    );
  },
};
