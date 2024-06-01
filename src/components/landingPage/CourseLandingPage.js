import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MainSideNav from "../sidebar/MainSideNav";
import Sidenav from "../sidebar/Sidenav";
import SideNavContent from "../sidebar/SideNavContent";
import SubContainer from "../sidebar/SubContainer";
import CourseIcon from "./CourseIcon";
import "./landingPage.css";
import "../sidebar/Sidebar.css";
import CourseContent from "./CourseContent";
import CourseStats from "./CourseStats";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import axios from "axios";
import api from "../api";
import { Link } from "react-router-dom";
import { Transition } from "react-transition-group";
import SidenavLandingPage from "../sidebar/SidenavLandingPage";
import CourseProgressBar from "../sidebar/CourseProgressBar";
import SideNavRowLesson from "../sidebar/SideNavRowLesson";
import SideNavRowQuiz from "../sidebar/SideNavRowQuiz";
import { motion } from "framer-motion";

const navBarHeight = 10;

const Navbar = styled.div`
  background: #dd6260;
  /* top: 80; */
  /* height: ${navBarHeight}vh; */
  transform: translateY(${(props) => props.navTop + "vh"});
  transition: 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  font-family: Quicksand;
  /* justify-content: space-between; */
`;

const ButtonH2 = styled.button`
  background: red;
  font-family: "Quicksand", sans-serif;
  padding: 7px 12px;
  /* margin-right: "20px"; */

  /* font-size: 15px; */
  font-size: 5vh;
  overflow: hidden;
  border: 0;
  border-radius: 15px;
  background: #8747d4;
  color: white;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); */
  transition: all 0.25s ease;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  /* margin-top: 40px; */
  display: block;
  textdecoration: none;

  &:active {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    background: #f2b1ae;
  }
`;

function CourseLandingPage(props) {
  //set the courseTitle and courseDetails for whatever course the User is on and store in AmazonContext to be used across app
  let {
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
    subContainer,
    progressData,
    setProgressData,
    chapterProgressData,
    setChapterProgressData,
  } = useAmazonContext();

  //Code to make a particular section glow
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
  let currentUrlSectionID = topicAndSectionArray[1];
  console.log(currentUrlSectionID);

  // console.log(topicNumberFromSideBar);
  //End

  //To scroll to the top on change of url or scroll to section
  useEffect(() => {
    if (currentUrlSectionID === undefined) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentUrl]);

  useEffect(() => {
    if (currentUrlSectionID) {
      const element = document.getElementById(currentUrlSectionID);
      element && element.scrollIntoView();
    }
  });
  console.log(currentUrl);
  //End

  useEffect(() => {
    //set courseTitle
    setCourseTitleUserIsOn(props.match.params.courseTitle);
  }, []);
  console.log(courseTitleUserIsOn);
  //set the course Details
  useEffect(() => {
    api.get(`/coursesData`).then((response) => {
      console.log(response.data);
      let allCourses = response.data;
      let courseChosen = allCourses.find(
        (o) => o.courseTitle.replace(/\s/g, "") === courseTitleUserIsOn
      );
      setCourseDetails(courseChosen);
    });
  }, [courseTitleUserIsOn]);
  console.log(courseDetails);
  // Fetch data for contents as well as stats based on course clicked
  useEffect(() => {
    courseDetails &&
      api
        .get(
          `/${courseTitleUserIsOn}/sideBarData?collectionName=${courseDetails.courseTopicsCollectionName}&modelName=${courseDetails.courseTopicsModelName}`
        )
        .then((response) => {
          setEntryStore(response.data);
          console.log(response.data);
        });
    courseDetails &&
      api
        .get(
          `/${courseTitleUserIsOn}/topicsData?collectionName=${courseDetails.courseTopicsCollectionName}&modelName=${courseDetails.courseTopicsModelName}`
        )
        .then((response) => {
          setTopicDatafromBackEnd(response.data);
          console.log(response.data);
        });
    courseDetails &&
      api
        .get(
          `/examplesData?collectionName=${courseDetails.courseExamplesCollectionName}&modelName=${courseDetails.courseExamplesModelName}`
        )
        .then((response) => {
          setExampleDatafromBackEnd(response.data);
          console.log(response.data);
        });
  }, [courseDetails]);
  console.log(entryStore, topicDatafromBackEnd, exampleDatafromBackEnd);

  //Code for nav to hide scroll down and show on scroll up
  const [navTop, setNavTop] = useState(0);
  var lastScrollY = window.scrollY;
  window.addEventListener("scroll", function () {
    if (lastScrollY < window.scrollY) {
      setNavTop(-{ navBarHeight }); //needs to be same as Nav Height defined above
    } else {
      setNavTop(0);
    }
    lastScrollY = window.scrollY;
  });
  //End

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

  return courseDetails ? (
    <div>
      <SidenavLandingPage
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
      ></SidenavLandingPage>

      {/* <img
        style={{ opacity: 0.2 }}
        className="courseImage"
        src="https://www.fluentu.com/blog/arabic/wp-content/uploads/sites/21/2016/09/arabic-apps-1.png"
        alt=""
      ></img> */}
    </div>
  ) : (
    <div>Loading</div>
  );
}

export default CourseLandingPage;
