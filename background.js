'use strict'

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("adding yellow box");

  chrome.tabs.executeScript({
    file: 'toggle.js'
  });

});
