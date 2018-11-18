
let signInButton;
let signOutButton;

let messageList;
let messageForm;
let messageInput;

let submitButton;
let question;
let userPic;
let userName;

let continuebutton;

let finished;

let auth;
let database;
let storage;

let messagesRef;

let provider;
var count = 0;
var count2 = 0;
var testing = 5;

var questionArray = new Array("Welcome to your new best friend when it comes to food on the Hill!",
                              "For Breakfast, cereal or donuts ",
                              "How many calories are in the chichen piadina",
                              "What type of cuisine did you eat growing up:" + "\t" 
                              + " 1 – American, 2 – Mexican.Spanish," + 
                              "3 – Korean/Asian, 4 – Indian, 5 – American inspired international dishes, 6 – other",
                              "How do you describe your current diet? 1. healthy"+
                              "2. Unhealthy, 3 the same thing over and over, 4 unclear",
                              "what do assoicate with the word drink: 1. orange juice 2. soda",
                              "How likely to eat ethnic food: 1. very unlikely 2. unlikely 3. neutral 4. likely 5. very likely",
                              "Was your favorite food cooked at home(1) or store bought(2) or both(3)?",
                              "How likely are you to eat fruit on a regular day, from 1 - 5 (5 being most likely)",
                              "How likely are you to eat greek food when available, from 1 - 5",
                              "How often do you check nutritional values, from 1 - 5, 1 being never and 5 being always",
                              "When you think of soup, do you think of veggie soup(1) or creamy soup(2) more?",
                              );

var answerArray = new Array (questionArray.length);




// Enables or disables the submit button depending on the values of the input
// fields.
let toggleButton = () => {
  if (messageInput.value) {
    submitButton.removeAttribute('disabled');
  } else {
    submitButton.setAttribute('disabled', 'true');
  }
};

// Saves a new message on the Firebase DB.
let saveMessage = (e) => {
  e.preventDefault();
  count2++;
  // Check that the user entered a message and is signed in.
  if (messageInput.value && checkSignedInWithMessage()) { // 
    var currentUser = auth.currentUser;
    // Add a new message entry to the Firebase Database.
    messagesRef.push({
      name: currentUser.displayName,
      text: messageInput.value
    }).then(() => {
    // Clear message text field and SEND button state.
      resetInput(messageInput);
      toggleButton();
    }).catch((error) => {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};

// Signs-in FireChat.
let signIn = () => {
  // Sign in Firebase using popup auth and Google as the identity provider.
  provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

// Signs-out of FireChat.
let signOut = () => {
  //signout Firebase
  auth.signOut();
};

function loadQuestion(){  
  let questionInfo = {
    'Questions': questionArray
  }
  database.ref('Questions').push(questionInfo);
}

// Initializes FireChat.
let init = () => {
  // Shortcuts to DOM Elements.
  signInButton = document.getElementById('sign-in');
  signOutButton = document.getElementById('sign-out');
  
  messageList = document.getElementById('messages');
  messageForm = document.getElementById('message-form');
  messageInput = document.getElementById('message');
  submitButton = document.getElementById('submit');
  userPic = document.getElementById('user-pic');
  userName = document.getElementById('user-name');
  question = document.getElementById('question');
  finished = document.getElementById('finished');
  
  continuebutton = document.getElementById('continue');

  // Saves message on form submit.
  messageForm.addEventListener('submit', saveMessage);
  // messageForm.addEventListener('submit', count2 % 2 == 1);
  
  signOutButton.addEventListener('click', signOut);
  signInButton.addEventListener('click', signIn);

  // Toggle for the button.
  messageInput.addEventListener('keyup', toggleButton);
  messageInput.addEventListener('change', toggleButton);
  
  initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
let initFirebase = () => {
  // Shortcuts to Firebase SDK features.
  auth = firebase.auth();
  database = firebase.database();
  storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  auth.onAuthStateChanged(onAuthStateChanged);
};

// Loads chat messages history and listens for upcoming ones.
let showQuestion = () => {

}

let loadMessages = () => {
  // Reference to the /messages/ database path.
  messagesRef = database.ref('messages');
  // Make sure we remove all previous listeners.
  messagesRef.off();

  // Loads the last 20 messages and listen for new ones.
  let setMessage = (data) => {
    let val = data.val();
    displayMessage(data.key, val.name, val.text, val.photoUrl);
  };
  messagesRef.limitToLast(1).on('child_added', setMessage);
  messagesRef.limitToLast(0).on('child_changed', setMessage);
}; 

// Triggers when the auth state change for instance when the user signs-in or signs-out.
let onAuthStateChanged = (user) => {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    const profilePicUrl = user.photoURL;   
    const userNameText = user.displayName;        

    // Set the user's profile pic and name.
    userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    userName.textContent = userNameText;

    // Show user's profile and sign-out button.
    userName.removeAttribute('hidden');
    userPic.removeAttribute('hidden');
    signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    signInButton.setAttribute('hidden', 'true');
  
    
    // var div = document.getElementById(key);
    // div.querySelector('.question').textContent = questionArray[count];
    // We load currently existing chant messages.
    loadMessages();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    userName.setAttribute('hidden', 'true');
    userPic.setAttribute('hidden', 'true');
    signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButton.removeAttribute('hidden');
    
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
let checkSignedInWithMessage = () => {
  // Return true if the user is signed in Firebase
  if (auth.currentUser) {
    return true;
  }
  
  let tray = document.getElementById("error-tray");
  // Display a message to the user using a Toast.
  tray.innerText = "You gotta sign-in first!";
  setTimeout(function() {tray.innerText = "";}, 2000);
  return false;
};

// Resets the given input element.
let resetInput = (element) => {
  element.value = '';
};
function load(){
  console.log('ewfwe');
  
  let userInfo = {
    'name': auth.currentUser.displayName,
    'answers': answerArray
  }
  database.ref('Users').push(userInfo);
}
// Template for messages.
let MESSAGE_TEMPLATE =
    '<li class="message-item">' +
      '<div class="name"></div>' +
      '<div class="question"></div>' +
      '<div class="message"></div>' +
    '</li>';

// A loading image URL.
let LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

function setQuestion()
{
  let question = document.getElementById('question');
  var count2 = count+1;
  if(count == questionArray.length - 1)
    count2 = 1;
  question.innerHTML = questionArray[count2];
}


// Displays a Message in the UI.
let displayMessage = (key, name, text, picUrl) => {
//   Set page Question before message display
  setQuestion();
  var div = document.getElementById(key);
  
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    messageList.appendChild(div);
  }
  div.querySelector('.name').textContent = name;
  
  div.querySelector('.question').textContent = questionArray[count];
  var messageElement = div.querySelector('.message');
  answerArray [count] = text;
  messageElement.textContent = answerArray [count];
  if (count == 0){
    messageElement.textContent = null;
  }
    
  count ++;
  
  if (count >= questionArray.length)
  {
    messageInput.setAttribute('hidden', 'true');
    
    continuebutton.removeAttribute('hidden');
    submitButton.setAttribute('hidden', 'true');
    
    question.setAttribute('hidden', 'true');
    finished.removeAttribute('hidden');
  }
  
  // console.log(answerArray[count]);
  // Replace all line breaks by <br>.
  messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  
  // Show the card fading-in.
  setTimeout(function() {div.classList.add('visible')}, 1);
  messageList.scrollTop = messageList.scrollHeight;
  messageInput.focus();
};

window.onload = function() {
  init();
};
