/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

    let signInButton;
    let signOutButton;
    
    let userPic;
    let userName;
    
    let auth;
    let database;
    let storage;
    
    let messagesRef;
    
    let provider;
    
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
    
    // Initializes FireChat.
    let init = () => {
      // Shortcuts to DOM Elements.
      signInButton = document.getElementById('sign-in');
      signOutButton = document.getElementById('sign-out');
      
      userPic = document.getElementById('user-pic');
      userName = document.getElementById('user-name');
    
      signOutButton.addEventListener('click', signOut);
      signInButton.addEventListener('click', signIn);
    
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
    
    // A loading image URL.
    let LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';
    
    window.onload = function() {
      init();
    };
    
