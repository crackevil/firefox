//@line 2 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
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
//@line 21 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 23 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  RELEASE_BUILD:
//@line 26 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 30 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  ACCESSIBILITY:
//@line 33 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 37 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  // Official corresponds, roughly, to whether this build is performed
  // on Mozilla's continuous integration infrastructure. You should
  // disable developer-only functionality when this flag is set.
  MOZILLA_OFFICIAL:
//@line 43 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 47 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_OFFICIAL_BRANDING:
//@line 50 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 54 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_DEV_EDITION:
//@line 59 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 61 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SERVICES_HEALTHREPORT:
//@line 64 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 68 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_DATA_REPORTING:
//@line 71 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 75 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_DEVICES:
//@line 80 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 82 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SAFE_BROWSING:
//@line 85 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 89 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SANDBOX:
//@line 92 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 96 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_TELEMETRY_REPORTING:
//@line 99 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 103 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_TELEMETRY_ON_BY_DEFAULT:
//@line 108 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 110 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SERVICES_CLOUDSYNC:
//@line 113 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 117 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_UPDATER:
//@line 120 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 124 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SWITCHBOARD:
//@line 129 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 131 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_WEBRTC:
//@line 134 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 138 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

//@line 140 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  MOZ_B2G:
//@line 144 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 146 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  XP_UNIX:
//@line 151 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 153 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

//@line 156 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  platform:
//@line 162 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  "win",
//@line 174 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

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
//@line 189 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 193 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_VERIFY_MAR_SIGNATURE:
//@line 196 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 200 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_MAINTENANCE_SERVICE:
//@line 203 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 207 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  E10S_TESTING_ONLY:
//@line 212 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 214 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  DEBUG:
//@line 219 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 221 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_B2G_RIL:
//@line 226 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 228 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_B2GDROID:
//@line 233 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 235 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_GRAPHENE:
//@line 240 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 242 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_PLACES:
//@line 245 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 249 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_REQUIRE_SIGNING:
//@line 254 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 256 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MENUBAR_CAN_AUTOHIDE:
//@line 259 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 263 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  CAN_DRAW_IN_TITLEBAR:
//@line 266 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 270 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_ANDROID_HISTORY:
//@line 275 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 277 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  DLL_PREFIX: "",
  DLL_SUFFIX: ".dll",

  MOZ_APP_NAME: "firefox",
  MOZ_APP_VERSION: "46.0",
  MOZ_APP_VERSION_DISPLAY: "46.0",
  MOZ_BUILD_APP: "browser",
  MOZ_MACBUNDLE_NAME: "Firefox.app",
  MOZ_UPDATE_CHANNEL: "release",
  INSTALL_LOCALE: "en-US",
  MOZ_WIDGET_TOOLKIT: "windows",
  ANDROID_PACKAGE_NAME: "org.mozilla.firefox",
  MOZ_B2G_VERSION: "1.0.0",
  MOZ_B2G_OS_NAME: "",

  MOZ_ANDROID_APZ:
//@line 297 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
    false,
//@line 299 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  DEBUG_JS_MODULES: "",

  // URL to the hg revision this was built from (e.g.
  // "https://hg.mozilla.org/mozilla-central/rev/6256ec9113c1")
  // On unofficial builds, this is an empty string.
  SOURCE_REVISION_URL: "https://hg.mozilla.org/releases/mozilla-release/rev/078baf501b55eaa47f3b189fda4dd28dae1fa257",

  MOZ_NUWA_PROCESS:
//@line 310 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
    false
//@line 312 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
});
