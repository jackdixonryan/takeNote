
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

let activeUser;

// checking on bootup if we're logged in.
firebase.auth().onAuthStateChanged(user => {
  // if we have a user we're good to go. 
  if (user) {
    
    activeUser = user;

    // here we add our most recent view. This returns the five most recently created entries because Firestore is a great tool with no real rivals. 
    db.collection('notes')
    .orderBy("date", "desc")
    .where("madeBy", "==", activeUser.uid)
    .limit(5)
    .get()
    .then(result => {
      for (let i = 0; i < result.docs.length; i++) {
        const noteData = result.docs[i].data();
        const newListItem = `
          <a class="list-group-item list-group-item-action flex-column align-items-start" href="${noteData.url}" target="_blank">
            <div class="d-flex justify-content-between">
              <h6>${noteData.title}</h6>
              <small>${daysBetweenNowAndThen(noteData.date)}</small>
            </div>
            <p class="mb-1">${noteData.userComments || 'No comments.'}</p>
          </a>
        `;
        listGroup.innerHTML += newListItem;
      }
      })
      .catch(error => {
        console.log(error);
      });

  // otherwise we've got to sign in or sign up. Here's where that will be hidden. The HTML for this is actually within the template because when I was trying to put it directly in here it was causing all kinds of wonky issues. 
  } else {
    const submitLogin = document.getElementById('submit-login');
    const loginBanner = document.getElementById("login-banner");
    loginBanner.hidden = false;
    
    submitLogin.addEventListener('click', () => {
      const email = document.getElementById('user-email').value;
      const password = document.getElementById('user-password').value;

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(successfulSignIn => {
          loginBanner.hidden = true;
          activeUser = successfulSignIn.user;
        })
        .catch(error => {
          // two kinds of errors so far: user not found, bad email address formatting.
          console.log(error);
        });
    });
  }
})

// Selectors out the YANG!

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

let url;
console.log("I read the console, Dan.");


// The actual thing the extension does.
chrome.tabs.query({
  active: true,
  currentWindow: true
}, tabs => {
  inputValue.value = tabs[0].title;
  url = tabs[0].url;
});


// Here we let users add their own commentary.
addDetails.addEventListener('click', () => {
  const textArea = `
    <textarea class="form-control" id="userNotes" style="margin-bottom: 1rem;"></textarea>
  `;
  notesBox.innerHTML = textArea;
});

// Here we actually create the note 
takeNote.addEventListener('click', () => {
  const userCommentArea = document.getElementById('userNotes');
  const userAddedComments = userCommentArea ? userCommentArea.value : null;

  notesRef.add({
    url: url,
    title: inputValue.value,
    date: new Date,
    userComments: userAddedComments,
    madeBy: activeUser.uid
  })
  .then(next => {
    window.close();
  });

});


// here lies the logic for tab panning behavior.
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

// a method that takes the firebase unixTimestamp, converts it into a date and returns how long ago the note was taken. This will need revision at some point, probably now given that it's april all of the sudden.
const daysBetweenNowAndThen = unixTimestamp => {
  const javascriptDate = new Date(unixTimestamp.seconds * 1000);

  const dayOfEntry = javascriptDate.getDate();
  
  const now = new Date();
  const today = now.getDate();

  const daysBetween = today - dayOfEntry;
  if (daysBetween === 0) {
    return `Today`;
  } else if (daysBetween === 1) {
    return `Yesterday`;
  } else if (daysBetween < 0) {
    return `${javascriptDate.getMonth()}/${javascriptDate.getDate()}`;
  } else {
    return `${daysBetween} days ago`;
  }
}