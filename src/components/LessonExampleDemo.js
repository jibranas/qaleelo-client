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

const ExampleBox = styled.div`
  /* box-shadow: 0 0.1rem 0.5rem rgba(0, 0, 0, 0.2); */

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

  /*desktop*/
  @media only screen and (min-width: 601px) {
    padding: 0px; /* Change this to the desired width */
  }
  /*mobile*/
  @media only screen and (max-width: 600px) {
    padding: 20px;
  }
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

const LessonExampleDemo = (props) => {
  console.log(props);
  //Obtain Example Data from back end
  const { courseTitleUserIsOn, entryStore, isDarkMode } = useAmazonContext();
  console.log(entryStore);

  const [answerColor, setAnswerColor] = useState("#e8e2ef");
  const [answerClicked, setAnswerClicked] = useState("NoAnswer");
  const [answerClickedToPractice, setAnswerClickedToPractice] = useState(false);
  const nextLessonBoxRef = useRef(null);

  // State to hold the shuffled answers
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [selectedExample, setSelectedExample] = useState({});
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const isMobile = window.innerWidth <= 768; // You can adjust the breakpoint (768) as needed
  const particleSize = isMobile ? 7 : 1;
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

  const checkAnswer = (isCorrect, answer) => {
    setAnswerClicked(answer);
    setAnswerClickedToPractice(true);

    if (isCorrect == true) {
      setAnswerColor("#DAF7A6");
      setAnsweredCorrectly(true);
      // Trigger confetti burst
      // Scroll distance based on device type
      const scrollDistance = isMobile ? 100 : 300;
      // Scroll smoothly by 600  pixels after 300ms after answer is correct
      setTimeout(() => {
        window.scrollBy({
          top: scrollDistance,
          behavior: "smooth",
        });
      }, 300);

      console.log(answerColor);

      // Store the current chapter title in localStorage if it's not already there
      if (!localStorage.getItem("chapterTitle")) {
        localStorage.setItem("chapterTitle", props.chapterTitle);
      }
      console.log(localStorage.getItem("chapterTitle"));

      // Get the current list of chapter titles from localStorage
      let chapterTitles =
        JSON.parse(localStorage.getItem("chapterTitles")) || [];

      // Check if the current chapter title is already in the list
      if (!chapterTitles.includes(props.chapterTitle)) {
        // If it's not, add it to the list
        chapterTitles.push(props.chapterTitle);
      }

      // Store the updated list back in localStorage
      localStorage.setItem("chapterTitles", JSON.stringify(chapterTitles));
      console.log(chapterTitles);

      // Get the current list of completed chapters from localStorage
      let lessonProgress =
        JSON.parse(localStorage.getItem("lessonProgress")) || [];

      // Add the current chapter to the list if it's not already there
      if (!lessonProgress.includes(props.currentSectionNumber)) {
        lessonProgress.push(props.currentSectionNumber);
      }

      // Store the updated list in localStorage
      // Users will continue from the last entry inserted in the list
      localStorage.setItem("lessonProgress", JSON.stringify(lessonProgress));
      console.log(lessonProgress);
      console.log(props.currentSectionNumber);
    } else {
      setAnswerColor("#ff726f");
    }
  };

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
          <motion.div
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="MessageMiddleSection"
            style={{ marginTop: "40px" }}
          >
            <Link
              to={"/WelcomeMessageFive"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <button className="GetStartedButton">Continue</button>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </ExampleBox>
  );
};

export default LessonExampleDemo;
