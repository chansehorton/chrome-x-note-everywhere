'use strict'

addNoteToPage();

function addNoteToPage() {
  let timeoutId;

//create and add the note div
  let newDiv = $('<div>', {id: 'ne_note_container'});
  let topNav = $('<div>', {id: 'ne_note_topnav'});
  let note = $('<textarea>', {id: 'ne_note_textarea'});
  let ltRtToggle = $('<a>', {id: 'ne_note_ltrt_toggle'});
  let hideLink = $('<a>', {id: 'ne_note_hide'});
  let copyLink = $('<a>', {id: 'ne_note_copy'});
  let speechLink = $('<a>', {id: 'ne_note_speech'});

  // green - #1ed760
  // blue - #42d7f4
  // svg draw paths for icons
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
  newDiv.append(note);

  topNav.children().each( (index, element) => {
    $(element).attr('href', '#');
  });

  newDiv.addClass('ne_note_container ne_note_left');
  topNav.addClass('ne_note_topnav');
  note.addClass('ne_note_textarea').attr('placeholder', 'Type your notes...');

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
  retrieveNote();

// autosave note whenever user takes a break from typing
  $("#ne_note_textarea").on('input propertychange change', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout( () => {
      saveNote();
    }, 1000);
  });

// delete saved note id, unecessary after note is saved to db
  window.onbeforeunload = function() {
    localStorage.removeItem('neSavedNoteId');
    return '';
  };
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

//saves note to localStorage
function saveNote() {
  console.log('attempting to save note');
  let noteToSave = $("#ne_note_textarea").val();
  let noteUrl = `${window.location.hostname}${window.location.pathname}`;
  let position;

  if ($('ne_note_container').hasClass('ne_note_left')) {
    position = 'left';
  } else {
    position= 'right';
  }

  //TODO: if user logged in
  if (true) {
    if (localStorage.getItem('neSavedNoteId')) {
      //TODO: change to heroku db
      const patchData = {
        note: noteToSave,
        note_position: position
      };

      console.log('patch data pre-send: ', patchData);

      $.ajax({
        type: 'PATCH',
        url: `https://notes-everywhere-db.herokuapp.com/notes/${localStorage.getItem('neSavedNoteId')}`,
        processData: false,
        data: JSON.stringify({
          "note": noteToSave,
          "note_position": position,
        }),
        contentType: 'application/json',
        dataType: 'json',
      })
      .done((data) => {
        console.log('patch completed successfully ', data);
        return;
      })
    } else {
      const thisData = {
        user_id: 3,
        url: noteUrl,
        note: noteToSave,
        note_position: position
      };
      console.log('data to send');
      console.log(thisData);

      $.ajax({
        type: 'POST',
        url: 'https://notes-everywhere-db.herokuapp.com/notes',
        processData: false,
        data: JSON.stringify(thisData),
        dataType: 'json',
        contentType: 'application/json'
      }).done((data) => {
        console.log('posted successfully ', data);
        return;
      });
    }
  } else {
    localStorage.setItem(`neSavedNote_${noteUrl}`, JSON.stringify(noteToSave));
  }
}

//retrieves previously saved note from localStorage or db
function retrieveNote() {
  console.log('attempting to retrieve note');
  // TODO: if user logged in
  if (true) {
    // TODO: get user id

    // change dbUrl to use heroku db
    const dbUrl = 'https://notes-everywhere-db.herokuapp.com/notes';
    // TODO: make userId a variable in queryStr
    const queryStr = `?userId=3&url=${window.location.hostname}${window.location.pathname}`;

    $.get(`${dbUrl}${queryStr}`, function(data) {
      if (!data) {
        console.log('no notes found')
        return;
      } else {
        console.log('found a note!');
        localStorage.setItem('neSavedNoteId', data.id);
        $("#ne_note_textarea").val(data.note);

        if (data.note_position === 'right') {
          const leftToggleIcon = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>';

          toggleRight(leftToggleIcon);
        }

        return;
      }
    });
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
