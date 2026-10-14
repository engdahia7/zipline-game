/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "3c0a7bce1233a60e306ec615e197b959"
  }, {
    "url": "pwa-512x512.png",
    "revision": "24f4fc50897bfc61344ffbbb2e005768"
  }, {
    "url": "pwa-192x192.png",
    "revision": "0be29009398851510f4bb8390ecb4659"
  }, {
    "url": "index.html",
    "revision": "b7091982a6c4e6d412844661f3f4bad5"
  }, {
    "url": "icon.svg",
    "revision": "cc5994d7bdabef4cc5811bf13509a56d"
  }, {
    "url": "icon-maskable.svg",
    "revision": "04afd71b2eaca7ab5e126b04e16421eb"
  }, {
    "url": "favicon.png",
    "revision": "19cd859f153bf0293edc9b4d8b4c3ca5"
  }, {
    "url": "favicon.ico",
    "revision": "f48f8db4e664849ea6c2a91765015997"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "a59e5a8b5febfef3e51add25e2e6ffce"
  }, {
    "url": "assets/index-DIMFmEpF.css",
    "revision": null
  }, {
    "url": "assets/index-0agU32ka.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "a59e5a8b5febfef3e51add25e2e6ffce"
  }, {
    "url": "favicon.ico",
    "revision": "f48f8db4e664849ea6c2a91765015997"
  }, {
    "url": "favicon.png",
    "revision": "19cd859f153bf0293edc9b4d8b4c3ca5"
  }, {
    "url": "icon.svg",
    "revision": "cc5994d7bdabef4cc5811bf13509a56d"
  }, {
    "url": "pwa-192x192.png",
    "revision": "0be29009398851510f4bb8390ecb4659"
  }, {
    "url": "pwa-512x512.png",
    "revision": "24f4fc50897bfc61344ffbbb2e005768"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "3c0a7bce1233a60e306ec615e197b959"
  }, {
    "url": "manifest.webmanifest",
    "revision": "361ea7905c93fdb519791db16a98ae56"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
