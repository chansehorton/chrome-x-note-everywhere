'use strict'

function toggleVis() {
  let note = $('#ne_note_container');

  if(note.css('display') === 'block') {
    note.hide();
  }
  else {
    note.show();
  }
};

toggleVis();
