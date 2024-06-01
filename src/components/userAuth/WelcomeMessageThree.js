import React from "react";
import { motion } from "framer-motion";
import LottieAnimation from "../LottieAnimation";
import { Link } from "react-router-dom";

function WelcomeMessageThree() {
  return (
    <div className="WelcomeMessageContainer">
      <div className="WelcomeMessageImagesContainer">
        <div>
          <LottieAnimation
            lottieFile="https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/LottieFiles/quizQuestion.json"
            style={{ width: "400px", marginTop: "200px" }}
          ></LottieAnimation>
        </div>
      </div>
      <div className="WelcomeMessageFooter">
        <div className="MessageTopSection">
          <div className="WelcomeMessageText">
            Then <b style={{ color: "#dd6260" }}>quizzes</b> help you commit key
            concepts to long term memory.
          </div>
        </div>
        <div className="MessageMiddleSection">
          <Link
            to={"/WelcomeMessageFour"}
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

export default WelcomeMessageThree;
