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

  RELEASE_BUILD:
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

  MOZ_SAFE_BROWSING:
//@line 79 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 83 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SANDBOX:
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

  MOZ_SERVICES_CLOUDSYNC:
//@line 107 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 111 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_UPDATER:
//@line 114 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 118 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SWITCHBOARD:
//@line 123 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 125 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_WEBRTC:
//@line 128 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
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
//@line 156 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  "win",
//@line 168 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

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
//@line 183 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 187 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_VERIFY_MAR_SIGNATURE:
//@line 190 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 194 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_MAINTENANCE_SERVICE:
//@line 197 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 201 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  E10S_TESTING_ONLY:
//@line 206 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 208 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  DEBUG:
//@line 213 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 215 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_B2G_RIL:
//@line 220 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 222 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_GRAPHENE:
//@line 227 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 229 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SYSTEM_NSS:
//@line 234 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 236 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_PLACES:
//@line 239 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 243 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_REQUIRE_SIGNING:
//@line 246 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 250 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MENUBAR_CAN_AUTOHIDE:
//@line 253 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 257 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  CAN_DRAW_IN_TITLEBAR:
//@line 260 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 264 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_ANDROID_HISTORY:
//@line 269 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 271 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_TOOLKIT_SEARCH:
//@line 274 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 278 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_ENABLE_PROFILER_SPS:
//@line 281 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 285 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  DLL_PREFIX: "",
  DLL_SUFFIX: ".dll",

  MOZ_APP_NAME: "firefox",
  MOZ_APP_VERSION: "48.0",
  MOZ_APP_VERSION_DISPLAY: "48.0",
  MOZ_BUILD_APP: "browser",
  MOZ_MACBUNDLE_NAME: "Firefox.app",
  MOZ_UPDATE_CHANNEL: "release",
  INSTALL_LOCALE: "en-US",
  MOZ_WIDGET_TOOLKIT: "windows",
  ANDROID_PACKAGE_NAME: "org.mozilla.firefox",
  MOZ_B2G_VERSION: "1.0.0",
  MOZ_B2G_OS_NAME: "",

  MOZ_ANDROID_APZ:
//@line 305 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
    false,
//@line 307 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  DEBUG_JS_MODULES: "",

  // URL to the hg revision this was built from (e.g.
  // "https://hg.mozilla.org/mozilla-central/rev/6256ec9113c1")
  // On unofficial builds, this is an empty string.
//@line 315 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  SOURCE_REVISION_URL: "https://hg.mozilla.org/releases/mozilla-release/rev/c1de04f39fa956cfce83f6065b0e709369215ed5",

  MOZ_NUWA_PROCESS:
//@line 321 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
    false
//@line 323 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
});
