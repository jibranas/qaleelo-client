// LoginPage.js
import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import moment from "moment";
import axios from "axios";
import api from "../api";
import "./Login.css";

const LoginPage = ({ setIsLoggedIn, setTokenExpiration }) => {
  // Function to handle login
  const handleLogin = () => {
    // Perform login logic
    // Set isLoggedIn to true and set token expiration time
    setIsLoggedIn(true);

    // Set expiration time to 30 minutes from now
    // const expirationTime = new Date();
    // expirationTime.setTime(expirationTime.getTime() + (180 * 60 * 1000)); // 30 minutes in milliseconds
    // setTokenExpiration(expirationTime);

    // Set expiration time to infinity
    const expirationTime = new Date("9999-12-31T23:59:59"); // Any date far in the future
    setTokenExpiration(expirationTime);

    // Store isLoggedIn and expirationTime in localStorage
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("tokenExpiration", expirationTime.getTime()); // Store as timestamp
  };

  const CustomButton = () => {
    const Login = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        console.log(tokenResponse);
        // fetching userinfo can be done on the client or the server
        const userObject = await axios
          .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          })
          .then((res) => res.data);
        handleLogin();
        console.log(userObject);

        // Get the current date and time in the specified format
        const formattedDate = moment().format("DD-MM-YYYY hh:mm:ss");
        console.log(formattedDate);

        // Combine user data and formatted date into a single object
        const requestData = {
          userEmail: userObject.email,
          userFamilyName: userObject.family_name,
          userGivenName: userObject.given_name,
          userPicture: userObject.picture,
          loginDateTime: formattedDate,
        };
        console.log(requestData);

        // Store userEmail in localStorage
        localStorage.setItem("userEmail", userObject.email);
        console.log(localStorage.getItem("userEmail"));

        api
          .post("/insertLoginRecord", requestData)
          .then((response) => {
            if (response.status === 200) {
              return response.data; // If you expect a response from the server
            }
            throw new Error("Network response was not ok.");
          })
          .then((data) => {
            console.log(data); // Log response from the server
          })
          .catch((error) => {
            if (
              error instanceof SyntaxError &&
              error.message.includes("Unexpected token 'U'")
            ) {
              // Ignore the SyntaxError caused by unexpected token 'U'
              return;
            }
            console.error("Error from fetch:", error); // Log other errors
          });
      },
      // flow: 'implicit', // implicit is the default
    });

    return (
      <div
        onClick={() => {
          Login();
        }}
        className="GetStartedButton"
        style={{ background: "white", color: "black" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/GoogleLogo.png"
            alt="Google logo"
            style={{ width: "10%", height: "auto", marginRight: "25px" }} // Left align Google logo
          />
          <div>Continue with Google</div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div>
        <div className="LoginMessageHeader">Time to Log In!</div>
        <div className="LoginMessage">
          {" "}
          Save your progress,
          <br /> sync across devices
          <br /> and more
        </div>
      </div>
      <GoogleOAuthProvider clientId="908464604336-h4lp1h1g487rm92fhtuui99fl3pkk791.apps.googleusercontent.com">
        <CustomButton />
      </GoogleOAuthProvider>
    </div>
  );
};

export default LoginPage;
