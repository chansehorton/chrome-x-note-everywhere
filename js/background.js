'use strict'

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, { toggle: true }, function(response) {
      console.log(response);
    });
  });

});

getUserInfo(true);

function getUserInfo (interactive) {
  const xmlhttp = new XMLHttpRequest();
  let retry = true;
  let access_token;

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
        access_token = token;
        sendRequest();
      }

    });
  }

  function sendRequest() {
    xmlhttp.open('GET', 'https://www.googleapis.com/userinfo/v2/me' );
    xmlhttp.setRequestHeader('Authorization','Bearer ' + access_token );
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

      chrome.storage.local.set({"userId": userInfo.id.toString()}, () => {
        
      });
    }
  }
}
