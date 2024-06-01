import React, { useState, useContext, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import ButtonH2 from "./Buttons";
import { Link } from "react-router-dom";
import { allExampleData } from "./TopicData";
import { useAmazonContext } from "../Contexts/AmazonContext";
import "./sidebar/Sidebar.css";
import "./Lesson.css";
import ConfettiExplosion from "react-confetti-explosion";
import { motion } from "framer-motion";
import SideNavRowLesson from "./sidebar/SideNavRowLesson";
import SideNavRowQuiz from "./sidebar/SideNavRowQuiz";
import axios from "axios";
import api from "./api";
import ChapterProgressBar from "./ChapterProgressBar";

const ExampleBox = styled.div`
  /* box-shadow: 0 0.1rem 0.5rem rgba(0, 0, 0, 0.2); */
  border-radius: 5px;
  padding: 10px;
  /* background: #252525; */
  /* margin-top: 80px; */
  font-family: "Quicksand", sans-serif;
`;

const ExampleQuestion = styled.div`
  /* font-size: 17px; */
  font-size: 2.5vh;
  font-weight: bold;
  text-align: center;
  color: #a678de;
  padding: 20px;
`;

const ExampleAnswer = styled(motion.div)`
  font-size: 2.5vh;
  font-weight: bold;
  text-align: center;
  font-family: Quicksand;
  /* border-radius: 15px; */
  /* padding: 10px; */
  color: #252525;
  display: flex;
  background: ${(props) =>
    props.answerClicked == props.answer ? props.answerColor : "#D2CFE6"};
  /* margin: 20px; */
  transition: transform 300ms;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`;

const AnswerExplanation = styled.div`
  /* font-size: 2vh; */
  display: ${(props) =>
    props.answerClicked == props.answer ? "flex" : "none"};
  align-items: center;
  justify-content: center;
`;

const LessonExample = (props) => {
  console.log(props);
  //Obtain Example Data from back end
  const {
    courseTitleUserIsOn,
    entryStore,
    isDarkMode,
    subContainer,

    setCourseTitleUserIsOn,
    courseDetails,
    setCourseDetails,
    topicDatafromBackEnd,
    setTopicDatafromBackEnd,
    exampleDatafromBackEnd,
    setExampleDatafromBackEnd,

    setEntryStore,

    setIsDarkMode,
  } = useAmazonContext();

  console.log(entryStore);

  const [answerColor, setAnswerColor] = useState("#e8e2ef");
  const [answerClicked, setAnswerClicked] = useState("NoAnswer");
  const [answerClickedToPractice, setAnswerClickedToPractice] = useState(false);
  const [progressPosted, setProgressPosted] = useState(false);
  const [progressData, setProgressData] = useState(null); //Put it as state to ensure new data after fetch is sent to chapterProgressBar

  const nextLessonBoxRef = useRef(null);

  // State to hold the shuffled answers
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [selectedExample, setSelectedExample] = useState({});
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const isMobile = window.innerWidth <= 768; // You can adjust the breakpoint (768) as needed

  // Randomiser function to choose an example for this Lesson

  const chooseRandomExample = (sectionNumber) => {
    let allSectionExamples =
      props.exampleDatafromBackEnd.length !== 0 &&
      props.exampleDatafromBackEnd.filter(
        //list of ALL examples for a particular section in the database
        (example) => example.sectionNumber == sectionNumber
      );
    const random = Math.floor(Math.random() * allSectionExamples.length);
    let selectedExample = allSectionExamples[random];
    return selectedExample;
  };

  console.log(selectedExample);

  const checkAnswer = async (isCorrect, answer) => {
    setAnswerClicked(answer);
    setAnswerClickedToPractice(true);

    if (isCorrect === true && !progressPosted) {
      setAnswerColor("#DAF7A6");
      setAnsweredCorrectly(true);
      // Trigger confetti burst
      // Scroll distance based on device type
      const scrollDistance = isMobile ? 300 : 300;
      // Scroll smoothly by 600 pixels after 300ms after answer is correct
      setTimeout(() => {
        window.scrollBy({
          top: scrollDistance,
          behavior: "smooth",
        });
      }, 300);

      // Send User progress on lessons to the backend only if user completes it (lessons)
      // Retrieve userEmail from localStorage
      const userEmail = localStorage.getItem("userEmail");
      console.log(userEmail);
      console.log(courseTitleUserIsOn);
      console.log(props.currentSectionNumber);
      // Prepare data to be sent to the backend
      const progressData = {
        userEmail: userEmail,
        progress: [
          {
            courseProgress: courseTitleUserIsOn,
            lessonProgress: [props.currentSectionNumber],
          },
        ],
      };

      try {
        // Send progress data to the backend
        await api.post("/insertProgressRecord", progressData);
        console.log("Progress data sent successfully!");
        setProgressPosted(true); // Update state to indicate that data has been posted
      } catch (error) {
        console.error("Error sending progress data:", error);
      }
    } else {
      setAnswerColor("#ff726f");
    }
  };

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

    if (progressPosted) {
      fetchProgress(); // Fetch data only if progress has been posted
    }
  }, [progressPosted]);

  console.log(progressData);

  // Utility function to shuffle an array
  function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }
  useEffect(() => {
    var selectedExampleOne = chooseRandomExample(props.lessonNumber);
    setSelectedExample(selectedExampleOne);

    // Shuffle the answers when the component mounts
    setShuffledAnswers(shuffleArray(selectedExampleOne.answers));
  }, []);

  return (
    <ExampleBox className="LessonExampleBox">
      <ExampleQuestion>
        {selectedExample && selectedExample.question}
      </ExampleQuestion>
      {shuffledAnswers.map((answerItem) => {
        return (
          <>
            <ExampleAnswer
              className="LessonExampleAnswerBox"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() =>
                checkAnswer(answerItem.isCorrect, answerItem.answer)
              }
              answerColor={answerColor}
              answer={answerItem.answer}
              answerClicked={answerClicked}
            >
              <div className="LessonExampleAnswer">{answerItem.answer}</div>
            </ExampleAnswer>
            {
              <AnswerExplanation
                answerClicked={answerClicked}
                answer={answerItem.answer}
                answerColor={answerColor}
              >
                {answerItem.isCorrect == false ? (
                  <div
                    className={`LessonExampleAnswerExplanationContainer ${
                      isDarkMode ? "darkThemeFont" : "lightThemeFont"
                    }`}
                  >
                    <i class="wrongCross fa-solid fa-xmark"></i>
                    <p
                      style={{
                        display: "inline",
                      }}
                      className="LessonExampleAnswerExplanation"
                    >
                      {answerItem.explanation}
                    </p>
                  </div>
                ) : (
                  <>
                    <i class="correctCheckMark fa-solid fa-check"></i>
                    {answeredCorrectly && (
                      <ConfettiExplosion
                        autoStart={true}
                        duration={5000}
                        particleCount={100}
                        spread={360}
                        origin={{ x: 0.8, y: 0.5 }}
                        force={0.8}
                        width={1600}
                      />
                    )}
                    <p
                      className={`LessonExampleAnswerExplanation ${
                        isDarkMode ? "darkThemeFont" : "lightThemeFont"
                      }`}
                    >
                      Correct!
                    </p>
                    {answeredCorrectly && (
                      <ConfettiExplosion
                        autoStart={true}
                        duration={5000}
                        particleCount={100}
                        spread={360}
                        origin={{ x: 0.8, y: 0.5 }}
                        force={0.8}
                        width={1600}
                      />
                    )}
                  </>
                )}
              </AnswerExplanation>
            }
          </>
        );
      })}
      {/* Render the "Next Lesson" button if answered correctly */}
      {answeredCorrectly && props.nextLessonNumber == false && (
        <motion.div
          ref={nextLessonBoxRef}
          className="LessonExampleNextLessonBox"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: [1, 1.03, 1] }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          {" "}
          <ChapterProgressBar
            lessonNumber={props.currentSectionNumber}
            courseTitleUserIsOn={courseTitleUserIsOn}
            progressData={progressData}
          ></ChapterProgressBar>
          <div style={{}} className="LessonTitleContainer">
            <span className="LessonNumber">End Of Chapter</span>{" "}
          </div>
          <Link to={`/${courseTitleUserIsOn}/quiz/${props.chapterNumber}`}>
            <motion.div
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <SideNavRowQuiz
                number={props.chapterNumber}
                title={props.chapterTitle}
                width="90%"
                marginLeft="5%"
              ></SideNavRowQuiz>
            </motion.div>
          </Link>
        </motion.div>
      )}{" "}
      {answeredCorrectly && props.nextLessonNumber !== false && (
        <motion.div
          ref={nextLessonBoxRef}
          className="LessonExampleNextLessonBox"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: [1, 1.03, 1] }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <ChapterProgressBar
            lessonNumber={props.currentSectionNumber}
            courseTitleUserIsOn={courseTitleUserIsOn}
            progressData={progressData}
          ></ChapterProgressBar>
          <div style={{}} className="LessonTitleContainer">
            <span className="LessonNumber">Next Lesson</span>{" "}
          </div>
          <Link to={`/${courseTitleUserIsOn}/lesson/${props.nextLessonNumber}`}>
            <motion.div
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <SideNavRowLesson
                backgroundColor="white"
                number={props.nextLessonNumber}
                title={props.nextLessonTitle}
                chapter={props.chapterTitle}
                width="90%"
                marginLeft="5%"
                borderRadius="14% 2% 2% 14% / 50% 10% 10% 50%"
              ></SideNavRowLesson>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </ExampleBox>
  );
};

export default LessonExample;
