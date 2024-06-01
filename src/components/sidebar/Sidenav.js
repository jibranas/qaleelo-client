import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import SideNavContent from "./SideNavContent";
import { Transition } from "react-transition-group";
import SubContainer from "./SubContainer";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../api";
import CourseProgressBar from "./CourseProgressBar";

export default function Sidenav(props) {
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
    isDarkMode,
    setIsDarkMode,
    progressData,
    setProgressData,
    chapterProgressData,
    setChapterProgressData,
    setSubContainer,
  } = useAmazonContext();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      console.error("User email not found in local storage");
      return;
    }

    const fetchProgress = async () => {
      try {
        const response = await api.get("/fetchProgressRecord", {
          params: {
            userEmail: userEmail,
          },
        });
        setProgressData(response.data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgress();
  }, []);

  console.log(progressData);
  console.log(courseTitleUserIsOn);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      console.error("User email not found in local storage");
      return;
    }

    const fetchChapterProgress = async () => {
      try {
        const response = await api.get("/fetchChapterProgressRecord", {
          params: {
            userEmail: userEmail,
          },
        });
        setChapterProgressData(response.data);
      } catch (error) {
        console.error("Error fetching chapter progress data:", error);
      }
    };

    fetchChapterProgress();
  }, []);

  console.log(chapterProgressData);
  console.log(courseTitleUserIsOn);

  //Simplfied entryStore

  function simplifyData(data) {
    return (
      data &&
      data
        .map((topicHeader) => {
          return topicHeader.entries.map((chapter) => {
            return {
              chapterNumber: chapter.topicNumber,
              chapterTitle: chapter.title,
              lessons: chapter.entries[0].entries.map((lesson) => {
                return {
                  lessonNumber: lesson.sectionNumber,
                  lessonTitle: lesson.title,
                };
              }),
            };
          });
        })
        .flat()
    );
  }

  // Usage
  const simplifiedChaptersLessonsData = simplifyData(entryStore);
  console.log(simplifiedChaptersLessonsData);

  function generateunlockedLessons(
    progressData,
    simplifiedChaptersLessonsData,
    chapterProgressData,
    courseTitleUserIsOn
  ) {
    const unlockedLessons = [];

    const userProgress =
      progressData &&
      progressData.find(
        (progress) => progress.courseProgress === courseTitleUserIsOn
      );
    if (userProgress) {
      const { lessonProgress } = userProgress;
      const lastCompletedLesson = lessonProgress[lessonProgress.length - 1];
      const chapterContainingLastCompletedLesson =
        simplifiedChaptersLessonsData &&
        simplifiedChaptersLessonsData.find((chapter) => {
          return chapter.lessons.some(
            (lesson) => lesson.lessonNumber === lastCompletedLesson
          );
        });

      if (chapterContainingLastCompletedLesson) {
        const { lessons } = chapterContainingLastCompletedLesson;
        const lastCompletedLessonIndex = lessons.findIndex(
          (lesson) => lesson.lessonNumber === lastCompletedLesson
        );
        if (lastCompletedLessonIndex === lessons.length - 1) {
          // Add all completed lessons and check chapter completion
          unlockedLessons.push(...lessonProgress);
          const nextChapterIndex =
            simplifiedChaptersLessonsData.findIndex(
              (chapter) =>
                chapter.chapterNumber ===
                chapterContainingLastCompletedLesson.chapterNumber
            ) + 1;
          const nextChapter = simplifiedChaptersLessonsData[nextChapterIndex];
          if (nextChapter) {
            const chapterProgress =
              chapterProgressData &&
              chapterProgressData.find(
                (progress) => progress.courseProgress === courseTitleUserIsOn
              )?.chapterProgress;
            if (
              chapterProgress &&
              chapterProgress.includes(
                chapterContainingLastCompletedLesson.chapterNumber
              )
            ) {
              const nextLesson = nextChapter.lessons[0];
              unlockedLessons.push(nextLesson.lessonNumber);
            }
          }
        } else {
          // Add completed lessons and next lesson in the same chapter
          const nextLesson = lessons[lastCompletedLessonIndex + 1];
          unlockedLessons.push(...lessonProgress, nextLesson.lessonNumber);
        }
      }
    }

    return unlockedLessons;
  }

  // Generate the third dataset
  const unlockedLessons = generateunlockedLessons(
    progressData,
    simplifiedChaptersLessonsData,
    chapterProgressData,
    courseTitleUserIsOn
  );

  // Log the result
  console.log(unlockedLessons);

  function generateUnlockedQuizzes(
    progressData,
    simplifiedChaptersLessonsData,
    courseTitleUserIsOn
  ) {
    const unlockedQuizzes = [];

    const userProgress =
      progressData &&
      progressData.find(
        (progress) => progress.courseProgress === courseTitleUserIsOn
      );
    if (userProgress) {
      simplifiedChaptersLessonsData &&
        simplifiedChaptersLessonsData.forEach((chapter) => {
          const lastLessonNumber =
            chapter.lessons[chapter.lessons.length - 1].lessonNumber;
          const isLastLessonCompleted =
            userProgress.lessonProgress.includes(lastLessonNumber);
          if (isLastLessonCompleted) {
            unlockedQuizzes.push(chapter.chapterNumber);
          }
        });
    }

    return unlockedQuizzes;
  }

  function generateUnlockedChapters(
    simplifiedChaptersLessonsData,
    unlockedLessons
  ) {
    const unlockedChapters = [];

    simplifiedChaptersLessonsData &&
      simplifiedChaptersLessonsData.forEach((chapter) => {
        const hasUnlockedLesson = chapter.lessons.some((lesson) =>
          unlockedLessons.includes(lesson.lessonNumber)
        );
        if (hasUnlockedLesson) {
          unlockedChapters.push(chapter.chapterNumber);
        }
      });

    return unlockedChapters;
  }

  // Generate the arrays
  const unlockedQuizzes = generateUnlockedQuizzes(
    progressData,
    simplifiedChaptersLessonsData,
    courseTitleUserIsOn
  );
  const unlockedChapters = generateUnlockedChapters(
    simplifiedChaptersLessonsData,
    unlockedLessons
  );

  // Log the results
  console.log(unlockedQuizzes);
  console.log(unlockedChapters);

  //Find lastunlockedlesson

  const lastUnlockedLessonNumber = unlockedLessons[unlockedLessons.length - 1];

  function getLessonTitle(lessonNumber) {
    if (simplifiedChaptersLessonsData) {
      for (let chapter of simplifiedChaptersLessonsData) {
        for (let lesson of chapter.lessons) {
          if (lesson.lessonNumber === lessonNumber) {
            return lesson.lessonTitle;
          }
        }
      }
    }

    return null; // Return null if lessonNumber is not found
  }

  const lastUnlockedLessonTitle = getLessonTitle(lastUnlockedLessonNumber);
  // Example usage
  console.log(lastUnlockedLessonNumber, lastUnlockedLessonTitle);

  //How can I determine true or false that the last completed lesson in progressData, is the last lesson of chapter?

  // Step 1: Find the lessonProgress array based on the course the user is on
  const currentCourseProgress =
    progressData &&
    progressData.find(
      (progress) => progress.courseProgress === courseTitleUserIsOn
    );

  // Step 2: Get the last completed lesson from the lessonProgress array
  const lastCompletedLesson =
    currentCourseProgress && currentCourseProgress.lessonProgress.slice(-1)[0];

  // Step 3: Find the corresponding chapter in simplifiedChaptersLessonsData
  const chapterOfLastCompletedLesson =
    simplifiedChaptersLessonsData &&
    simplifiedChaptersLessonsData.find((chapter) =>
      chapter.lessons.some(
        (lesson) => lesson.lessonNumber === lastCompletedLesson
      )
    );

  // Step 4: Check if the last completed lesson is the last lesson of the chapter
  const isLastLessonOfChapter =
    chapterOfLastCompletedLesson &&
    chapterOfLastCompletedLesson.lessons.slice(-1)[0].lessonNumber ===
      lastCompletedLesson;

  console.log(isLastLessonOfChapter);

  //Similary could you also determine true or false that the last unlocked lesson in unlockedLessons, is the first lesson of chapter?

  // Step 1: Get the last unlocked lesson from the unlockedLessons array
  const lastUnlockedLesson = unlockedLessons.slice(-1)[0];

  // Step 2: Find the corresponding chapter in simplifiedChaptersLessonsData
  const chapterOfLastUnlockedLesson =
    simplifiedChaptersLessonsData &&
    simplifiedChaptersLessonsData.find((chapter) =>
      chapter.lessons.some(
        (lesson) => lesson.lessonNumber === lastUnlockedLesson
      )
    );

  // Step 3: Check if the last unlocked lesson is the first lesson of the chapter
  const isFirstLessonOfChapter =
    chapterOfLastUnlockedLesson &&
    chapterOfLastUnlockedLesson.lessons[0].lessonNumber === lastUnlockedLesson;

  console.log(isFirstLessonOfChapter);

  // Check if no lesson progress

  // Find the lessonProgress array based on the course the user is on

  // Check if lessonProgress is empty
  const isLessonProgressEmpty =
    currentCourseProgress && currentCourseProgress.lessonProgress.length === 0;
  console.log(isLessonProgressEmpty);

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
      <div
        className="sidenavHeader"
        style={{
          display: "flex",
          background: "#8747d4",
          borderBottom: "1px solid white",
        }}
      >
        <Link to={"/"} onClick={() => setSubContainer(false)}>
          {" "}
          <div className="homeBtn">
            <i class="fa-solid fa-house"></i>
          </div>
        </Link>

        <div className="newCloseBtn" onClick={props.click}>
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>

      <Transition in={!subContainer} timeout={300} unmountOnExit mountOnEnter>
        {(state) => (
          <SideNavContent
            state={state}
            closeNav={props.click}
            progressData={progressData}
            chapterProgressData={chapterProgressData}
            simplifiedChaptersLessonsData={simplifiedChaptersLessonsData}
            unlockedLessons={unlockedLessons}
            unlockedChapters={unlockedChapters}
            unlockedQuizzes={unlockedQuizzes}
            isLastLessonOfChapter={isLastLessonOfChapter}
            isFirstLessonOfChapter={isFirstLessonOfChapter}
            chapterOfLastCompletedLesson={chapterOfLastCompletedLesson}
            lastUnlockedLessonNumber={lastUnlockedLessonNumber}
            lastUnlockedLessonTitle={lastUnlockedLessonTitle}
            isLessonProgressEmpty={isLessonProgressEmpty}
          />
        )}
      </Transition>
      <Transition in={subContainer} timeout={300} unmountOnExit mountOnEnter>
        {(state) => (
          <SubContainer
            state={state}
            closeNav={props.click}
            unlockedLessons={unlockedLessons}
            unlockedChapters={unlockedChapters}
            unlockedQuizzes={unlockedQuizzes}
          />
        )}
      </Transition>
    </div>
  );
}
