import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import SideNavContent from "./SideNavContent";
import { Transition } from "react-transition-group";
import SubContainer from "./SubContainer";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function SidenavLandingPage(props) {
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
    progressData,
    setProgressData,
    chapterProgressData,
    setChapterProgressData,
  } = useAmazonContext();

  return (
    <div
      className="SidenavLandingPage"
      //   style={
      //     props.state === "entering"
      //       ? { animation: "moveSideBar .3s forwards" }
      //       : props.state === "entered"
      //       ? { transform: "translateX(-0px)" }
      //       : { animation: "moveSideBar .3s reverse backwards" }
      //   }
    >
      <Transition in={!subContainer} timeout={300} unmountOnExit mountOnEnter>
        {(state) => (
          <SideNavContent
            state={state}
            closeNav={props.click}
            progressData={props.progressData}
            chapterProgressData={props.chapterProgressData}
            simplifiedChaptersLessonsData={props.simplifiedChaptersLessonsData}
            unlockedLessons={props.unlockedLessons}
            unlockedChapters={props.unlockedChapters}
            unlockedQuizzes={props.unlockedQuizzes}
            isLastLessonOfChapter={props.isLastLessonOfChapter}
            isFirstLessonOfChapter={props.isFirstLessonOfChapter}
            chapterOfLastCompletedLesson={props.chapterOfLastCompletedLesson}
            lastUnlockedLessonNumber={props.lastUnlockedLessonNumber}
            lastUnlockedLessonTitle={props.lastUnlockedLessonTitle}
            isLessonProgressEmpty={props.isLessonProgressEmpty}
          />
        )}
      </Transition>
      <Transition in={subContainer} timeout={300} unmountOnExit mountOnEnter>
        {(state) => (
          <SubContainer
            state={state}
            closeNav={props.click}
            unlockedLessons={props.unlockedLessons}
            unlockedChapters={props.unlockedChapters}
            unlockedQuizzes={props.unlockedQuizzes}
          />
        )}
      </Transition>
    </div>
  );
}
