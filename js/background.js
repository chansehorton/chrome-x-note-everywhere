'use strict'

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, { toggle: true }, function(response) {

    });
  });

});

getUserInfo(true);

function getUserInfo (interactive) {
  const xmlhttp = new XMLHttpRequest();
  let retry = true;
  let accessToken;

  getToken();

  /**
   * Request the Auth Token
   */
  function getToken() {
    chrome.identity.getAuthToken( { 'interactive': interactive }, function (token) {
      if (chrome.runtime.lastError) {
        console.log( "ERROR! " + chrome.runtime.lastError.message );
        return;
      }
      if (typeof token != 'undefined') {
        accessToken = token;
        sendRequest();
      }

    });
  }

  function sendRequest() {
    xmlhttp.open('GET', 'https://www.googleapis.com/userinfo/v2/me' );
    xmlhttp.setRequestHeader('Authorization','Bearer ' + accessToken );
    xmlhttp.onload = requestComplete;
    xmlhttp.send();
  }

  function requestComplete() {
    if (this.status == 401 && retry) {
      retry = false; // only retry once
      console.log( "Request failed, retrying... " + this.response );
    } else {
      console.log( "Request completed. User Info: " + this.response );
      const userInfo = JSON.parse( this.response );

      chrome.storage.local.set({"access_token": accessToken, "userId": userInfo.id.toString()}, () => {});
    }
  }
}
