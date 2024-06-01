import React from "react";
import { motion } from "framer-motion";
import LottieAnimation from "../LottieAnimation";
import { Link } from "react-router-dom";

function WelcomeMessageSeven() {
  return (
    <div className="WelcomeMessageContainer">
      <div className="WelcomeMessageImagesContainer">
        <div>
          <LottieAnimation
            lottieFile="https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/LottieFiles/scrolling.json"
            style={{ width: "450px", marginTop: "200px" }}
          ></LottieAnimation>
        </div>
      </div>
      <div className="WelcomeMessageFooter">
        <div className="MessageTopSection">
          <div className="WelcomeMessageText" style={{ fontStyle: "Italic" }}>
            "I felt I can do the courses longer than I would read the same
            content in a book."
            <br /> - User
          </div>
        </div>
        <div className="MessageMiddleSection">
          <Link
            to={"/LoginPage"}
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

export default WelcomeMessageSeven;
