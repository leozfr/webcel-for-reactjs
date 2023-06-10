import React from 'react';
import firebase from "../Firebase/Firebase";

const Login = ({ handleLogin }) => {
  const provider = new firebase.auth.GoogleAuthProvider();

  const signInWithGoogle = () => {
    firebase.auth().signInWithRedirect(provider);
  };

  return (
    <div className="login-box">
      <img
        style={{
          display: "flex",
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
        src={require('../../img/logo.png')}
        alt="webcel"
        onClick={signInWithGoogle}
      />

      <form>
        <a href="/#" onClick={signInWithGoogle}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
         Login with Gmail
        </a>
      </form>
    </div>
  );
};

export default Login;