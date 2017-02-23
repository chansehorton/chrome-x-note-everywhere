'use strict'

function addNote() {
  let newDiv = $('<div>', {id: 'ch_note_container'});
  let topNav = $('<div>', {id: 'ch_note_topnav'});
  let note = $('<textarea>', {id: 'ch_note_textarea'});
  let ltRtToggle = $('<a>', {id: 'ch_note_ltrt_toggle'});
  let hideLink = $('<a>', {id: 'ch_note_hide'});

  newDiv.addClass('ch_note_container ch_note_left');
  topNav.addClass('ch_note_topnav');
  note.addClass('ch_note_textarea');

  note.attr('placeholder', 'Type your notes...');

  hideLink.attr('href', '#').css('float', 'left').text('HIDE');
  hideLink.on('click', function() {
    $('#ch_note_container').hide();
  });

  ltRtToggle.attr('href', '#').css('float', 'right').text('MOVE TO RIGHT');
  ltRtToggle.on('click', function() {
    let container = $('#ch_note_container');
    let togLink = $('#ch_note_ltrt_toggle');
    let hideLink = $('#ch_note_hide');

    if (container.hasClass('ch_note_left')) {
      container.removeClass('ch_note_left').addClass('ch_note_right');
      togLink.text('MOVE TO LEFT').css('float', 'left');
      hideLink.css('float', 'right');
    } else {
      container.removeClass('ch_note_right').addClass('ch_note_left');
      togLink.text('MOVE TO RIGHT').css('float', 'right');
      hideLink.css('float', 'left');
    }
  });

  topNav.append(ltRtToggle);
  topNav.append(hideLink);
  newDiv.append(topNav);
  newDiv.append(note);
  $('body').append(newDiv);
}

addNote();
