'use strict'

function addNote() {
  let newDiv = $('<div>', {id: 'ch_note_container'});
  let topNav = $('<div>', {id: 'ch_note_topnav'});
  let note = $('<textarea>', {id: 'ch_note_textarea'});
  let ltRtToggle = $('<a>', {id: 'ch_note_ltrt_toggle'});
  let hideLink = $('<a>', {id: 'ch_note_hide'});
  let copyLink = $('<a>', {id: 'ch_note_copy'});
  let speechLink = $('<a>', {id: 'ch_note_speech'});

  topNav.append(ltRtToggle);
  topNav.append(copyLink);
  topNav.append(speechLink);
  topNav.append(hideLink);

  newDiv.append(topNav);
  newDiv.append(note);

  topNav.children().each( (index, element) => {
    $(this).attr('href', '#');
  });

  newDiv.addClass('ch_note_container ch_note_left');
  topNav.addClass('ch_note_topnav');
  note.addClass('ch_note_textarea').attr('placeholder', 'Type your notes...');

  //configure hideLink, add tooltip, add svg icon
  hideLink.prop('title', 'Hide Note').css('order', '1').append('<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" /></svg>');

  //hideLink functionality
  hideLink.click( () => {
    $('#ch_note_container').hide();
  });

  copyLink.prop('title', 'Copy to Clipboard').css('order', '2').append('<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M7,8V6H5V19H19V6H17V8H7M9,4A3,3 0 0,1 12,1A3,3 0 0,1 15,4H19A2,2 0 0,1 21,6V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6A2,2 0 0,1 5,4H9M12,3A1,1 0 0,0 11,4A1,1 0 0,0 12,5A1,1 0 0,0 13,4A1,1 0 0,0 12,3Z" /></svg>');

  speechLink.prop('title', 'Speak Your Note').css('order', '3').append('<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" /></svg>');

  //configure position toggle link, add tooltip, add svg icon
  ltRtToggle.prop('title', 'Toggle Position').css('order', '4').append('<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" /></svg>');

  //left/right toggle position functionality, and reorder icons
  ltRtToggle.click( () => {
    let container = $('#ch_note_container');
    let togLink = $('#ch_note_ltrt_toggle');
    let hideLink = $('#ch_note_hide');

    if (container.hasClass('ch_note_left')) {
      container.removeClass('ch_note_left').addClass('ch_note_right');
      togLink.children().remove();
      togLink.append('<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>').css('order', '1');
      hideLink.css('order', '4');
    } else {
      container.removeClass('ch_note_right').addClass('ch_note_left');
      togLink.children().remove();
      togLink.append('<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#42d7f4" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" /></svg>').css('order', '4');
      hideLink.css('order', '1');
    }
  });

  $('body').append(newDiv);
}

addNote();
