import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactHtmlParser from "react-html-parser";
import jsonData from "./sectionDescription.json";
import "./Lesson.css";
import Example from "./Example";
// import exampleDatafromBackEnd from "./example.json";
import LessonExample from "./LessonExample";
import { useAmazonContext } from "../Contexts/AmazonContext";
import axios from "axios";
import api from "./api";
import LessonMainSideNav from "./sidebar/LessonMainSideNav";
import LottieAnimation from "./LottieAnimation";
import { Container } from "react-bootstrap";

export const Lesson = (props) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(-1);
  const [selectedLesson, setSelectedLesson] = useState({});
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isShowQuiz, setIsShowQuiz] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(null);
  // Had previously declared progress data here and not in amazon context because whenever
  // the page was renredning the new progress data would be fetch and it would mess up lessonComplete logic used to detemrine whether lesson should fully render

  let {
    courseDetails,
    setCourseDetails,
    courseTitleUserIsOn,
    setCourseTitleUserIsOn,
    entryStore,
    isDarkMode,
    subContainerEntries,
    setSubContainerEntries,
    subContainer,
    setSubContainer,
    navOpen,
    setNavOpen,
    progressData,
  } = useAmazonContext();

  //Logic to open the Chapter Lessons Menu subentry (on the subcontainer in the side bar) related to the lesson the user is on

  console.log(entryStore);
  useEffect(() => {
    let nextSectionNumber = null;
    let nextSectionTitle = null;
    let foundCurrentSection = false;
    // Example usage:
    const currentSectionNumber = selectedLesson.sectionNumber;

    if (entryStore) {
      //Needed to wait for entryStore to load
      // Iterate through the entryStore data
      for (const topic of entryStore) {
        for (const entry of topic.entries) {
          for (const subEntry of entry.entries) {
            for (const section of subEntry.entries) {
              // Check if the section number matches the currentSectionNumber
              if (section.sectionNumber === currentSectionNumber) {
                foundCurrentSection = true;

                setSubContainerEntries(entry.entries);
                setSubContainer(true);
                break;
              }
            }
            if (foundCurrentSection) break;
          }
          if (foundCurrentSection) break;
        }
        if (foundCurrentSection) break;
      }
    }
  }, [navOpen, courseDetails, selectedLesson]);

  //End

  // Start: Function to find the next section number and title
  function findNextSection(currentSectionNumber) {
    let nextSectionNumber = null;
    let nextSectionTitle = null;
    let foundCurrentSection = false;

    if (entryStore) {
      //Needed to wait for entryStore to load
      // Iterate through the entryStore data
      for (const topic of entryStore) {
        for (const entry of topic.entries) {
          for (const subEntry of entry.entries) {
            for (const section of subEntry.entries) {
              // Check if the section number matches the currentSectionNumber
              if (section.sectionNumber === currentSectionNumber) {
                foundCurrentSection = true;

                // Find the index of the current section in its parent entry
                const currentIndex = subEntry.entries.findIndex(
                  (item) => item.sectionNumber === currentSectionNumber
                );

                // If the current section is not the last one in the entry
                if (currentIndex !== subEntry.entries.length - 1) {
                  // Get the next section's data
                  const nextSection = subEntry.entries[currentIndex + 1];
                  nextSectionNumber = nextSection.sectionNumber;
                  nextSectionTitle = nextSection.title;
                }
                break;
              }
            }
            if (foundCurrentSection) break;
          }
          if (foundCurrentSection) break;
        }
        if (foundCurrentSection) break;
      }
    }

    if (nextSectionNumber === null) {
      return false;
    }

    return {
      nextSectionNumber,
      nextSectionTitle,
    };
  }

  // Example usage:
  const currentSectionNumber = selectedLesson.sectionNumber; // Assuming this is the last section
  const result = findNextSection(currentSectionNumber);

  var nextLessonNumber = "";
  var nextLessonTitle = "";

  if (result === false) {
    console.log("No next section.");
    nextLessonNumber = false;
    nextLessonTitle = false;
  } else {
    console.log("Next Section Number:", result.nextSectionNumber);
    console.log("Next Section Title:", result.nextSectionTitle);
    nextLessonNumber = result.nextSectionNumber;
    nextLessonTitle = result.nextSectionTitle;
  }
  console.log(nextLessonNumber, nextLessonTitle);

  //End: Function to find the next section number and title

  //Finding topic number and topic title for current section

  function findChapterInfo(sectionNumber, entryStore) {
    if (entryStore) {
      for (const topic of entryStore) {
        for (const entry of topic.entries) {
          for (const chapter of entry.entries) {
            for (const section of chapter.entries) {
              if (section.sectionNumber === sectionNumber) {
                return {
                  chapterTitle: chapter.title,
                  chapterNumber: chapter.topicNumber,
                };
              }
            }
          }
        }
      }
    }

    // Return null or handle not found case as needed
    return null;
  }

  const chapterInfo = findChapterInfo(selectedLesson.sectionNumber, entryStore);

  var chapterTitle = "";
  var chapterNumber = "";
  if (chapterInfo) {
    console.log("Chapter Title:", chapterInfo.chapterTitle);
    console.log("Chapter Number:", chapterInfo.chapterNumber);
    chapterTitle = chapterInfo.chapterTitle;
    chapterNumber = chapterInfo.chapterNumber;
  } else {
    console.log("Section not found.");
  }

  console.log(courseDetails);
  console.log(entryStore);
  useEffect(() => {
    setCourseTitleUserIsOn(props.match.params.courseTitle);
  }, []);
  console.log(courseTitleUserIsOn);
  console.log(props.match.params.courseTitle);
  //set the course Details
  useEffect(() => {
    api.get(`/coursesData`).then((response) => {
      console.log(response.data);
      let allCourses = response.data;
      let courseChosen = allCourses.find(
        (o) =>
          o.courseTitle.replace(/\s/g, "") === props.match.params.courseTitle
      );
      setCourseDetails(courseChosen);
    });
  }, [courseTitleUserIsOn]);
  console.log(courseDetails);

  console.log(courseDetails);
  console.log(props.match.params.courseTitle);

  //Lesson Data from BackEnd

  console.log(props.match);
  console.log(props.match.params.lessonNumber);

  let lessonNumberFromSideBar = props.match.params.lessonNumber;
  console.log(lessonNumberFromSideBar);
  console.log(courseDetails.courseTopicsCollectionName);
  console.log(courseDetails.courseTopicsModelName);

  useEffect(() => {
    api
      .get(
        `/${props.match.params.courseTitle}/lessonRESTCAll/${lessonNumberFromSideBar}?collectionName=${courseDetails.courseTopicsCollectionName}&modelName=${courseDetails.courseTopicsModelName}`
      )
      .then((response) => {
        //changefordev
        setSelectedLesson(response.data);
        // setSelectedLesson(jsonData);
        // console.log(response.data);
      });
  }, [lessonNumberFromSideBar, courseDetails]);

  console.log(
    `/api/${props.match.params.courseTitle}/lessonRESTCAll/${lessonNumberFromSideBar}?collectionName=${courseDetails.courseTopicsCollectionName}&modelName=${courseDetails.courseTopicsModelName}`
  );
  console.log(selectedLesson);

  // Find out whether the lesson is completed
  useEffect(() => {
    const courseProgressData =
      progressData &&
      progressData.find(
        (progress) => progress.courseProgress === courseTitleUserIsOn
      );

    console.log(courseProgressData);

    // Get the lessons the user has completed

    setCompletedLessons(new Set(courseProgressData?.lessonProgress || []));
    console.log(completedLessons);
  }, [selectedLesson]);

  console.log(progressData);
  console.log(courseTitleUserIsOn);

  //End

  //Examples Data from BackEnd
  const [exampleDatafromBackEnd, setExampleDatafromBackEnd] = useState([]);

  useEffect(() => {
    api
      .get(
        `/examplesData?collectionName=${courseDetails.courseExamplesCollectionName}&modelName=${courseDetails.courseExamplesModelName}`
      )
      .then((response) => {
        setExampleDatafromBackEnd(response.data);
        console.log(response.data);
      });
  }, [lessonNumberFromSideBar, courseDetails]);

  // let { exampleDatafromBackEnd } = useAmazonContext();
  console.log(exampleDatafromBackEnd);

  const handleNextSection = () => {
    // Increment the section index
    setCurrentSectionIndex((prevIndex) => prevIndex + 1);
  };

  const handleShowLessonExample = () => {
    setIsShowQuiz(true);
  };

  useEffect(() => {
    if (isShowQuiz) {
      // Scroll to the LessonExample component when isShowQuiz becomes true
      const lessonExampleElement = document.getElementById("lessonExample");
      if (lessonExampleElement) {
        const rect = lessonExampleElement.getBoundingClientRect();
        const offset = rect.top + window.scrollY - 80; // Adjusted offset to leave 100px space above
        window.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    }
  }, [isShowQuiz]);

  const isMobile = window.innerWidth <= 768; // You can adjust the breakpoint (768) as needed

  //Scroll upon click current section is at the 30% from top of screen
  useEffect(() => {
    if (currentSectionIndex >= 0) {
      const currentSection = document.getElementById(
        `section-${currentSectionIndex}`
      );
      if (currentSection) {
        const rect = currentSection.getBoundingClientRect();
        const offset = rect.top + window.scrollY - window.innerHeight * 0.3;
        window.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    }
  }, [currentSectionIndex]);

  //hide tap to next for 10 seconds everytime a section loads:
  useEffect(() => {
    // Hide the button temporarily
    setIsButtonVisible(false);

    // Show the button again after 10 seconds
    const timer = setTimeout(() => {
      setIsButtonVisible(true);
    }, 5000);

    // Cleanup the timer if the component unmounts or currentSectionIndex changes
    return () => clearTimeout(timer);
  }, [currentSectionIndex]);
  //End

  //Reset current index when lesson changes:
  useEffect(() => {
    // Reset currentSectionIndex to 0 when lessonNumberFromSideBar or selectedLesson changes
    setCurrentSectionIndex(-1);
    setIsShowQuiz(false);
  }, [lessonNumberFromSideBar, selectedLesson]);

  // Randomiser function to choose an example for this Lesson

  // const chooseRandomExample = (sectionNumber) => {
  //   let allSectionExamples =
  //     exampleDatafromBackEnd.length !== 0 &&
  //     exampleDatafromBackEnd.filter(
  //       //list of ALL examples for a particular section in the database
  //       (example) => example.sectionNumber == sectionNumber
  //     );
  //   const random = Math.floor(Math.random() * allSectionExamples.length);
  //   let selectedExample = allSectionExamples[random];
  //   return selectedExample;
  // };

  console.log(currentSectionIndex);

  if (completedLessons && completedLessons.has(selectedLesson.sectionNumber)) {
    return selectedLesson === "undefined" ||
      selectedLesson === null ||
      selectedLesson.length === 0 ? ( //Needed to add condition because without it, component was rendering and not waiting on selectedTopic from useEffect
      <div>Loading</div>
    ) : (
      <div>
        <LessonMainSideNav></LessonMainSideNav>
        <div className="Lesson">
          <div className="LessonContainer">
            <div style={{}} className="LessonTitleContainer">
              <span className="LessonNumber">
                Lesson {selectedLesson.sectionNumber}
              </span>{" "}
              <br />
              <span className="LessonTitle">{selectedLesson.sectionTitle}</span>
            </div>

            {selectedLesson.lessonAnimation &&
              selectedLesson.lessonAnimation.map((section, index) =>
                // Conditionally render sections based on the index

                section.className == "multiSection" ? (
                  <motion.div
                    className={section.className}
                    style={section.style}
                    key={index}
                  >
                    {section.subSections.map((subSection, subSectionIndex) => (
                      <motion.div
                        className={subSection.className}
                        style={subSection.style}
                        key={subSectionIndex}
                      >
                        {subSection.miniSections.map(
                          (miniSection, miniSectionIndex) =>
                            miniSection.className === "LottieAnimation" ? (
                              <LottieAnimation
                                key={miniSectionIndex}
                                lottieFile={miniSection.lottieFilePath}
                                className={miniSection.className}
                                style={miniSection.style}
                                speed={miniSection.speed}
                                loop={miniSection.loop}
                              ></LottieAnimation>
                            ) : (
                              <motion.div
                                key={miniSectionIndex}
                                className={`${miniSection.className} ${
                                  isDarkMode
                                    ? "darkThemeFont"
                                    : "lightThemeFont"
                                }`}
                                style={miniSection.style}
                              >
                                <div style={miniSection.contentStyle}>
                                  {ReactHtmlParser(miniSection.content)}{" "}
                                </div>
                                {/* Use subSection.content here */}
                              </motion.div>
                            )
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className={section.className}
                    style={section.style}
                    key={index}
                  >
                    {section.subSections.map((subSection, subSectionIndex) =>
                      subSection.className == "YouTubeVideo" ? (
                        <div style={subSection.style}>
                          <div className="ratio ratio-16x9">
                            <iframe
                              src={subSection.videoLink}
                              title="YouTube video"
                              allowFullScreen
                              style={{ width: "100%", height: "100%" }}
                              allow="autoplay" // Add this line
                            ></iframe>
                          </div>
                        </div>
                      ) : subSection.className == "LottieAnimation" ? (
                        <LottieAnimation
                          key={subSectionIndex}
                          lottieFile={subSection.lottieFilePath}
                          className={subSection.className}
                          style={subSection.style}
                          speed={subSection.speed}
                          loop={subSection.loop}
                        ></LottieAnimation>
                      ) : (
                        <motion.div
                          key={subSectionIndex}
                          className={`${subSection.className} ${
                            isDarkMode ? "darkThemeFont" : "lightThemeFont"
                          }`}
                          style={subSection.style}
                        >
                          <div style={subSection.contentStyle}>
                            {ReactHtmlParser(subSection.content)}{" "}
                          </div>
                          {/* Use subSection.content here */}
                        </motion.div>
                      )
                    )}
                  </motion.div>
                )
              )}

            <div style={{ minHeight: "50px", zIndex: 999 }}></div>
          </div>
        </div>
      </div>
    );
  }

  //Return this if the lesson has not been completed:

  return selectedLesson === "undefined" ||
    selectedLesson === null ||
    selectedLesson.length === 0 ? ( //Needed to add condition because without it, component was rendering and not waiting on selectedTopic from useEffect
    <div>Loading</div>
  ) : (
    <div>
      <LessonMainSideNav></LessonMainSideNav>
      <div className="Lesson">
        <div className="LessonContainer">
          <div style={{}} className="LessonTitleContainer">
            <span className="LessonNumber">
              Lesson {selectedLesson.sectionNumber}
            </span>{" "}
            <br />
            <span className="LessonTitle">{selectedLesson.sectionTitle}</span>
          </div>

          {selectedLesson.lessonAnimation &&
            selectedLesson.lessonAnimation.map(
              (section, index) =>
                // Conditionally render sections based on the index
                index <= currentSectionIndex &&
                (section.className == "multiSection" ? (
                  <motion.div
                    id={`section-${index}`}
                    className={section.className}
                    style={section.style}
                    initial={section.initial}
                    animate={section.animate}
                    exit={section.exit}
                    transition={section.transition}
                    key={index}
                  >
                    {section.subSections.map((subSection, subSectionIndex) => (
                      <motion.div
                        id={`subSection-${index}`}
                        className={subSection.className}
                        style={subSection.style}
                        initial={subSection.initial}
                        animate={subSection.animate}
                        exit={subSection.exit}
                        transition={subSection.transition}
                        key={index}
                      >
                        {subSection.miniSections.map(
                          (miniSection, miniSectionIndex) =>
                            miniSection.className === "LottieAnimation" ? (
                              <LottieAnimation
                                key={miniSectionIndex}
                                lottieFile={miniSection.lottieFilePath}
                                className={miniSection.className}
                                style={miniSection.style}
                                initial={miniSection.initial}
                                animate={miniSection.animate}
                                exit={miniSection.exit}
                                transition={miniSection.transition}
                                speed={miniSection.speed}
                                loop={miniSection.loop}
                              ></LottieAnimation>
                            ) : (
                              <motion.div
                                key={miniSectionIndex}
                                className={`${miniSection.className} ${
                                  isDarkMode
                                    ? "darkThemeFont"
                                    : "lightThemeFont"
                                }`}
                                style={miniSection.style}
                                initial={miniSection.initial}
                                animate={miniSection.animate}
                                exit={miniSection.exit}
                                transition={miniSection.transition}
                              >
                                <div style={miniSection.contentStyle}>
                                  {ReactHtmlParser(miniSection.content)}{" "}
                                </div>
                                {/* Use subSection.content here */}
                              </motion.div>
                            )
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    id={`section-${index}`}
                    className={section.className}
                    style={section.style}
                    initial={section.initial}
                    animate={section.animate}
                    exit={section.exit}
                    transition={section.transition}
                    key={index}
                  >
                    {section.subSections.map((subSection, subSectionIndex) =>
                      subSection.className == "YouTubeVideo" ? (
                        <div style={subSection.style}>
                          <div className="ratio ratio-16x9">
                            <iframe
                              src={subSection.videoLink}
                              title="YouTube video"
                              allowFullScreen
                              style={{ width: "100%", height: "100%" }}
                              allow="autoplay" // Add this line
                            ></iframe>
                          </div>
                        </div>
                      ) : subSection.className == "LottieAnimation" ? (
                        <LottieAnimation
                          key={subSectionIndex}
                          lottieFile={subSection.lottieFilePath}
                          className={subSection.className}
                          style={subSection.style}
                          initial={subSection.initial}
                          animate={subSection.animate}
                          exit={subSection.exit}
                          transition={subSection.transition}
                          speed={subSection.speed}
                          loop={subSection.loop}
                        ></LottieAnimation>
                      ) : (
                        <motion.div
                          key={subSectionIndex}
                          className={`${subSection.className} ${
                            isDarkMode ? "darkThemeFont" : "lightThemeFont"
                          }`}
                          style={subSection.style}
                          initial={subSection.initial}
                          animate={subSection.animate}
                          exit={subSection.exit}
                          transition={subSection.transition}
                        >
                          <div style={subSection.contentStyle}>
                            {ReactHtmlParser(subSection.content)}{" "}
                          </div>
                          {/* Use subSection.content here */}
                        </motion.div>
                      )
                    )}
                  </motion.div>
                ))
            )}

          {selectedLesson.lessonAnimation && isShowQuiz && (
            <motion.div
              id="lessonExample"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 10,
              }}
            >
              <LessonExample
                currentSectionNumber={currentSectionNumber}
                nextLessonNumber={nextLessonNumber}
                nextLessonTitle={nextLessonTitle}
                chapterNumber={chapterNumber}
                chapterTitle={chapterTitle}
                lessonNumber={selectedLesson.sectionNumber}
                exampleDatafromBackEnd={exampleDatafromBackEnd}
                // sectionExample={chooseRandomExample(
                // selectedLesson.sectionNumber
                // )}
              ></LessonExample>
            </motion.div>
          )}
          <div style={{ minHeight: "1000px", zIndex: 999 }}></div>
        </div>
        {/* Render a button to show the next section */}
        {selectedLesson.lessonAnimation &&
          currentSectionIndex < selectedLesson.lessonAnimation.length - 1 && (
            <div className="forwardButton" onClick={handleNextSection}></div>
          )}
        {selectedLesson.lessonAnimation &&
          currentSectionIndex == selectedLesson.lessonAnimation.length - 1 &&
          isShowQuiz == false && (
            <div
              className="forwardButton"
              onClick={handleShowLessonExample}
            ></div>
          )}

        {currentSectionIndex == -1 && (
          <motion.div
            className={`${
              isDarkMode
                ? "forwardButtonVisibleDark"
                : "forwardButtonVisibleLight"
            }`}
            onClick={handleNextSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            Tap anywhere
          </motion.div>
        )}
        {selectedLesson.lessonAnimation &&
          currentSectionIndex > -1 &&
          currentSectionIndex < 1 &&
          selectedLesson.lessonAnimation.length !== 1 &&
          isButtonVisible && (
            <motion.div
              className={`${
                isDarkMode
                  ? "forwardButtonVisibleDark"
                  : "forwardButtonVisibleLight"
              }`}
              onClick={handleNextSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Tap anywhere
            </motion.div>
          )}
      </div>
    </div>
  );
};

export default Lesson;
