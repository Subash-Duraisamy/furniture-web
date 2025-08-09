// src/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {email, name, role}

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Query Firestore to check if user is a developer
        try {
          const developersRef = collection(db, "developers");
          const q = query(developersRef, where("email", "==", firebaseUser.email));
          const snapshot = await getDocs(q);

          const role = !snapshot.empty ? "developer" : "customer";

          setUser({
            email: firebaseUser.email,
            name: firebaseUser.displayName || "No Name",
            role,
          });
        } catch (error) {
          console.error("Error fetching user role:", error);
          // fallback if error
          setUser({
            email: firebaseUser.email,
            name: firebaseUser.displayName || "No Name",
            role: "customer",
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
