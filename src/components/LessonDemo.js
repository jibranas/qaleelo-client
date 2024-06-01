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
import Lesson from "./Lesson";
import LessonExampleDemo from "./LessonExampleDemo";

export const LessonDemo = (props) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(-1);
  const [selectedLesson, setSelectedLesson] = useState({});
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isShowQuiz, setIsShowQuiz] = useState(false);

  let {
    courseDetails,
    setCourseDetails,
    courseTitleUserIsOn,
    setCourseTitleUserIsOn,
    entryStore,
    isDarkMode,
  } = useAmazonContext();

  console.log(courseDetails);
  console.log(entryStore);
  useEffect(() => {
    setCourseTitleUserIsOn(props.match.params.courseTitle);
  }, []);
  console.log(courseTitleUserIsOn);
  console.log(props.match.params.courseTitle);
  //set the course Details
  let courseTitle = "PromptEngineering";
  let lessonNumber = "1.1.2";
  let courseTopicsCollectionName = "promptEngineeringTopics";
  let courseTopicsModelName = "promptEngineeringTopic";
  let courseExamplesCollectionName = "promptEngineeringExamples";
  let courseExamplesModelName = "promptEngineeringExample";

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
        `/${courseTitle}/lessonRESTCAll/${lessonNumber}?collectionName=${courseTopicsCollectionName}&modelName=${courseTopicsModelName}`
      )
      .then((response) => {
        //changefordev
        setSelectedLesson(response.data);
        // setSelectedLesson(jsonData);
        // console.log(response.data);
      });
  }, []);

  console.log(
    `/api/${courseTitle}/lessonRESTCAll/${lessonNumber}?collectionName=${courseTopicsCollectionName}&modelName=${courseTopicsModelName}`
  );
  console.log(selectedLesson);

  //Examples Data from BackEnd
  const [exampleDatafromBackEnd, setExampleDatafromBackEnd] = useState([]);

  useEffect(() => {
    api
      .get(
        `/examplesData?collectionName=${courseExamplesCollectionName}&modelName=${courseExamplesModelName}`
      )
      .then((response) => {
        setExampleDatafromBackEnd(response.data);
        console.log(response.data);
      });
  }, []);

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

  return selectedLesson === "undefined" ||
    selectedLesson === null ||
    selectedLesson.length === 0 ? ( //Needed to add condition because without it, component was rendering and not waiting on selectedTopic from useEffect
    <div>Loading</div>
  ) : (
    <div>
      <div className="Lesson">
        <div className="LessonContainer">
          <div style={{}} className="LessonTitleContainer">
            <span className="LessonNumber">Demo Lesson</span> <br />
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
              <LessonExampleDemo
                lessonNumber={selectedLesson.sectionNumber}
                exampleDatafromBackEnd={exampleDatafromBackEnd}
                // sectionExample={chooseRandomExample(
                // selectedLesson.sectionNumber
                // )}
              ></LessonExampleDemo>
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

export default LessonDemo;
