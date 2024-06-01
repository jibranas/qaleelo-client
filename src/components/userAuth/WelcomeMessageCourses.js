import React from "react";
import { motion } from "framer-motion";
import LottieAnimation from "../LottieAnimation";
import { Link } from "react-router-dom";
import CourseMenuPage from "../landingPage/CourseMenuPage";
import WelcomeCourseMenuPage from "./WelcomeCourseMenuPage";

function WelcomeMessageCourses() {
  return (
    <div className="WelcomeMessageContainer">
      <div className="WelcomeMessageImagesContainer">
        <div className="FixedScrollableSection">
          <WelcomeCourseMenuPage></WelcomeCourseMenuPage>
        </div>
      </div>
      <div className="WelcomeMessageFooter">
        <div className="MessageTopSection">
          <div className="GetStartedHeader" style={{ fontSize: "4vh" }}>
            Many Courses
          </div>
          <div className="WelcomeMessageText" style={{ paddingTop: 0 }}>
            And we will keep adding more!
          </div>
        </div>
        <div className="MessageMiddleSection">
          <Link
            to={"/WelcomeMessageSeven"}
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

export default WelcomeMessageCourses;
