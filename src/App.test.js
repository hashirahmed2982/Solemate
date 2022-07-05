import { render, screen } from '@testing-library/react';
import App from './App';
import firebase from 'firebase';

test('renders learn react link', () => {
  render(<App />);
  let error = '';
  expect(error).toEqual('');
});

test('signInWithEmailAndPassword should throw error with wrong credentials', async () => {
  render(<App />);
  let error = '';
  firebase.auth().signInWithEmailAndPassword('testing@testing.com', '1')
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((err) => {
    error = err.message;
  }).then(() => {
    expect(error).toBe("There is no user record corresponding to this identifier. The user may have been deleted.");
  })
});

test('signInWithEmailAndPassword should throw error with invalid email', async () => {
  render(<App />);
  let error = '';
  firebase.auth().signInWithEmailAndPassword('momer', '12345678')
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/invalid-email");
  })
});

test('signInWithEmailAndPassword should throw error with disabled user', async () => {
  render(<App />);
  let error = '';
  firebase.auth().signInWithEmailAndPassword('lol@lol.com', '12345678')
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/user-disabled");
  })
});

test('signInWithEmailAndPassword should throw error with incorrect password', async () => {
  render(<App />);
  let error = '';
  firebase.auth().signInWithEmailAndPassword('momer@sabanciuniv.edu', '123456788')
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/wrong-password");
  })
});


test('signInWithEmailAndPassword should not throw error with correct credentials', async () => {
  render(<App />);
  let error = '';
  firebase.auth().signInWithEmailAndPassword('momer@sabanciuniv.edu', '12345678')
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((err) => {
    error = err.message;
  }).then(() => {
    expect(error).toBe("");
  })
});

test('createUserWithEmailAndPassword should throw error if user already exists', async () => {
  render(<App />);
  let error = '';
  firebase.auth().createUserWithEmailAndPassword('momer@sabanciuniv.edu', '12345678')
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/email-already-in-use");
  })
});

test('createUserWithEmailAndPassword should throw error if email is invalid', async () => {
  render(<App />);
  let error = '';
  firebase.auth().createUserWithEmailAndPassword('momer', '12345678')
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/invalid-email");
  })
});

test('createUserWithEmailAndPassword should not throw error if new user', async () => {
  render(<App />);
  let error = '';
  firebase.auth().createUserWithEmailAndPassword('testingfor@testing.com', '12345678')
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("");
  })
});

test('sendPasswordResetEmail should not throw error if user exists', async () => {
  render(<App />);
  let error = '';
  firebase.auth().sendPasswordResetEmail('momer@sabanciuniv.edu')
  .then(() => {
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("");
  })
});

test('sendPasswordResetEmail should throw error if user does not exist', async () => {
  render(<App />);
  let error = '';
  firebase.auth().sendPasswordResetEmail('momerrrrr@sabanciuniv.edu')
  .then(() => {
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/user-not-found");
  })
});

test('sendPasswordResetEmail should throw error if invalid email', async () => {
  render(<App />);
  let error = '';
  firebase.auth().sendPasswordResetEmail('momer')
  .then(() => {
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/invalid-email");
  })
});

test('signInAnonymously should not throw error as it is allowed', async () => {
  render(<App />);
  let error = '';
  firebase.auth().signInAnonymously()
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("");
  })
});

test('signInWithEmailLink should throw error if invalid email', async () => {
  render(<App />);
  let error = '';
  firebase.auth().fetchSignInMethodsForEmail('momer')
  .then(() => {
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/invalid-email");
  })
});

test('signInWithEmailLink should throw error if user disabled', async () => {
  render(<App />);
  let error = '';
  firebase.auth().fetchSignInMethodsForEmail('lol@lol.com')
  .then(() => {
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/user-disabled");
  })
});

test('signInWithCustomToken should throw error if invalid token', async () => {
  render(<App />);
  let error = '';
  firebase.auth().signInWithCustomToken('hahahha')
  .then(() => {
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/invalid-custom-token");
  })
});

test('signInWithEmailLink should throw error if invalid email', async () => {
  render(<App />);
  let error = '';
  firebase.auth().signInWithEmailLink('momer')
  .then(() => {
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/invalid-email");
  })
});

test('signInWithEmailLink should throw error if user disabled', async () => {
  render(<App />);
  let error = '';
  firebase.auth().signInWithEmailLink('lol@lol.com')
  .then(() => {
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/user-disabled");
  })
});

test('fetchSignInMethodsForEmail should throw error if invalid email', async () => {
  render(<App />);
  let error = '';
  firebase.auth().fetchSignInMethodsForEmail('momer')
  .then(() => {
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/invalid-email");
  })
});

test('confirmPasswordReset should throw error if invalid action code', async () => {
  render(<App />);
  let error = '';
  firebase.auth().confirmPasswordReset('hahhaha', '12345678')
  .then(() => {
  })
  .catch((err) => {
    error = err.code;
  }).then(() => {
    expect(error).toBe("auth/invalid-action-code");
  })
});

