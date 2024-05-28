'use strict';

import { onEvent, select, selectAll, create, print } from "./utils.js";

const addNoteButton = select('.btn-add-note');
const noteListContainer = select('.note-list-container');
const noteDisplay = select('.note-display');
const noteDateInfo = select('.note-date-info');
const noteTitleInfo = select('.note-title-info');
const noteContentInfo = select('.note-content-info');
const inputNoteContainer = select('.input-note-container');
const inputNoteTitle = select('.input-note-title');
const inputNoteContent = select('.input-note-content');
const cancelNoteButton = select('.btn-cancel-note');
const saveNoteButton = select('.btn-save-note');
const deleteNoteButton = select('.btn-delete-note');

onEvent('load', window, () => {
  inputNoteContainer.style.display = 'none';
  noteDisplay.style.display = 'none';
  updateNoteList();
  // updateCategories();
});

// onEvent('click', createNote, () => {
//   inputNoteContent.style.display = 'none';
//   inputNoteContainer.style.display = 'block';
// });

let notes = getNotesFromStorage();
let currentNoteId = null; // Initialize currentNoteId here

function getNotesFromStorage() {
  let storedNotes = localStorage.getItem('notes');
  return storedNotes ? JSON.parse(storedNotes) : [];
}

function saveNote() {
  let noteTitle = inputNoteTitle.value;
  let noteContent = inputNoteContent.value;

  notes.push({
    "id": Date.now(),
    "title": noteTitle,
    "content": noteContent
  });

  localStorage.setItem('notes', JSON.stringify(notes));
}

function deleteNote() {
  if (currentNoteId !== null) {
    notes = notes.filter(note => note.id !== currentNoteId);
    localStorage.setItem('notes', JSON.stringify(notes));
    updateNoteList();
    noteDisplay.style.display = 'none';
  }
}

function updateNoteList() {
  noteListContainer.innerHTML = '';
  notes.forEach(note => {
    let container = create('div');
    let title = create('p');
    let date = create('p');
    let id = create('span');

    title.innerText = truncateTitle(note.title, 25);
    title.classList.add('note-title');
    date.innerText = new Date(note.id).toLocaleDateString();
    date.classList.add('note-date');

    id.innerText = note.id;
    id.style.display = 'none';

    container.appendChild(title);
    container.appendChild(date);
    container.appendChild(id);

    noteListContainer.appendChild(container);

    onEvent('click', container, () => {
      showNoteContent(note);
    });
  });
}

function showNoteContent(note) {
  currentNoteId = note.id;
  noteDateInfo.innerText = new Date(note.id).toLocaleString();
  noteTitleInfo.innerText = note.title;
  noteContentInfo.innerText = note.content;
  noteDisplay.style.display = 'block';
  inputNoteContainer.style.display = 'none';
}

function truncateTitle(title, maxLength) {
  if (title.length <= maxLength) {
    return title;
  }

  let truncatedTitle = title.substring(0, maxLength + 1);
  let lastSpaceIndex = truncatedTitle.lastIndexOf(' ');

  if (lastSpaceIndex > -1) {
    truncatedTitle = truncatedTitle.substring(0, lastSpaceIndex);
  } else {
    truncatedTitle = title.substring(0, maxLength);
  }

  return truncatedTitle + '...';
}

onEvent('click', addNoteButton, () => {
  noteDisplay.style.display = 'none';
  inputNoteContainer.style.display = 'block';
  inputNoteContent.style.display = 'block';
  inputNoteTitle.focus();
});

onEvent('click', saveNoteButton, () => {
  console.log("clicked");
  if (inputNoteTitle.value.trim() != "" && inputNoteContent.value.trim() != "") {
    saveNote();
    inputNoteTitle.value = '';
    inputNoteContent.value = '';
    updateNoteList();
    inputNoteContainer.style.display = 'none';
  } else {
    inputNoteTitle.focus();
  }
});

onEvent('click', cancelNoteButton, () => {
  inputNoteTitle.value = '';
  inputNoteContent.value = '';
  inputNoteContainer.style.display = 'none';
});

onEvent('click', deleteNoteButton, () => {
  deleteNote();
});


updateNoteList();
