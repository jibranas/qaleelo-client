import React, { useEffect, useState } from "react";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import SideNavRowLesson from "./SideNavRowLesson";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import SideNavRowQuiz from "./SideNavRowQuiz";
import Logout from "../userAuth/Logout";
import axios from "axios";
import ChapterProgressBar from "../ChapterProgressBar";

export default function SubContainer(props) {
  const {
    subContainerEntries,
    setSubContainer,
    courseTitleUserIsOn,
    isDarkMode,
    progressData,
    setProgressData,
    chapterProgressData,
    setChapterProgressData,
    entryStore,
    setNavOpen,
  } = useAmazonContext();
  const [currentSectionNumberState, setCurrentSectionNumberState] =
    useState("");

  console.log(subContainerEntries);

  //Code to set current section state so that it can be used to check which section was clicked to colour code it
  useEffect(() => {
    let currentUrl = window.location.href;
    console.log(currentUrl);
    // setCurrentUrlState(currentUrl);
    let currentUrlArray = currentUrl.split("/");
    console.log(currentUrlArray);
    let topicAndSection = currentUrlArray[currentUrlArray.length - 1];
    console.log(topicAndSection);
    //Handling%23 in URL
    var topicAndSectionArray = [];

    if (topicAndSection.includes("%")) {
      topicAndSectionArray = topicAndSection.split("%23");
    } else {
      topicAndSectionArray = topicAndSection.split("#");
    }
    console.log(topicAndSectionArray);
    let currentSectionNumber = topicAndSectionArray[1];
    console.log(currentSectionNumber);
    setCurrentSectionNumberState(currentSectionNumber);
  }, []);
  //End

  return (
    <div
      className={`sub-container ${isDarkMode ? "dark" : "light"}`}
      style={
        props.state === "entering"
          ? { animation: "moveSubContainer .3s forwards" }
          : props.state === "entered"
          ? { transform: "translateX(0px)" }
          : { animation: "moveSubContainer .3s reverse backwards" }
      }
    >
      <div
        className="sidenavHeader"
        style={{
          background: "#8747d4",
          position: "sticky",
          top: "0",
          zIndex: "2000",
        }}
      >
        {subContainerEntries &&
          subContainerEntries.map((subEntry, index) => (
            <div>
              <div
                className="sub-header"
                onClick={() => setSubContainer(false)}
              >
                <i class="fas fa-arrow-left"></i>
              </div>
              {/* <Link to={`/${courseTitleUserIsOn}/topic/${subEntry.topicNumber}`}> */}
              <div style={{ color: "white" }} className="CourseTitleContainer">
                <span className="LessonNumber">
                  Chapter {subEntry.topicNumber}
                </span>{" "}
                <br />
                <span className="LessonTitle">{subEntry.title}</span>
              </div>
              <ChapterProgressBar
                chapterNumber={subEntry.topicNumber}
                courseTitleUserIsOn={courseTitleUserIsOn}
                color="#80e8a2"
              ></ChapterProgressBar>
            </div>
          ))}
      </div>
      <div className="sideNavContentsContainer">
        <div className="sideNavChapterHeader">
          <p>Lessons</p>
        </div>
        {subContainerEntries &&
          subContainerEntries.map((subEntry, index) => (
            <>
              {/* </Link> */}
              {subEntry.entries.map((superEntry) =>
                (props.unlockedLessons &&
                  props.unlockedLessons.includes(superEntry.sectionNumber)) ||
                superEntry.sectionNumber == "1.1.1" ? (
                  <Link
                    key={superEntry.sectionNumber}
                    to={`/${courseTitleUserIsOn}/lesson/${superEntry.sectionNumber}`}
                  >
                    <div
                      className="sidenavContentChapter"
                      onClick={
                        props.closeNav
                          ? props.closeNav
                          : () => setNavOpen(false)
                      }
                    >
                      <SideNavRowLesson
                        number={superEntry.sectionNumber}
                        title={superEntry.title}
                        lockState="unlocked"
                        styleVariable={
                          superEntry.sectionNumber == currentSectionNumberState
                            ? { background: "#ebebeb" }
                            : {}
                        }
                      />
                    </div>
                  </Link>
                ) : (
                  <div key={superEntry.sectionNumber}>
                    <div className="sidenavContentChapter">
                      <SideNavRowLesson
                        number={superEntry.sectionNumber}
                        title={superEntry.title}
                        lockState="locked"
                        styleVariable={
                          superEntry.sectionNumber == currentSectionNumberState
                            ? { background: "#ebebeb" }
                            : {}
                        }
                      />
                    </div>
                  </div>
                )
              )}

              {/* Display "Quiz" div for the last subEntry */}
              {index === subContainerEntries.length - 1 &&
              props.unlockedQuizzes &&
              props.unlockedQuizzes.includes(subEntry.topicNumber) ? (
                <Link
                  to={`/${courseTitleUserIsOn}/quiz/${subEntry.topicNumber}`}
                >
                  <div
                    className="sidenavContentChapter"
                    onClick={
                      props.closeNav ? props.closeNav : () => setNavOpen(false)
                    }
                    style={{ marginTop: "15px" }}
                  >
                    <SideNavRowQuiz
                      title={subEntry.title}
                      number={subEntry.topicNumber}
                      lockState="unlocked"
                    ></SideNavRowQuiz>
                  </div>
                </Link>
              ) : (
                <div
                  className="sidenavContentChapter"
                  style={{ marginTop: "15px" }}
                >
                  <SideNavRowQuiz
                    title={subEntry.title}
                    number={subEntry.topicNumber}
                    lockState="locked"
                  ></SideNavRowQuiz>
                </div>
              )}
            </>
          ))}
        <div style={{ minHeight: "400px" }}></div>
      </div>
    </div>
  );
}
