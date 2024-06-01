import React from "react";
import { motion } from "framer-motion";
import LottieAnimation from "../LottieAnimation";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ResponsiveDiv1 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /*desktop*/
  @media only screen and (min-width: 601px) {
    width: 300px; /* Change this to the desired width */
    margin-top: 40px;
  }
  /*mobile*/
  @media only screen and (max-width: 600px) {
    width: 380px;
    margin-top: 200px;
  }
`;

function WelcomeMessageFive() {
  return (
    <div className="WelcomeMessageContainer">
      <div className="WelcomeMessageImagesContainer">
        <ResponsiveDiv1>
          <LottieAnimation lottieFile="https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/LottieFiles/busyLife.json"></LottieAnimation>
        </ResponsiveDiv1>
      </div>
      <div className="WelcomeMessageFooter">
        <div className="MessageTopSection">
          <div className="GetStartedHeader" style={{ fontSize: "4vh" }}>
            Just 5 minutes a day
          </div>
          <div className="WelcomeMessageText" style={{ paddingTop: 0 }}>
            We understand you're busy. <br />
            So we designed the lessons to fit your schedule.
          </div>
        </div>
        <div className="MessageMiddleSection">
          <Link
            to={"/WelcomeMessageCourses"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <button className="GetStartedButton">Continue</button>
          </Link>
        </div>
        <div className="MessageBottomSection"></div>
      </div>
    </div>
  );
}

export default WelcomeMessageFive;
