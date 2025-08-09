import React from 'react';
import "./Arc_reactor.css";
import { useNavigate } from 'react-router-dom';

const Arc_reactor = () => {
  const navigate = useNavigate();

  const SIGN_IN = () => navigate('/Signin');
  const SIGN_UP = () => navigate('/Signup');
  const RESET = () => navigate('/Forgot');

  return (
    <div className='In'>
      <div className="likebody">
        <div className="center-element" style={{ animationDelay: "0s" }}>
          <button onClick={SIGN_IN}>LOGIN</button>
        </div>

        <div className="center-element" style={{ animationDelay: "3s" }}>
          <button onClick={SIGN_UP}>SIGN-UP</button>
        </div>

        <div className="center-element" style={{ animationDelay: "6s" }}>
          <button onClick={RESET}>RESET</button>
        </div>
      </div>
    </div>
  );
};

export default Arc_reactor;
