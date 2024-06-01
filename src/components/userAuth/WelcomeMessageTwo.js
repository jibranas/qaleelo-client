import React from "react";
import { motion } from "framer-motion";
import LottieAnimation from "../LottieAnimation";
import { Link } from "react-router-dom";

function WelcomeMessageTwo() {
  return (
    <div className="WelcomeMessageContainer">
      <div className="WelcomeMessageImagesContainer">
        <div>
          <LottieAnimation
            lottieFile="https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/LottieFiles/InteractiveLesson.json"
            style={{ width: "400px", marginTop: "200px" }}
          ></LottieAnimation>
        </div>
      </div>
      <div className="WelcomeMessageFooter">
        <div className="MessageTopSection">
          <div className="WelcomeMessageText">
            <b style={{ color: "#dd6260" }}>Lessons</b> are bite sized, visual,
            and tappable to hold your attention.
          </div>
        </div>
        <div className="MessageMiddleSection">
          <Link
            to={"/WelcomeMessageThree"}
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

export default WelcomeMessageTwo;
