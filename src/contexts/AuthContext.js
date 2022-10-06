import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateEmail,
  updatePassword,
  deleteUser,
  setUser,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  getAuth
} from "firebase/auth";
import {
  doc,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "test-users"), {
        uid: res.user.uid,
        name: "",
        authProvider: "local",
        email,
        isAdmin: false,
        role: "user",
        avatar: "",
      });
      return res;
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserEmail(email) {
    return updateEmail(currentUser, email);
  }

  function updateUserPassword(password) {
    return updatePassword(currentUser, password);
  }

  async function deleteCurrentUser() {
    const user = currentUser.uid;
    // https://cloud.google.com/firestore/docs/query-data/get-data
    const q = query(collection(db, "test-users"), where("uid", "==", user));

    const querySnapshot = await getDocs(q);

    // ensure only one document has been found
    if (querySnapshot.size === 1) {
      querySnapshot.forEach((document) => {
        deleteDoc(doc(db, "test-users", document.id))
          .then(() => {
            console.log("The document " + document.id + " has been deleted.");
          })
          .catch((error) => {
            console.log(error);
            alert(error.message);
          });
        alert(
          "The account and associated data have sucessfully been deleted. Close this window to be returned to the homepage."
        );
        return deleteUser(currentUser);
      });
    } else {
      console.log(
        "There was an error, more than one document was found in the store for that user."
      );
    }
    return;
  }

async function getUserDetails() {
   const user = currentUser.uid;
   // https://cloud.google.com/firestore/docs/query-data/get-data
   const q = query(collection(db, "test-users"), where("uid", "==", user));

   const querySnapshot = await getDocs(q);

   // ensure only one document has been found
   if (querySnapshot.size === 1) {
     querySnapshot.forEach((document) => {
       
       return document;
     });
   } else {
     console.log(
       "There was an error, more than one document was found in the store for that user."
     );
   }
   return;
}

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log("Auth", user);
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    deleteCurrentUser,
    sendSignInLinkToEmail,
    signInWithEmailLink,
    isSignInWithEmailLink,
    getAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
