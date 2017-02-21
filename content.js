'use strict'

function addNote() {
  let newDiv = document.createElement('div');
  let topNav = document.createElement('div');
  let note = document.createElement('textarea');

  newDiv.id = "ch_note_container";
  newDiv.setAttribute("class", "ch_note_container ch_note_left");
  topNav.setAttribute("class", "ch_note_topnav");
  note.setAttribute("class", "ch_note_textarea");
  note.setAttribute("placeholder", "Type your note...");
  newDiv.appendChild(topNav);
  newDiv.appendChild(note);
  document.body.appendChild(newDiv);
}

addNote();
