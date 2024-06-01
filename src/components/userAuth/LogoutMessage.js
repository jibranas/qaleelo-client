import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import "./LogoutMessage.css";

const LogoutMessage = ({ setIsLoggedIn }) => {
  const history = useHistory();

  useEffect(() => {
    // Redirect to the login page after 3 seconds
    const timeoutId = setTimeout(() => {
      // Push the login route to navigate to it
      history.push('/');
      // Set isLoggedIn to false after redirecting to the login page
      setIsLoggedIn(false);
      // Clear all items from local storage
      localStorage.clear();
      // Refresh the page
      // window.location.reload();
    }, 2000);

    // Clean up the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [history, setIsLoggedIn]);

  return (
    <div className="message-container">
      <h1>You have logged out successfully! Redirecting you to the Login Page again...</h1>
    </div>
  );  
};

export default LogoutMessage;
