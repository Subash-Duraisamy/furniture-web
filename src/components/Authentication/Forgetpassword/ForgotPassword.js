import React, { useState } from 'react';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import './ForgotPassword.css'; // optional styling
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const auth = getAuth();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox (and Spam/Junk folder).');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="note">
          If you don’t see the email within a few minutes, check your Spam or Junk folder.
        </p>
        <p><Link to="/Signin">Back to Login</Link></p>
      </div>
    </div>
  );
};

export default ForgotPassword;
