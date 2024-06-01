import React from "react";
import "./QuizSidebar.css";
import QuizSideNavContent from "./QuizSideNavContent";
import { Transition } from "react-transition-group";
import QuizSubContainer from "./QuizSubContainer";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import { Link } from "react-router-dom";

export default function QuizSidenav(props) {
  let {
    subContainer,
    courseTitleUserIsOn,
    setCourseTitleUserIsOn,
    courseDetails,
    setCourseDetails,
    topicDatafromBackEnd,
    setTopicDatafromBackEnd,
    exampleDatafromBackEnd,
    setExampleDatafromBackEnd,
    entryStore,
    setEntryStore,
  } = useAmazonContext();
  return (
    <div
      className="sidenav"
      style={
        props.state === "entering"
          ? { animation: "moveSideBar .3s forwards" }
          : props.state === "entered"
          ? { transform: "translateX(-0px)" }
          : { animation: "moveSideBar .3s reverse backwards" }
      }
    >
      <Link to={`/${courseDetails.courseTitle.replace(/\s/g, "")}/start`}>
        <div className="sidenavHeader" style={{ background: "#e8e2ef" }}>
          {courseDetails.courseTitle && (
            <img
              className="courseSideNavImage"
              src={
                "https://qaleelo-assets.s3.us-east-2.amazonaws.com/" +
                courseDetails.courseTitle.replace(/\s/g, "") +
                "/courseImage/" +
                courseDetails.courseTitle.replace(/\s/g, "") +
                ".png"
              }
              alt=""
            ></img>
          )}
        </div>
      </Link>
      <Transition in={!subContainer} timeout={300} unmountOnExit mountOnEnter>
        {(state) => <QuizSideNavContent state={state} closeNav={props.click} />}
      </Transition>
      <Transition in={subContainer} timeout={300} unmountOnExit mountOnEnter>
        {(state) => <QuizSubContainer state={state} closeNav={props.click} />}
      </Transition>
    </div>
  );
}
