import React, { useState } from 'react';
import './Signin.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../firebase';  // adjust your path
import { collection, query, where, getDocs } from 'firebase/firestore';

const Signin = () => {
  const [email, setEmail] = useState('');    
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      // Query Firestore to check if user is developer
      const developersRef = collection(db, "developers");
      const q = query(developersRef, where("email", "==", loggedInUser.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Welcome Developer!");
        // You can set role in your app's context or state here if needed
      } else {
        alert("Welcome Customer!");
      }

      navigate('/Home');
    } catch (error) {
      alert(error.message);
    }
  }

  const validate = () => {
    if (email.trim() === '') {
      alert('Please enter your email');
      return false;
    }
    if (password.trim() === '') {
      alert('Please enter your password');
      return false;
    }
    return true;
  }

  return (
    <div className='In'>
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <i className='bx bx-envelope'></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <i className='bx bx-lock-alt'></i>
          </div>
          <div className="remember-forgot">
            <label><input type="checkbox" /> Remember Me</label>
            <Link to={'/Forgot'}> Forgot Password? </Link>
          </div>
          <button type="submit" className="btn">Login</button>
          <div className="register-link">
            <p>Don't have an Account? <Link to={'/Signup'}> Register!</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
