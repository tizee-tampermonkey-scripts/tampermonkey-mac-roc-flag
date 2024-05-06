// ==UserScript==
// @name         mac-ROC-flag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace ROC flag unicode to images in Apple devices
// @author       tizee
// @homepage     https://github.com/tizee/mac-ROC-flag.js
// @icon         https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f1f9-1f1fc.png
// @grant        GM_addStyle
// @match        *://*/*
// @require      https://unpkg.com/twemoji@latest/dist/twemoji.min.js
// ==/UserScript==

(function () {
  'use strict';
  let _ = document;

  GM_addStyle(`img.emoji {
   height: 1em;
   width: 1em;
   margin: 0 .05em 0 .1em;
   vertical-align: -0.1em;
   }`);

  function replaceROCFlag(node) {
    // ROC flag = \uD83C\uDDF9\uD83C\uDDFC
    // T: \uD83C\uDDF9
    // W: \uD83C\uDDFC
    let flag = /\uD83C\uDDF9\uD83C\uDDFC/g;
    let match = undefined;
    if (!node.nodeValue || !(match = flag.exec(node.nodeValue))) {
      return false;
    }

    // modify the text node's container
    let res = twemoji.parse(node.parentNode, {
      folder: 'svg',
      ext: '.svg',
      // https://github.com/twitter/twemoji/issues/580
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/'
    });
    console.debug('Replace ROC flag:', node, res);
    return true;
  }

  // Watch newly added DOM nodes, and save them for later use
  function mutationHandler(mutationList) {
    mutationList.forEach(function (mutationRecord) {
      mutationRecord.addedNodes.forEach(function (node) {
        scanTextNodes(node);
      });
    });
  }

  // dfs
  function scanTextNodes(node) {
    // The node could have been detached from the DOM tree
    if (!node.parentNode || !_.body.contains(node)) {
      return;
    }

    // Ignore text boxes and echoes
    let excludeTags = {ruby: true, script: true, select: true, textarea: true};

    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (node.tagName.toLowerCase() in excludeTags || node.isContentEditable) {
          return;
        }
        return node.childNodes.forEach(scanTextNodes);

      case Node.TEXT_NODE:
        return replaceROCFlag(node);
    }
  }

  // this script does not support mobile devices
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    return;
  }

  const pl = window.navigator.platform.toLowerCase();
  const platform = pl.indexOf("mac") >= 0 ? "m" : pl.indexOf("win") >= 0 ? "w" : pl.indexOf("linux") >= 0 ? "l" : pl.indexOf("x11") >= 0 ? "l" : undefined;

  // only apple devices need this script
  if (platform != "m") {
    return;
  }

  let observer = new MutationObserver(mutationHandler);
  observer.observe(_.body, {childList: true, subtree: true});
  scanTextNodes(_.body);
})();
