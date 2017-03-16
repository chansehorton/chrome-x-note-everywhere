'use strict'

chrome.runtime.onMessage.addListener(request => {
  if (request.toggle && $('#ne_note_container').length) {
    toggleVis();
    return Promise.resolve({response: "Message received!: note toggled"});
  } else {
    addNoteToPage();
    return Promise.resolve({response: "Message received!: note created"});
  }
});

function toggleVis() {
  let note = $('#ne_note_container');

  if (note.css('display') === 'flex') {
    note.hide();
  }
  else {
    note.show();
  }
};

function addNoteToPage() {
  let timeoutId;
  let userId;

//create and add the note div
  let newDiv = $('<div>', {id: 'ne_note_container'});
  let topNav = $('<div>', {id: 'ne_note_topnav'});
  let note = $('<textarea>', {id: 'ne_note_textarea'});
  let noteAppearDiv = $('<div class="ne_appearance"></div>');
  let noteOpacityLink = $('<a>', {id: 'ne_note_opacity_toggle'});
  let ltRtToggle = $('<a>', {id: 'ne_note_ltrt_toggle'});
  let hideLink = $('<a>', {id: 'ne_note_hide'});
  let copyLink = $('<a>', {id: 'ne_note_copy'});
  let speechLink = $('<a>', {id: 'ne_note_speech'});

  // green - #1ed760
  // blue - #42d7f4
  // svg draw paths for icons
  const opacityOnIcon = '<svg id="ne_opac_on" style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M14,8.5A1.5,1.5 0 0,0 12.5,10A1.5,1.5 0 0,0 14,11.5A1.5,1.5 0 0,0 15.5,10A1.5,1.5 0 0,0 14,8.5M14,12.5A1.5,1.5 0 0,0 12.5,14A1.5,1.5 0 0,0 14,15.5A1.5,1.5 0 0,0 15.5,14A1.5,1.5 0 0,0 14,12.5M10,17A1,1 0 0,0 9,18A1,1 0 0,0 10,19A1,1 0 0,0 11,18A1,1 0 0,0 10,17M10,8.5A1.5,1.5 0 0,0 8.5,10A1.5,1.5 0 0,0 10,11.5A1.5,1.5 0 0,0 11.5,10A1.5,1.5 0 0,0 10,8.5M14,20.5A0.5,0.5 0 0,0 13.5,21A0.5,0.5 0 0,0 14,21.5A0.5,0.5 0 0,0 14.5,21A0.5,0.5 0 0,0 14,20.5M14,17A1,1 0 0,0 13,18A1,1 0 0,0 14,19A1,1 0 0,0 15,18A1,1 0 0,0 14,17M21,13.5A0.5,0.5 0 0,0 20.5,14A0.5,0.5 0 0,0 21,14.5A0.5,0.5 0 0,0 21.5,14A0.5,0.5 0 0,0 21,13.5M18,5A1,1 0 0,0 17,6A1,1 0 0,0 18,7A1,1 0 0,0 19,6A1,1 0 0,0 18,5M18,9A1,1 0 0,0 17,10A1,1 0 0,0 18,11A1,1 0 0,0 19,10A1,1 0 0,0 18,9M18,17A1,1 0 0,0 17,18A1,1 0 0,0 18,19A1,1 0 0,0 19,18A1,1 0 0,0 18,17M18,13A1,1 0 0,0 17,14A1,1 0 0,0 18,15A1,1 0 0,0 19,14A1,1 0 0,0 18,13M10,12.5A1.5,1.5 0 0,0 8.5,14A1.5,1.5 0 0,0 10,15.5A1.5,1.5 0 0,0 11.5,14A1.5,1.5 0 0,0 10,12.5M10,7A1,1 0 0,0 11,6A1,1 0 0,0 10,5A1,1 0 0,0 9,6A1,1 0 0,0 10,7M10,3.5A0.5,0.5 0 0,0 10.5,3A0.5,0.5 0 0,0 10,2.5A0.5,0.5 0 0,0 9.5,3A0.5,0.5 0 0,0 10,3.5M10,20.5A0.5,0.5 0 0,0 9.5,21A0.5,0.5 0 0,0 10,21.5A0.5,0.5 0 0,0 10.5,21A0.5,0.5 0 0,0 10,20.5M3,13.5A0.5,0.5 0 0,0 2.5,14A0.5,0.5 0 0,0 3,14.5A0.5,0.5 0 0,0 3.5,14A0.5,0.5 0 0,0 3,13.5M14,3.5A0.5,0.5 0 0,0 14.5,3A0.5,0.5 0 0,0 14,2.5A0.5,0.5 0 0,0 13.5,3A0.5,0.5 0 0,0 14,3.5M14,7A1,1 0 0,0 15,6A1,1 0 0,0 14,5A1,1 0 0,0 13,6A1,1 0 0,0 14,7M21,10.5A0.5,0.5 0 0,0 21.5,10A0.5,0.5 0 0,0 21,9.5A0.5,0.5 0 0,0 20.5,10A0.5,0.5 0 0,0 21,10.5M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5M3,9.5A0.5,0.5 0 0,0 2.5,10A0.5,0.5 0 0,0 3,10.5A0.5,0.5 0 0,0 3.5,10A0.5,0.5 0 0,0 3,9.5M6,9A1,1 0 0,0 5,10A1,1 0 0,0 6,11A1,1 0 0,0 7,10A1,1 0 0,0 6,9M6,17A1,1 0 0,0 5,18A1,1 0 0,0 6,19A1,1 0 0,0 7,18A1,1 0 0,0 6,17M6,13A1,1 0 0,0 5,14A1,1 0 0,0 6,15A1,1 0 0,0 7,14A1,1 0 0,0 6,13Z" /></svg>';
  const opacityOffIcon = '<svg id="ne_opac_off" style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M3,13.5A0.5,0.5 0 0,0 2.5,14A0.5,0.5 0 0,0 3,14.5A0.5,0.5 0 0,0 3.5,14A0.5,0.5 0 0,0 3,13.5M6,17A1,1 0 0,0 5,18A1,1 0 0,0 6,19A1,1 0 0,0 7,18A1,1 0 0,0 6,17M10,20.5A0.5,0.5 0 0,0 9.5,21A0.5,0.5 0 0,0 10,21.5A0.5,0.5 0 0,0 10.5,21A0.5,0.5 0 0,0 10,20.5M3,9.5A0.5,0.5 0 0,0 2.5,10A0.5,0.5 0 0,0 3,10.5A0.5,0.5 0 0,0 3.5,10A0.5,0.5 0 0,0 3,9.5M6,13A1,1 0 0,0 5,14A1,1 0 0,0 6,15A1,1 0 0,0 7,14A1,1 0 0,0 6,13M21,13.5A0.5,0.5 0 0,0 20.5,14A0.5,0.5 0 0,0 21,14.5A0.5,0.5 0 0,0 21.5,14A0.5,0.5 0 0,0 21,13.5M10,17A1,1 0 0,0 9,18A1,1 0 0,0 10,19A1,1 0 0,0 11,18A1,1 0 0,0 10,17M2.5,5.27L6.28,9.05L6,9A1,1 0 0,0 5,10A1,1 0 0,0 6,11A1,1 0 0,0 7,10C7,9.9 6.97,9.81 6.94,9.72L9.75,12.53C9.04,12.64 8.5,13.26 8.5,14A1.5,1.5 0 0,0 10,15.5C10.74,15.5 11.36,14.96 11.47,14.25L14.28,17.06C14.19,17.03 14.1,17 14,17A1,1 0 0,0 13,18A1,1 0 0,0 14,19A1,1 0 0,0 15,18C15,17.9 14.97,17.81 14.94,17.72L18.72,21.5L20,20.23L3.77,4L2.5,5.27M14,20.5A0.5,0.5 0 0,0 13.5,21A0.5,0.5 0 0,0 14,21.5A0.5,0.5 0 0,0 14.5,21A0.5,0.5 0 0,0 14,20.5M18,7A1,1 0 0,0 19,6A1,1 0 0,0 18,5A1,1 0 0,0 17,6A1,1 0 0,0 18,7M18,11A1,1 0 0,0 19,10A1,1 0 0,0 18,9A1,1 0 0,0 17,10A1,1 0 0,0 18,11M18,15A1,1 0 0,0 19,14A1,1 0 0,0 18,13A1,1 0 0,0 17,14A1,1 0 0,0 18,15M10,7A1,1 0 0,0 11,6A1,1 0 0,0 10,5A1,1 0 0,0 9,6A1,1 0 0,0 10,7M21,10.5A0.5,0.5 0 0,0 21.5,10A0.5,0.5 0 0,0 21,9.5A0.5,0.5 0 0,0 20.5,10A0.5,0.5 0 0,0 21,10.5M10,3.5A0.5,0.5 0 0,0 10.5,3A0.5,0.5 0 0,0 10,2.5A0.5,0.5 0 0,0 9.5,3A0.5,0.5 0 0,0 10,3.5M14,3.5A0.5,0.5 0 0,0 14.5,3A0.5,0.5 0 0,0 14,2.5A0.5,0.5 0 0,0 13.5,3A0.5,0.5 0 0,0 14,3.5M13.8,11.5H14A1.5,1.5 0 0,0 15.5,10A1.5,1.5 0 0,0 14,8.5A1.5,1.5 0 0,0 12.5,10V10.2C12.61,10.87 13.13,11.39 13.8,11.5M14,7A1,1 0 0,0 15,6A1,1 0 0,0 14,5A1,1 0 0,0 13,6A1,1 0 0,0 14,7Z" /></svg>'
  const hideIcon = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" /></svg>';
  const copyIcon = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M7,8V6H5V19H19V6H17V8H7M9,4A3,3 0 0,1 12,1A3,3 0 0,1 15,4H19A2,2 0 0,1 21,6V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6A2,2 0 0,1 5,4H9M12,3A1,1 0 0,0 11,4A1,1 0 0,0 12,5A1,1 0 0,0 13,4A1,1 0 0,0 12,3Z" /></svg>';
  const speakIcon = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" /></svg>';
  const rightToggleIcon = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" /></svg>';
  const leftToggleIcon = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>';

  topNav.append(ltRtToggle);
  topNav.append(copyLink);
  topNav.append(speechLink);
  topNav.append(hideLink);

  newDiv.append(topNav);
  noteAppearDiv.append(noteOpacityLink);
  newDiv.append(note);
  newDiv.append(noteAppearDiv);

  topNav.children().each( (index, element) => {
    $(element).attr('href', '#');
  });

  newDiv.addClass('ne_note_container ne_note_left');
  topNav.addClass('ne_note_topnav');
  note.addClass('ne_note_textarea').attr('placeholder', 'Type your notes...');
  noteOpacityLink.addClass('ne_note_opacity_toggle');

  noteOpacityLink.prop('title', 'Toggle Opacity').append(opacityOffIcon);

  noteOpacityLink.click( (e) => {
    e.preventDefault();
    if ($('#ne_opac_on').length) {
      $('#ne_note_textarea').css('background-color', 'rgba(244,242,97,1)');
      $('#ne_note_opacity_toggle').children().remove();
      $('#ne_note_opacity_toggle').append(opacityOffIcon);
    } else if ($('#ne_opac_off').length) {
      $('#ne_note_textarea').css('background-color', 'rgba(244,242,97,0.5)');
      $('#ne_note_opacity_toggle').children().remove();
      $('#ne_note_opacity_toggle').append(opacityOnIcon);
    }
  });

  //configure hideLink, add tooltip, add svg icon
  hideLink.prop('title', 'Hide Note').css('order', '1').append(hideIcon);

  //hideLink functionality
  hideLink.click( (e) => {
    e.preventDefault();
    $('#ne_note_container').hide();
  });

  copyLink.prop('title', 'Copy to Clipboard').css('order', '2').append(copyIcon);

  copyLink.click( (e) => {
    e.preventDefault();

    $('#ne_note_textarea').select();
    document.execCommand('copy');
  })

  speechLink.prop('title', 'Speak Your Note').css('order', '3').append(speakIcon);

  speechLink.click( (e) => {
    e.preventDefault();

    startDictation();
  });



  //configure position toggle link, add tooltip, add svg icon
  ltRtToggle.prop('title', 'Toggle Position').css('order', '4').append(rightToggleIcon);

  //left/right toggle position functionality, and reorder icons
  ltRtToggle.click( (e) => {
    e.preventDefault();

    const container = $('#ne_note_container');

    if (container.hasClass('ne_note_left')) {
      toggleRight(leftToggleIcon);
    } else {
      toggleLeft(rightToggleIcon);
    }
  });

// append note to page, then retrieve any stored note from localStorage
  $('body').append(newDiv);

  chrome.storage.local.get(['userId', 'access_token'], function(values) {
    let userId = values.userId;
    let token = values.access_token;

    if (userId) {
      retrieveNote(userId, token);
    } else {
      retrieveNote();
    }
  });

// autosave note whenever user takes a break from typing
  $("#ne_note_textarea").on('input propertychange change', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout( () => {
      chrome.storage.local.get(['userId', 'access_token'], function(values) {
        let userId = values.userId;
        let token = values.access_token;

        if (userId) {
          saveNote(userId, token);
        } else {
          saveNote();
        }
      });
    }, 1000);
  });

}

//toggle note to right
function toggleRight(leftIcon) {
  const container = $('#ne_note_container');
  const togLink = $('#ne_note_ltrt_toggle');
  const hideLink = $('#ne_note_hide');

  container.removeClass('ne_note_left').addClass('ne_note_right');
  togLink.children().remove();
  togLink.append(leftIcon).css('order', '1');
  hideLink.css('order', '4');
}

//toggle note to left
function toggleLeft(rightToggle) {
  const container = $('#ne_note_container');
  const togLink = $('#ne_note_ltrt_toggle');
  const hideLink = $('#ne_note_hide');

  container.removeClass('ne_note_right').addClass('ne_note_left');
  togLink.children().remove();
  togLink.append(rightToggle).css('order', '4');
  hideLink.css('order', '1');
}

//saves note to db or localStorage
function saveNote(user, token) {
  let noteToSave = $("#ne_note_textarea").val();
  let noteUrl = `${window.location.hostname}${window.location.pathname}`;
  let position;

  if ($('#ne_note_container').hasClass('ne_note_left')) {
    position = 'left';
  } else {
    position= 'right';
  }

  if (user) {
    //if user logged in, then attempt POST or PATCH
    if (localStorage.getItem('neSavedNoteId')) {
      //if a note was retrieved on retrieve note call at page load, then PATCH
      const patchData = {
        user_id: user,
        url: noteUrl,
        note: noteToSave,
        note_position: position
      };

      let dbUrl = 'https://notes-everywhere-db.herokuapp.com/notes';
      let queryStr = `?userId=${user}&url=${window.location.hostname}${window.location.pathname}`;

      $.ajax({
        type: 'PATCH',
        url: `${dbUrl}`,
        processData: false,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(patchData),
        contentType: 'application/json',
        dataType: 'json',
      })
      .done((data) => {
        console.log('note patched');
        return;
      })
      .fail((err) => {
        //if patch fails, save to localStorage and set save failed flag
        console.log('error saving to db, saved to localStorage');
        localStorage.setItem(`neSavedNote_${noteUrl}`, JSON.stringify(noteToSave));
        localStorage.setItem(`ne_save_failed_${noteUrl}`, JSON.stringify(1));
        return err;
      })
    } else {
      //if no note was retrieved on the retrieve note call at page load, then POST
      const thisData = {
        user_id: user,
        url: noteUrl,
        note: noteToSave,
        note_position: position
      };

      $.ajax({
        type: 'POST',
        url: 'https://notes-everywhere-db.herokuapp.com/notes',
        processData: false,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(thisData),
        dataType: 'json',
        contentType: 'application/json'
      }).done((data) => {
        console.log('note posted')
        // localStorage.setItem('neSavedNoteId', data.id);
        return;
      }).fail((err) => {
        //if post fails, save to localStorage, and set save failed flag
        console.log('error saving to db, saved to localStorage');
        localStorage.setItem(`neSavedNote_${noteUrl}`, JSON.stringify(noteToSave));
        localStorage.setItem(`ne_save_failed_${noteUrl}`, JSON.stringify(1));
        return err;
      });
    }
  } else {
    //if no user logged in, save note to localStorage
    console.log('note saved to localStorage');
    localStorage.setItem(`neSavedNote_${noteUrl}`, JSON.stringify(noteToSave));
  }
}

//retrieves previously saved note from localStorage or db
function retrieveNote(user, token) {
  // if user is logged in
  if (user) {
    let dbUrl = 'https://notes-everywhere-db.herokuapp.com/notes';
    let noteUrl = `${window.location.hostname}${window.location.pathname}`;
    let queryStr = `?userId=${user}&url=${noteUrl}`;
    // if last save failed, there will be a flag and the note in localStorage
    if (localStorage.getItem(`ne_save_failed_${noteUrl}`)) {
      let neSavedNote = localStorage.getItem(`neSavedNote_${window.location.hostname}${window.location.pathname}`);

      $("#ne_note_textarea").val(JSON.parse(neSavedNote));
      localStorage.removeItem(`ne_save_failed_${noteUrl}`);

    } else {
      // if no save failed flag, get note from db
      $.ajax({
        type: 'GET',
        url: `${dbUrl}${queryStr}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        contentType: 'application/json'
      }).done((data) => {
        if (!data) {
          console.log('no notes found');
          return;
        } else {
          console.log('note found');
          localStorage.setItem('neSavedNoteId', data.id);
          $("#ne_note_textarea").val(data.note);

          if (data.note_position === 'right') {
            const leftToggleIcon = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>';

            toggleRight(leftToggleIcon);
          }
          return;
        }
      });
    }

  } else {
    let neSavedNote = localStorage.getItem(`neSavedNote_${window.location.hostname}${window.location.pathname}`);

    $("#ne_note_textarea").val(JSON.parse(neSavedNote));
  }
}

function startDictation() {
  if (window.hasOwnProperty('webkitSpeechRecognition')) {
    let recognition = new webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (e) => {
      let note = $('#ne_note_textarea');

      if (note.val() === '') {
        note.val(e.results[0][0].transcript);
      } else {
        note.val(note.val() + ' ' + e.results[0][0].transcript);
      }

      recognition.stop();
      $('#ne_note_textarea').trigger('change');
    };

    recognition.onerror = (e) => {
      recognition.stop();
    }
  }
}
