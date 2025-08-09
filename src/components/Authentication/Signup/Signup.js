import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase'; // centralized firebase config
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If user chooses developer role, verify if already approved
      if (isDeveloper) {
        const devRef = collection(db, "developers");
        const q = query(devRef, where("email", "==", email));
        const querySnap = await getDocs(q);

        if (querySnap.empty) {
          // Not approved yet → store in developerRequests
          await addDoc(collection(db, "developerRequests"), {
            name,
            email,
            requestedAt: new Date()
          });
          alert("Developer signup request submitted. Awaiting approval.");
          setLoading(false);
          return;
        }
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });

      alert("Successfully Signed Up!");
      navigate('/');
    } catch (error) {
      alert(error.message);
      console.error('Signup error:', error);
    }
    setLoading(false);
  };

  return (
    <div className='Sign'>
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <i className='bx bxs-user'></i>
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <i className='bx bx-envelope'></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Set-Password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
            />
            <i className='bx bx-lock-alt'></i>
          </div>

          <div className="checkbox-role">
            <label>
              <input
                type="checkbox"
                checked={isDeveloper}
                onChange={(e) => setIsDeveloper(e.target.checked)}
              />
              Sign up as Developer
            </label>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign-Up"}
          </button>

          <div className="register-link">
            <p>User exists already? <Link to={'/Signin'}>Login!</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
