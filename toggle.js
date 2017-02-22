'use strict'

console.log('toggle script called');

function toggleVis() {
  let note = document.getElementById('ch_note_container');

  if(note.style.display === 'block') {
    note.style.display = 'none';
  }
  else {
    note.style.display = 'block';
  }
  console.log(note.style.display);
};

module.exports = toggleVis();

// toggleVis();
