import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const images = [
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/PromptEngineering/sectionImages/1.1.1.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/PromptEngineering/sectionImages/1.1.2.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/PromptEngineering/courseImage/PromptEngineering.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/AI+image+generation.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/aliabdaal.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/deblank1.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/deblank2.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/designerLock.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/flowerprompt2.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/flowerresponse2.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/flowershop.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/flowershopprompt.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/flowershopresponse.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/freeflo.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/inputandoutput.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/Nico1.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/Nico2.png",
  "https://qaleelo-assets.s3.us-east-2.amazonaws.com/aiGenerated/successfulprompt.png",
];

function GetStarted() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 1000); // Change the delay (in milliseconds) between each image here
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="WelcomeMessageContainer">
      <div
        className="GetStartedImagesContainer"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {images.slice(0, currentIndex + 1).map((image, index) => (
          <motion.img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className="GetStartedImage"
            style={{ display: currentIndex === index ? "block" : "none" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
      <div className="WelcomeMessageFooter">
        <div className="MessageTopSection">
          <div className="GetStartedHeader">Qaleelo</div>
          <div className="WelcomeMessageText" style={{ paddingTop: 0 }}>
            The power of doing little
          </div>
        </div>
        <div className="MessageMiddleSection">
          <Link
            to={"/WelcomeMessageOne"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <button className="GetStartedButton">Get Started</button>
          </Link>
        </div>
        <div className="MessageBottomSection">
          {" "}
          <Link to={"/LoginPage"}>
            <p className="GetStartedLoginText">
              Already have an account?{" "}
              <span style={{ color: "#8747d4" }}>Log In</span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
