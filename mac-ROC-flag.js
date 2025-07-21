// ==UserScript==
// @name         mac-ROC-flag
// @namespace    https://github.com/tizee-tampermonkey-scripts/tampermonkey-mac-roc-flag
// @homepage     https://github.com/tizee-tampermonkey-scripts/tampermonkey-mac-roc-flag
// @downloadURL  https://raw.githubusercontent.com/tizee-tampermonkey-scripts/tampermonkey-mac-ROC-flag/refs/heads/main/mac-ROC-flag.js
// @updateURL    https://raw.githubusercontent.com/tizee-tampermonkey-scripts/tampermonkey-mac-ROC-flag/refs/heads/main/mac-ROC-flag.js
// @version      1.1
// @description  Replace ROC flag unicode to images in Apple devices
// @author       tizee
// @icon         https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f1f9-1f1fc.png
// @grant        GM_addStyle
// @match        *://*/*
// ==/UserScript==

(function () {
  'use strict';
  let _ = document;

  const ROC_FLAG_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#FE0000" d="M32 5H17v13H0v9c0 2.209 1.791 4 4 4h28c2.209 0 4-1.791 4-4V9c0-2.209-1.791-4-4-4z"/><path fill="#000095" d="M17 5H4C1.791 5 0 6.791 0 9v9h17V5zm-6.063 4.61l2.035-.548-1.491 1.487c-.121-.348-.307-.665-.544-.939zm.251 1.89c0 1.346-1.091 2.438-2.438 2.438S6.312 12.846 6.312 11.5 7.404 9.062 8.75 9.062s2.438 1.092 2.438 2.438zm0-4.222l-.548 2.035c-.273-.237-.591-.423-.939-.544l1.487-1.491zM8.75 6.625l.542 2.034c-.175-.033-.357-.052-.542-.052s-.367.019-.542.052l.542-2.034zm-.951 2.144c-.348.121-.665.307-.939.544l-.548-2.035 1.487 1.491zm-1.236.841c-.237.273-.423.591-.544.939L4.528 9.062l2.035.548zm-.654 1.348c-.034.176-.052.357-.052.542 0 .185.018.367.052.542L3.875 11.5l2.034-.542zm.11 1.492c.121.348.308.666.544.939l-2.035.548 1.491-1.487zm.293 3.272l.548-2.035c.273.236.591.423.939.544l-1.487 1.491zm2.438.653l-.542-2.034c.176.034.357.052.542.052s.367-.018.542-.052l-.542 2.034zm.951-2.144c.348-.121.666-.308.939-.544l.548 2.035-1.487-1.491zm1.236-.841c.237-.273.423-.591.544-.939l1.491 1.487-2.035-.548zm.654-1.348c.034-.176.052-.357.052-.542 0-.185-.018-.367-.052-.542l2.034.542-2.034.542z"/><path fill="#FFF" d="M9.292 8.659L8.75 6.625l-.542 2.034c.175-.033.357-.052.542-.052s.367.019.542.052zM5.857 11.5c0-.185.018-.367.052-.542l-2.034.542 2.034.542c-.033-.175-.052-.357-.052-.542zm2.351 2.841l.542 2.034.542-2.034c-.176.034-.357.052-.542.052s-.367-.019-.542-.052zm3.435-2.841c0 .185-.018.367-.052.542l2.034-.542-2.034-.542c.033.175.052.357.052.542zm-.455-4.222L9.701 8.769c.348.122.666.308.939.544l.548-2.035zm-.251 6.112l2.035.548-1.491-1.487c-.121.348-.307.665-.544.939zm-4.625 2.332l1.487-1.491c-.348-.121-.666-.308-.939-.544l-.548 2.035zm.251-6.112l-2.035-.548 1.491 1.487c.121-.348.307-.665.544-.939zm3.138 4.621l1.487 1.491-.548-2.035c-.274.237-.591.423-.939.544zM6.019 12.45l-1.491 1.487 2.035-.548c-.237-.273-.423-.59-.544-.939zm1.78-3.681L6.312 7.278l.548 2.035c.274-.237.591-.423.939-.544zm5.173.293l-2.035.548c.237.273.423.591.544.939l1.491-1.487z"/><circle fill="#FFF" cx="8.75" cy="11.5" r="2.438"/><style xmlns="http://www.w3.org/1999/xhtml" id="mdd4r5i0.q8s">img.emoji {
   height: 1em;
   width: 1em;
   margin: 0 .05em 0 .1em;
   vertical-align: -0.1em;
   }</style></svg>`

  function replaceROCFlag(node) {
    // ROC flag = \uD83C\uDDF9\uD83C\uDDFC
    // T: \uD83C\uDDF9, U+1F1F9
    // W: \uD83C\uDDFC, U+1F1FC
    let flag = /\u{1F1F9}\u{1F1FC}/gu;
    const textContent = node.nodeValue;

    if (!textContent || !flag.test(textContent)) {
      return false;
    }

    // Create a temporary div to handle the HTML replacement
    const tempDiv = document.createElement('div');
    const flagPlaceholder = '___ROC_FLAG_PLACEHOLDER___';

    // Replace all flag occurrences with placeholder
    const textWithPlaceholder = textContent.replace(flag, flagPlaceholder);

    // Split by placeholder and rebuild with SVG
    const parts = textWithPlaceholder.split(flagPlaceholder);

    if (parts.length === 1) {
      return false; // No replacement occurred
    }

    const parent = node.parentNode;

    // Insert parts and SVG replacements
    for (let i = 0; i < parts.length; i++) {
      // Insert text part
      if (parts[i]) {
        parent.insertBefore(document.createTextNode(parts[i]), node);
      }

      // Insert SVG (except after the last part)
      if (i < parts.length - 1) {
        const span = document.createElement('span');
        span.className = 'roc-flag-replacement';
        span.innerHTML = ROC_FLAG_SVG;

        // Set proper dimensions for the SVG
        const svg = span.querySelector('svg');
        if (svg) {
          svg.style.height = '1em';
          svg.style.width = '1em';
          svg.style.margin = '0 .05em 0 .1em';
          svg.style.verticalAlign = '-0.1em';
        }

        parent.insertBefore(span, node);
      }
    }

    // Remove the original node
    parent.removeChild(node);

    console.debug('Replace ROC flag:', parts.length - 1, 'occurrences replaced');
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
