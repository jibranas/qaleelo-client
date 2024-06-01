import React from "react";
import { motion } from "framer-motion";
import LottieAnimation from "../LottieAnimation";
import { Link } from "react-router-dom";

function WelcomeMessageFour() {
  return (
    <div className="WelcomeMessageContainer">
      <div className="WelcomeMessageImagesContainer">
        <div>
          <LottieAnimation
            lottieFile="https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/LottieFiles/rocketLaunchDemo.json"
            style={{ width: "400px", marginTop: "200px" }}
          ></LottieAnimation>
        </div>
      </div>
      <div className="WelcomeMessageFooter">
        <div className="MessageTopSection">
          <div className="WelcomeMessageText">
            Let us show you how it works
            <br /> with a quick demo!
          </div>
        </div>
        <div className="MessageMiddleSection">
          <Link
            to={"/LessonDemo"}
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

export default WelcomeMessageFour;
