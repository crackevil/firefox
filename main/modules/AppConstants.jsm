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

  MOZ_DEVICES:
//@line 81 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 83 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SAFE_BROWSING:
//@line 86 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 90 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SANDBOX:
//@line 93 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 97 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_TELEMETRY_REPORTING:
//@line 100 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 104 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_TELEMETRY_ON_BY_DEFAULT:
//@line 109 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 111 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SERVICES_CLOUDSYNC:
//@line 114 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 118 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_UPDATER:
//@line 121 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 125 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_SWITCHBOARD:
//@line 130 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 132 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_WEBRTC:
//@line 135 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 139 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

//@line 141 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  MOZ_B2G:
//@line 145 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 147 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  XP_UNIX:
//@line 152 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 154 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

//@line 157 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  platform:
//@line 163 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  "win",
//@line 175 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

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
//@line 190 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 194 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_VERIFY_MAR_SIGNATURE:
//@line 197 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 201 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_MAINTENANCE_SERVICE:
//@line 204 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 208 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  E10S_TESTING_ONLY:
//@line 213 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 215 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  DEBUG:
//@line 220 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 222 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_B2G_RIL:
//@line 227 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 229 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_B2GDROID:
//@line 234 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 236 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_GRAPHENE:
//@line 241 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 243 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_NATIVE_NSS:
//@line 248 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 250 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_PLACES:
//@line 253 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 257 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_REQUIRE_SIGNING:
//@line 262 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 264 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MENUBAR_CAN_AUTOHIDE:
//@line 267 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 271 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  CAN_DRAW_IN_TITLEBAR:
//@line 274 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 278 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_ANDROID_HISTORY:
//@line 283 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  false,
//@line 285 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_TOOLKIT_SEARCH:
//@line 288 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 292 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  MOZ_ENABLE_PROFILER_SPS:
//@line 295 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  true,
//@line 299 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"

  DLL_PREFIX: "",
  DLL_SUFFIX: ".dll",

  MOZ_APP_NAME: "firefox",
  MOZ_APP_VERSION: "47.0",
  MOZ_APP_VERSION_DISPLAY: "47.0",
  MOZ_BUILD_APP: "browser",
  MOZ_MACBUNDLE_NAME: "Firefox.app",
  MOZ_UPDATE_CHANNEL: "release",
  INSTALL_LOCALE: "en-US",
  MOZ_WIDGET_TOOLKIT: "windows",
  ANDROID_PACKAGE_NAME: "org.mozilla.firefox",
  MOZ_B2G_VERSION: "1.0.0",
  MOZ_B2G_OS_NAME: "",

  MOZ_ANDROID_APZ:
//@line 319 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
    false,
//@line 321 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  DEBUG_JS_MODULES: "",

  // URL to the hg revision this was built from (e.g.
  // "https://hg.mozilla.org/mozilla-central/rev/6256ec9113c1")
  // On unofficial builds, this is an empty string.
//@line 329 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
  SOURCE_REVISION_URL: "https://hg.mozilla.org/releases/mozilla-release/rev/b0310cb90fd0158abd0e92850a47768649ba3d77",

  MOZ_NUWA_PROCESS:
//@line 335 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
    false
//@line 337 "c:\builds\moz2_slave\m-rel-w64-00000000000000000000\build\src\toolkit\modules\AppConstants.jsm"
});
