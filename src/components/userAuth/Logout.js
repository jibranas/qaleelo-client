import React, { useState, useEffect } from "react";
import { GoogleLogout } from 'react-google-login';
import { useHistory } from "react-router-dom";
import { gapi } from 'gapi-script';

// This needs to be moved to env
const clientId = "910323986833-fnj0aj92c8l42bl0gdv0ogaejuc2fdfs.apps.googleusercontent.com"

function LogoutN() {
}

const Logout = ({ setIsLoggedIn }) => {
    const history = useHistory();

    const handleLogout = () => {
        history.replace('/LogoutMessage');
      };

    const onSuccess = () => {
        console.log("log out successful!");
    }

return (
  <div style={{ position: 'absolute', top: '120px', right: '40px' }}>
      <div id clientId="signOutButton">
        <GoogleLogout
            clientId={clientId}
            buttonText={"Logout"}
            onLogoutSuccess={credentialResponse => {
                onSuccess();
                handleLogout(); 
              }}
          text="signin_with"
          width="300px"
          size="large"
        />
      </div>
    </div>
  );
};

export default Logout;