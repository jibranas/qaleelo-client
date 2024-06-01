import React, { useState, useContext, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

import { ScoreContext, SubmitButtonContext } from "../Contexts/ScoreContext";
import { HashLink } from "react-router-hash-link";
import { useAmazonContext } from "../Contexts/AmazonContext";
import { motion } from "framer-motion";
import SideNavRowLesson from "./sidebar/SideNavRowLesson";
import { Link } from "react-router-dom";

const fadeIn = keyframes`
0%{opacity: 0}
100%{opacity: 1}
`;

const ButtonH2 = styled.button`
  background: red;
  font-family: "Quicksand", sans-serif;
  padding: 7px 12px;
  text-transform: uppercase;
  font-size: 2vh;
  overflow: hidden;
  border: 0;
  border-radius: 5px;
  background: #967bb6;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.25s ease;
  cursor: pointer;
  &:active {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    background: #f2b1ae;
  }
`;

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
  /* border-radius: 15px; */
  /* padding: 10px; */
  text-align: center;
  font-family: Quicksand;
  display: flex;
  background: ${(props) =>
    props.answerClicked == props.answer && props.submitted
      ? props.answerColor
      : props.answerClicked == props.answer
      ? "#b8b8b8"
      : "#D2CFE6"};

  transition: transform 300ms;
  justify-content: center;
  pointer-events: ${(props) => (props.submitted ? "none" : "auto")};

  &:hover {
    cursor: pointer;
  }
`;

const AnswerExplanation = styled.div`
  /* font-size: 2vh; */
  display: ${(props) =>
    props.answerClicked == props.answer && props.submitted ? "flex" : "none"};
  align-items: center;
  justify-content: center;
`;

const QuizExample = (props) => {
  const { courseTitleUserIsOn, entryStore, isDarkMode } = useAmazonContext();
  const [sumCorrect, setSumCorrect] = useContext(ScoreContext);
  const [submitted, setSubmitted] = useContext(SubmitButtonContext);

  const [answerColor, setAnswerColor] = useState("#e8e2ef");
  const [answerClicked, setAnswerClicked] = useState("NoAnswer");
  const [answerClickedToPractice, setAnswerClickedToPractice] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("noSelection");

  // Issue: when i click on try again, if the same quiz example came up after re-render, it would show as already clicked due to code : props.answerClicked == props.answer
  //  ? "#DFDFDF". In order to tackle it, this logic says, when try again is clicked
  //(indicatied by sumCorrect becoming 0) AND when value of submitted changes (in this case from true to false when try agian button is clicked)  only then should the code set all answers to no answer and prevent any highlight logic to take place.
  // Both conditons were needed, else didnt produced required result as can be seen if you tried to remove length==0 logic

  useEffect(() => {
    if (sumCorrect.length == 0) {
      setAnswerClicked("NoAnswer");
    }
  }, [submitted]);

  const checkAnswer = (isCorrect, answer) => {
    setAnswerClicked(answer);
    setAnswerClickedToPractice(true);

    if (isCorrect == true) {
      setAnswerColor("#DAF7A6");
      setSelectedAnswer(true);
      pushCorrectAnswer(props.exampleIndex);
      console.log(props.exampleIndex);
    } else {
      setAnswerColor("#ff726f");
      setSelectedAnswer(false);
      pushWrongAnswer(props.exampleIndex);
    }
  };

  function pushCorrectAnswer(index) {
    const newAnswerList = [...sumCorrect];
    newAnswerList[index] = 1;
    setSumCorrect(newAnswerList);
    console.log(sumCorrect);
  }

  function pushWrongAnswer(index) {
    const newAnswerList = [...sumCorrect];
    newAnswerList[index] = 0;
    setSumCorrect(newAnswerList);
    console.log(sumCorrect);
  }

  //Find lessontitle if lessonnumber is provided:
  function getSectionTitleByNumber(sectionNumber) {
    if (entryStore) {
      // Iterate through the topics
      for (const topic of entryStore) {
        // Iterate through the entries within each topic
        for (const entry of topic.entries) {
          // Iterate through the sections within each entry
          for (const section of entry.entries) {
            for (const lesson of section.entries) {
              if (lesson.sectionNumber === sectionNumber) {
                return lesson.title; // Return the corresponding title
              }
            }
            // Check if the sectionNumber matches
          }
        }
      }
    }

    // Return null if the sectionNumber was not found
    return null;
  }

  const sectionNumberToFind = props.example.sectionNumber; // Replace with the section number you want to find
  const sectionTitle = getSectionTitleByNumber(sectionNumberToFind);

  if (sectionTitle !== null) {
    console.log(`Section Title for ${sectionNumberToFind}: ${sectionTitle}`);
  } else {
    console.log(
      `Section with Section Number ${sectionNumberToFind} not found.`
    );
  }

  //End

  return (
    <ExampleBox className="LessonExampleBox">
      <ExampleQuestion>{props.example.question}</ExampleQuestion>
      {props.example &&
        props.example.answers.map((answerItem) => {
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
                submitted={submitted}
                sumCorrect={sumCorrect}
              >
                <div className="LessonExampleAnswer">{answerItem.answer}</div>
              </ExampleAnswer>
              {
                <AnswerExplanation
                  answerClicked={answerClicked}
                  answer={answerItem.answer}
                  answerColor={answerColor}
                  selectedAnswer={selectedAnswer}
                  submitted={submitted}
                >
                  {answerItem.isCorrect == false ? (
                    <div style={{ width: "90% " }}>
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
                      <motion.div
                        className="LessonExampleNextLessonBox"
                        style={{ marginTop: "0", marginBottom: "4vh" }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: [1, 1.03, 1] }}
                        transition={{
                          duration: 0.8,
                          delay: 0.3,
                          ease: [0, 0.71, 0.2, 1.01],
                        }}
                      >
                        <div style={{}} className="LessonTitleContainer">
                          <span className="LessonNumber">Revise Lesson</span>{" "}
                        </div>
                        <Link
                          to={`/${courseTitleUserIsOn}/lesson/${props.example.sectionNumber}`}
                        >
                          <motion.div
                            whileTap={{ scale: 0.8 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 17,
                            }}
                          >
                            <SideNavRowLesson
                              number={props.example.sectionNumber}
                              title={sectionTitle}
                              width="100%"
                              marginLeft="0"
                              borderRadius="14% 2% 2% 14% / 50% 10% 10% 50%"
                            ></SideNavRowLesson>
                          </motion.div>
                        </Link>
                      </motion.div>
                    </div>
                  ) : (
                    <>
                      <i class="correctCheckMark fa-solid fa-check"></i>

                      <p
                        className={`LessonExampleAnswerExplanation ${
                          isDarkMode ? "darkThemeFont" : "lightThemeFont"
                        }`}
                      >
                        Correct!
                      </p>
                    </>
                  )}
                </AnswerExplanation>
              }
            </>
          );
        })}
    </ExampleBox>
  );
};

export default QuizExample;
