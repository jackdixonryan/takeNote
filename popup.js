
var config = {
  apiKey: "AIzaSyCw_DDfKRwiS7QTqOdvTaHx_zILpDFpLuw",
  authDomain: "takenote-b375b.firebaseapp.com",
  databaseURL: "https://takenote-b375b.firebaseio.com",
  projectId: "takenote-b375b",
  storageBucket: "",
  messagingSenderId: "978893534539"
};

firebase.initializeApp(config);

const db = firebase.firestore();
const notesRef = db.collection('notes');

const inputValue = document.getElementById('page-title-input');
const addDetails = document.getElementById('add-details');
const notesBox = document.getElementById('notes-box');
const takeNote = document.getElementById('take-note');
const throwError = document.getElementById('error');

let url;

chrome.tabs.query({
  active: true,
  currentWindow: true
}, tabs => {
  inputValue.value = tabs[0].title;
  url = tabs[0].url;
});

addDetails.addEventListener('click', () => {
  const textArea = `
    <textarea class="form-control" id="userNotes" style="margin-bottom: 1rem;"></textarea>
  `;
  notesBox.innerHTML = textArea;
});

takeNote.addEventListener('click', () => {
  const userCommentArea = document.getElementById('userNotes');
  console.log(userCommentArea);
  const userAddedComments = userCommentArea ? userCommentArea.value : null;

  notesRef.add({
    url: url,
    title: inputValue.value,
    date: new Date,
    userComments: userAddedComments,
  })
});
