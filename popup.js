
let inputValue = document.getElementById('page-title-input');
let addDetails = document.getElementById('add-details');
let notesBox = document.getElementById('notes-box');
let takeNote = document.getElementById('take-note');

let url;

chrome.tabs.query({
  active: true,
  currentWindow: true
}, tabs => {
  inputValue.value = tabs[0].title;
  url = tabs[0].url;
});

addDetails.addEventListener('click', () => {
  let textArea = `
    <textarea class="form-control" id="userNotes" style="margin-bottom: 1rem;"></textarea>
  `;
  notesBox.innerHTML = textArea;
});

takeNote.addEventListener('click', () => {
  let savePackage = {
    textAreaValue: document.getElementById('userNotes').value,
    url: url,
    title: inputValue.value,
    date: new Date,
  }

  console.log(savePackage);
});
