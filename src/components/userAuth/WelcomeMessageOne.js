import React from "react";
import { motion } from "framer-motion";
import LottieAnimation from "../LottieAnimation";
import { Link } from "react-router-dom";

function WelcomeMessageOne() {
  return (
    <div className="WelcomeMessageContainer">
      <div className="WelcomeMessageImagesContainer">
        <div style={{ zIndex: -1000, overflow: "hidden" }}>
          <LottieAnimation
            lottieFile="https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/LottieFiles/bookTurning.json"
            style={{ width: "300px" }}
          ></LottieAnimation>
        </div>

        <div style={{ zIndex: 1000000, overflow: "hidden" }}>
          <LottieAnimation
            lottieFile="https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/LottieFiles/happyStudent.json"
            style={{ width: "200px" }}
          ></LottieAnimation>
        </div>
      </div>
      <div className="WelcomeMessageFooter">
        <div className="MessageTopSection">
          <div className="WelcomeMessageText">
            <b style={{ color: "#dd6260" }}>Qaleelo</b> helps you learn complex
            topics effectively.
          </div>
        </div>
        <div className="MessageMiddleSection">
          <Link
            to={"/WelcomeMessageTwo"}
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

export default WelcomeMessageOne;
