'use strict'

console.log('toggle script called');

function toggleVis() {
  let note = $('#ch_note_container');

  if(note.css('display') === 'block') {
    note.hide();
  }
  else {
    note.show();
  }
};

toggleVis();
