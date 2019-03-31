
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

const mostRecent = document.getElementById('most-recent');
mostRecent.hidden = true;

const mainForm = document.getElementById('main-form');

const listGroup = document.getElementById('visited-links');

const navLinks = document.getElementsByClassName('nav-link');
console.log(navLinks);

let url;

chrome.tabs.query({
  active: true,
  currentWindow: true
}, tabs => {
  inputValue.value = tabs[0].title;
  url = tabs[0].url;
});

db.collection('notes').get()
  .then(notes => {

    for (let i = 0; i < notes.docs.length; i++) {
      db.collection('notes')
        .doc(notes.docs[i].id)
        .get()
        .then(result => {
          const noteData = result.data();
          const newListItem = `
            <a class="list-group-item list-group-item-action flex-column align-items-start" href="${noteData.url}">
              <div class="d-flex justify-content-between">
                <h6>${noteData.title}</h6>
                <small>${daysBetweenNowAndThen(noteData.date)}</small>
              </div>
              <p class="mb-1">${noteData.userComments || 'No comments.'}</p>
            </a>
          `;
          listGroup.innerHTML += newListItem;
      })
      .catch(error => {
        console.log(error);
      });
    }
  })
  .catch(error => {
    console.error(error);
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


for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener('click', () => {
    // active = i;
    if (i === 0) {
      navLinks[0].className = "nav-link active";
      navLinks[1].className = "nav-link";

      mostRecent.hidden = true;
      mainForm.hidden = false;
    } else {
      navLinks[1].className = "nav-link active";
      navLinks[0].className = "nav-link";

      mostRecent.hidden = false;
      mainForm.hidden = true;
    }
  });
}

const daysBetweenNowAndThen = unixTimestamp => {
  const javascriptDate = new Date(unixTimestamp.seconds * 1000);

  const dayOfEntry = javascriptDate.getDate();
  
  const now = new Date();
  const today = now.getDate();
  console.log(javascriptDate, now);

  const daysBetween = today - dayOfEntry;
  if (daysBetween === 0) {
    return `Today`;
  } else if (daysBetween === 1) {
    return `Yesterday`;
  } else {
    return `${daysBetween} ago`;
  }
}