/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const { URL } = require("sdk/url");

// Character codes used in various parsing helper functions.
const CHAR_CODE_A = "a".charCodeAt(0);
const CHAR_CODE_C = "c".charCodeAt(0);
const CHAR_CODE_E = "e".charCodeAt(0);
const CHAR_CODE_F = "f".charCodeAt(0);
const CHAR_CODE_H = "h".charCodeAt(0);
const CHAR_CODE_I = "i".charCodeAt(0);
const CHAR_CODE_J = "j".charCodeAt(0);
const CHAR_CODE_L = "l".charCodeAt(0);
const CHAR_CODE_M = "m".charCodeAt(0);
const CHAR_CODE_O = "o".charCodeAt(0);
const CHAR_CODE_P = "p".charCodeAt(0);
const CHAR_CODE_R = "r".charCodeAt(0);
const CHAR_CODE_S = "s".charCodeAt(0);
const CHAR_CODE_T = "t".charCodeAt(0);
const CHAR_CODE_U = "u".charCodeAt(0);
const CHAR_CODE_COLON = ":".charCodeAt(0);
const CHAR_CODE_SLASH = "/".charCodeAt(0);

// The cache used in the `nsIURL` function.
const gURLStore = new Map();

/**
 * Takes a string and returns an object containing all the properties
 * available on an URL instance, with additional properties (fileName),
 * Leverages caching.
 *
 * @TODO If loaded through Browser Loader, we can use the web API URL
 * directly, giving us the same interface without needing the SDK --
 * we still need to add `fileName` though.
 *
 * @param {String} location
 * @return {Object?} An object containing most properties available
 *                   in https://developer.mozilla.org/en-US/docs/Web/API/URL
 */

function parseURL(location) {
  let url = gURLStore.get(location);

  if (url !== void 0) {
    return url;
  }

  try {
    url = new URL(location);
    // Definitions:
    // Example: https://foo.com:8888/file.js
    // `hostname`: "foo.com"
    // `host`: "foo.com:8888"
    //
    // sdk/url does not match several definitions.: both `host` and `hostname`
    // are actually the `hostname` (even though this is the `host` property on the
    // original nsIURL, with `hostPort` representing the actual `host` name, AH!!!)
    // So normalize all that garbage here.
    let isChrome = isChromeScheme(location);
    let fileName = url.fileName || "/";
    let hostname = isChrome ? null : url.hostname;
    let host = isChrome ? null :
               url.port ? `${url.host}:${url.port}` :
               url.host;

    let parsed = Object.assign({}, url, { host, fileName, hostname });
    gURLStore.set(location, parsed);
    return parsed;
  }
  catch (e) {
    gURLStore.set(location, null);
    return null;
  }
}

/**
 * Parse a source into a short and long name as well as a host name.
 *
 * @param {String} source
 *        The source to parse. Can be a URI or names like "(eval)" or "self-hosted".
 * @param {String} unknownSourceString
 *        The string to use if no valid source name can be generated.
 * @return {Object}
 *         An object with the following properties:
 *           - {String} short: A short name for the source.
 *           - {String} long: The full, long name for the source.
 *           - {String?} host: If available, the host name for the source.
 */
function getSourceNames (source, unknownSourceString) {
  let short, long, host;
  const sourceStr = source ? String(source) : "";
  const parsedUrl = parseURL(sourceStr);

  if (!parsedUrl) {
    // Malformed URI.
    long = sourceStr;
    short = sourceStr.slice(0, 100);
  } else {
    short = parsedUrl.fileName;
    long = parsedUrl.href;
    host = parsedUrl.host;
  }

  if (!short) {
    if (!long) {
      long = unknownSourceString;
    }
    short = long.slice(0, 100);
  }

  return { short, long, host };
}

// For the functions below, we assume that we will never access the location
// argument out of bounds, which is indeed the vast majority of cases.
//
// They are written this way because they are hot. Each frame is checked for
// being content or chrome when processing the profile.

function isColonSlashSlash(location, i=0) {
  return location.charCodeAt(++i) === CHAR_CODE_COLON &&
         location.charCodeAt(++i) === CHAR_CODE_SLASH &&
         location.charCodeAt(++i) === CHAR_CODE_SLASH;
}

function isContentScheme(location, i=0) {
  let firstChar = location.charCodeAt(i);

  switch (firstChar) {
  case CHAR_CODE_H: // "http://" or "https://"
    if (location.charCodeAt(++i) === CHAR_CODE_T &&
        location.charCodeAt(++i) === CHAR_CODE_T &&
        location.charCodeAt(++i) === CHAR_CODE_P) {
      if (location.charCodeAt(i + 1) === CHAR_CODE_S) {
        ++i;
      }
      return isColonSlashSlash(location, i);
    }
    return false;

  case CHAR_CODE_F: // "file://"
    if (location.charCodeAt(++i) === CHAR_CODE_I &&
        location.charCodeAt(++i) === CHAR_CODE_L &&
        location.charCodeAt(++i) === CHAR_CODE_E) {
      return isColonSlashSlash(location, i);
    }
    return false;

  case CHAR_CODE_A: // "app://"
    if (location.charCodeAt(++i) == CHAR_CODE_P &&
        location.charCodeAt(++i) == CHAR_CODE_P) {
      return isColonSlashSlash(location, i);
    }
    return false;

  default:
    return false;
  }
}

function isChromeScheme(location, i=0) {
  let firstChar = location.charCodeAt(i);

  switch (firstChar) {
  case CHAR_CODE_C: // "chrome://"
    if (location.charCodeAt(++i) === CHAR_CODE_H &&
        location.charCodeAt(++i) === CHAR_CODE_R &&
        location.charCodeAt(++i) === CHAR_CODE_O &&
        location.charCodeAt(++i) === CHAR_CODE_M &&
        location.charCodeAt(++i) === CHAR_CODE_E) {
      return isColonSlashSlash(location, i);
    }
    return false;

  case CHAR_CODE_R: // "resource://"
    if (location.charCodeAt(++i) === CHAR_CODE_E &&
        location.charCodeAt(++i) === CHAR_CODE_S &&
        location.charCodeAt(++i) === CHAR_CODE_O &&
        location.charCodeAt(++i) === CHAR_CODE_U &&
        location.charCodeAt(++i) === CHAR_CODE_R &&
        location.charCodeAt(++i) === CHAR_CODE_C &&
        location.charCodeAt(++i) === CHAR_CODE_E) {
      return isColonSlashSlash(location, i);
    }
    return false;

  case CHAR_CODE_J: // "jar:file://"
    if (location.charCodeAt(++i) === CHAR_CODE_A &&
        location.charCodeAt(++i) === CHAR_CODE_R &&
        location.charCodeAt(++i) === CHAR_CODE_COLON &&
        location.charCodeAt(++i) === CHAR_CODE_F &&
        location.charCodeAt(++i) === CHAR_CODE_I &&
        location.charCodeAt(++i) === CHAR_CODE_L &&
        location.charCodeAt(++i) === CHAR_CODE_E) {
      return isColonSlashSlash(location, i);
    }
    return false;

  default:
    return false;
  }
}

exports.parseURL = parseURL;
exports.getSourceNames = getSourceNames;
exports.isChromeScheme = isChromeScheme;
exports.isContentScheme = isContentScheme;
