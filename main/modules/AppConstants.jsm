/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "Services", "resource://gre/modules/Services.jsm");

this.EXPORTED_SYMBOLS = ["AppConstants"];

// Immutable for export.
this.AppConstants = Object.freeze({
  // See this wiki page for more details about channel specific build
  // defines: https://wiki.mozilla.org/Platform/Channel-specific_build_defines
  NIGHTLY_BUILD:
//@line 22 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 24 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  RELEASE_OR_BETA:
//@line 27 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 31 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  ACCESSIBILITY:
//@line 34 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 38 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  // Official corresponds, roughly, to whether this build is performed
  // on Mozilla's continuous integration infrastructure. You should
  // disable developer-only functionality when this flag is set.
  MOZILLA_OFFICIAL:
//@line 44 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 48 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_OFFICIAL_BRANDING:
//@line 51 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 55 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_DEV_EDITION:
//@line 60 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 62 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SERVICES_HEALTHREPORT:
//@line 65 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 69 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_DATA_REPORTING:
//@line 72 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 76 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SANDBOX:
//@line 79 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 83 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_CONTENT_SANDBOX:
//@line 86 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 90 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_TELEMETRY_REPORTING:
//@line 93 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 97 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_TELEMETRY_ON_BY_DEFAULT:
//@line 102 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 104 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_UPDATER:
//@line 107 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 111 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SWITCHBOARD:
//@line 116 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 118 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_WEBRTC:
//@line 121 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 125 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_WIDGET_GTK:
//@line 130 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 132 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

//@line 134 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  MOZ_B2G:
//@line 138 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 140 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  XP_UNIX:
//@line 145 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 147 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

//@line 150 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  platform:
//@line 154 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  "win",
//@line 166 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  isPlatformAndVersionAtLeast(platform, version) {
    let platformVersion = Services.sysinfo.getProperty("version");
    return platform == this.platform &&
           Services.vc.compare(platformVersion, version) >= 0;
  },

  isPlatformAndVersionAtMost(platform, version) {
    let platformVersion = Services.sysinfo.getProperty("version");
    return platform == this.platform &&
           Services.vc.compare(platformVersion, version) <= 0;
  },

  MOZ_CRASHREPORTER:
//@line 181 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 185 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_VERIFY_MAR_SIGNATURE:
//@line 188 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 192 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_MAINTENANCE_SERVICE:
//@line 195 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 199 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  E10S_TESTING_ONLY:
//@line 204 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 206 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  DEBUG:
//@line 211 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 213 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  ASAN:
//@line 218 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 220 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_B2G_RIL:
//@line 225 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 227 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_GRAPHENE:
//@line 232 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 234 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SYSTEM_NSS:
//@line 239 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 241 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_PLACES:
//@line 244 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 248 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_ADDON_SIGNING:
//@line 251 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 255 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_REQUIRE_SIGNING:
//@line 258 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 262 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_ALLOW_LEGACY_EXTENSIONS:
//@line 265 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 269 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  INSTALL_COMPACT_THEMES:
//@line 272 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 276 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MENUBAR_CAN_AUTOHIDE:
//@line 279 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 283 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  CAN_DRAW_IN_TITLEBAR:
//@line 286 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 290 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_ANDROID_HISTORY:
//@line 295 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 297 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_TOOLKIT_SEARCH:
//@line 300 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 304 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_GECKO_PROFILER:
//@line 307 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 311 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_ANDROID_ACTIVITY_STREAM:
//@line 316 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 318 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  DLL_PREFIX: "",
  DLL_SUFFIX: ".dll",

  MOZ_APP_NAME: "firefox",
  MOZ_APP_VERSION: "55.0.3",
  MOZ_APP_VERSION_DISPLAY: "55.0.3",
  MOZ_BUILD_APP: "browser",
  MOZ_MACBUNDLE_NAME: "Firefox.app",
  MOZ_UPDATE_CHANNEL: "release",
  INSTALL_LOCALE: "en-US",
  MOZ_WIDGET_TOOLKIT: "windows",
  ANDROID_PACKAGE_NAME: "org.mozilla.firefox",
  MOZ_B2G_VERSION: "1.0.0",
  MOZ_B2G_OS_NAME: "",

  DEBUG_JS_MODULES: "",

  // URL to the hg revision this was built from (e.g.
  // "https://hg.mozilla.org/mozilla-central/rev/6256ec9113c1")
  // On unofficial builds, this is an empty string.
//@line 342 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  SOURCE_REVISION_URL: "https://hg.mozilla.org/releases/mozilla-release/rev/10a244c0f835d286d49a571dab59b698d7404e28",

  HAVE_USR_LIB64_DIR:
//@line 348 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
    false,
//@line 350 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  HAVE_SHELL_SERVICE:
//@line 353 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
    true,
//@line 357 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_PHOTON_ANIMATIONS:
//@line 362 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
    false,
//@line 364 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_PHOTON_THEME:
//@line 369 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
    false,
//@line 371 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

});
