import React, { useState, useContext, useEffect } from "react";
import {
  QuizState,
  ScoreContext,
  SubmitButtonContext,
} from "../Contexts/ScoreContext";
import styled, { css } from "styled-components";
// import { ButtonH2 } from "./Buttons";
import "./Quiz.css";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { allExampleData } from "./TopicData";
import { useLocation } from "react-router-dom";
import { useAmazonContext } from "../Contexts/AmazonContext";
import ConfettiExplosion from "react-confetti-explosion";
import SideNavRowLesson from "./sidebar/SideNavRowLesson";
import { motion } from "framer-motion";
import axios from "axios";
import api from "./api";
import ChapterProgressBar from "./ChapterProgressBar";
import Modal from "./Modal";

const ButtonH2 = styled.button`
  background: red;
  font-family: "Quicksand", sans-serif;
  padding: 7px 100px;
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

const ScoreCardBorder = styled.div`
  background: ${(props) =>
    props.scorePercentage == 100 ? "#f6ffe6" : "#e8c6c5"};
  font-size: 40px;
  white-space: pre-line;
  margin: 10px 30px;

  box-shadow: 10px 15px 15px rgba(0, 0, 0, 0.767);
  display: ${(props) =>
    props.submitted
      ? "flex"
      : "none"}; /* Display score card only when button is clicked, ie. when submitted state is true */
  flex-wrap: wrap;
  position: relative;
  align-items: center;
  justify-content: space-around;
  /* text-align: center; */
  flex-direction: column;
  font-family: "Quicksand", sans-serif;
  border-radius: 1rem;
  padding: 10px;
  /* padding-left: 60px; */
`;

const ScoreCardText = styled.p`
  font-size: 5vh;
  font-family: "Quicksand", sans-serif;
  text-align: center;
  font-weight: 900;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ScoreMessage = styled.div`
  font-size: 3vh;
  text-align: center;
  font-weight: 900;
  margin: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${(props) =>
    props.submitted && props.scorePercentage == 100
      ? css`
          shakeY 1s 1s
        `
      : props.submitted && props.scorePercentage < 100
      ? css`
          shakeX 1s 1s
        `
      : "none"};

  @media (max-width: 1200px) {
    flex-basis: 100%;
    margin-bottom: 20px;
  }
`;

const ScoreCardButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1200px) {
    flex-basis: 100%;
    margin-top: 30px;
  }
`;

const ScoreCard = (props) => {
  //Obtain Example Data from back end
  const { exampleDatafromBackEnd, courseTitleUserIsOn } = useAmazonContext();
  console.log(exampleDatafromBackEnd);

  const [sumCorrect, setSumCorrect] = useContext(ScoreContext);
  const [scoreCardColour, setScoreCardColour] = useState("#f8f8f8");
  const [chapterProgressData, setChapterProgressData] = useState(null); //Put it as state to ensure new data after fetch is sent to chapterProgressBar
  const [submitted, setSubmitted] = useContext(SubmitButtonContext);
  const location = useLocation(); //Props obtained from Router Link

  const sum = sumCorrect.reduce(function (a, b) {
    return a + b;
  }, 0);

  const scorePercentage = Math.round((sum / sumCorrect.length) * 100);

  const [chapterProgressPosted, setChapterProgressPosted] = useState(false);

  if (scorePercentage === 100 && !chapterProgressPosted) {
    (async function updateChapterProgress() {
      const userEmail = localStorage.getItem("userEmail");
      console.log(userEmail);
      console.log(courseTitleUserIsOn);
      console.log(props.topicNumber);

      // Prepare data to be sent to the backend for chapter progress
      const chapterProgressData = {
        userEmail: userEmail,
        chapterProgress: [
          {
            courseProgress: courseTitleUserIsOn,
            chapterProgress: [props.topicNumber],
          },
        ],
      };

      try {
        // Send chapter progress data to the backend
        await api.post("/insertChapterProgressRecord", chapterProgressData);
        console.log("Chapter progress data sent successfully!");
        setChapterProgressPosted(true); // Update state to indicate that data has been posted
      } catch (error) {
        console.error("Error sending chapter progress data:", error);
      }
    })();
  }

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

    if (chapterProgressPosted) {
      fetchChapterProgress(); // Fetch data only if chapter progress has been posted
    }
  }, [chapterProgressPosted]);

  let sectionID = props.goBackTo; //depricated, now using backToStudiesHashLinkPath
  let backToStudiesHashLinkPath =
    props.comingFrom == "Topic"
      ? `/${courseTitleUserIsOn}/topic/${props.topicNumber}`
      : props.comingFrom == "Section"
      ? `/${courseTitleUserIsOn}/topic/${props.topicNumber}#${props.sectionNumber}`
      : props.comingFrom == "ScoreCard" && props.sections.constructor == Array //Same logic as used in the quiz algorithm to figure out if it needs to go back to a topic or section
      ? `/${courseTitleUserIsOn}/topic/${props.topicNumber}`
      : props.comingFrom == "ScoreCard"
      ? `/${courseTitleUserIsOn}/topic/${props.topicNumber}#${location.state.sectionNumber}`
      : `/${courseTitleUserIsOn}/topic/${props.topicNumber}`;
  let morePracticeHashLinkPath =
    props.comingFrom == "Topic"
      ? `/${courseTitleUserIsOn}/quiz/${props.topicNumber}`
      : props.comingFrom == "Section"
      ? `/${courseTitleUserIsOn}/quiz/${props.topicNumber}/${props.sectionNumber}`
      : props.comingFrom == "ScoreCard" && props.sections.constructor == Array
      ? `/${courseTitleUserIsOn}/quiz/${props.topicNumber}`
      : props.comingFrom == "ScoreCard"
      ? `/${courseTitleUserIsOn}/quiz/${props.topicNumber}/${location.state.sectionNumber}`
      : `/${courseTitleUserIsOn}/quiz/${props.topicNumber}`;

  // if (scorePercentage == 100) {
  //   setScoreCardColour("#ff726f");
  // } else {
  //   setScoreCardColour("#DAF7A6");
  // }

  //Keeping the quiz ready if a user hits try again , same algorithm to find questions if coming from the Topic or a Section.

  // Randomiser function to create quiz for all topics

  const chooseRandom = (arr, num) => {
    const res = [];
    for (let i = 0; i < num; ) {
      const random = Math.floor(Math.random() * arr.length);
      if (res.includes(arr[random])) {
        continue;
      }
      res.push(arr[random]);
      i++;
    }
    return res;
  };

  // Number of questions display properties
  console.log(props.comingFrom);
  console.log(props.sections);
  console.log(props.topicNumber);
  console.log(props.sectionNumber);
  let needToDisplay = 5;
  let needtoSelect = Math.ceil(needToDisplay / props.sections.length);

  let selectedSectionExamples = []; //List of selected examples from each section
  let selectedSectionExamplesPool = []; //List of all selected examples from all sections
  let finalSetOfExamplesToDisplay = []; //final list of examples to display
  let finalExamplesOutput = []; //finalOutput of examples

  // Algorithm for obtaining questions from each section:
  if (props.comingFrom == "Topic") {
    props.sections.map((sectionNumber) => {
      //Mapping through the list of sections that from the Topic
      let allSectionExamples = exampleDatafromBackEnd.filter(
        //list of ALL examples for a particular section in the database
        (example) => example.sectionNumber == sectionNumber
      );
      if (allSectionExamples.length > needtoSelect) {
        selectedSectionExamples = chooseRandom(
          allSectionExamples,
          needtoSelect
        );
        selectedSectionExamplesPool.push.apply(
          selectedSectionExamplesPool,
          selectedSectionExamples
        );
      } else {
        selectedSectionExamplesPool.push.apply(
          selectedSectionExamplesPool,
          allSectionExamples
        );
      }
    });
    if (selectedSectionExamplesPool.length > needToDisplay) {
      finalSetOfExamplesToDisplay = chooseRandom(
        selectedSectionExamplesPool,
        needToDisplay
      );
      finalExamplesOutput = finalSetOfExamplesToDisplay;
    } else {
      finalSetOfExamplesToDisplay = selectedSectionExamplesPool;
      finalExamplesOutput = finalSetOfExamplesToDisplay;
    }
  } else if (props.comingFrom == "Section") {
    let allSectionExamples = exampleDatafromBackEnd.filter(
      (example) => example.sectionNumber == props.sections
    );
    if (allSectionExamples.length > needToDisplay) {
      selectedSectionExamples = chooseRandom(allSectionExamples, needToDisplay);
      finalExamplesOutput = selectedSectionExamples;
    } else {
      selectedSectionExamples = allSectionExamples;
      finalExamplesOutput = selectedSectionExamples;
    }
  } else if (props.comingFrom == "ScoreCard") {
    //If someone were to click Try Again from the score card, I was having a hard time trying to make the code determine which of the two logic above (Topic or Section) to run.
    //If the quiz is rerun by clicking try again from score card, i need to determine whether the quiz is Topic or Section. Because Topic and Section have their own logic of running the quiz randomniser, I know that if its coming from Topic it will be an array and if it is coming form sections it is a list therefore i will run my logic based on that
    if (props.sections.constructor == Array) {
      props.sections.map((sectionNumber) => {
        //Mapping through the list of sections that from the Topic
        let allSectionExamples = exampleDatafromBackEnd.filter(
          //list of ALL examples for a particular section in the database
          (example) => example.sectionNumber == sectionNumber
        );
        if (allSectionExamples.length > needtoSelect) {
          selectedSectionExamples = chooseRandom(
            allSectionExamples,
            needtoSelect
          );
          selectedSectionExamplesPool.push.apply(
            selectedSectionExamplesPool,
            selectedSectionExamples
          );
        } else {
          selectedSectionExamplesPool.push.apply(
            selectedSectionExamplesPool,
            allSectionExamples
          );
        }
      });
      if (selectedSectionExamplesPool.length > needToDisplay) {
        finalSetOfExamplesToDisplay = chooseRandom(
          selectedSectionExamplesPool,
          needToDisplay
        );
        finalExamplesOutput = finalSetOfExamplesToDisplay;
      } else {
        finalSetOfExamplesToDisplay = selectedSectionExamplesPool;
        finalExamplesOutput = finalSetOfExamplesToDisplay;
      }
    } else {
      let allSectionExamples = exampleDatafromBackEnd.filter(
        (example) => example.sectionNumber == props.sections
      );
      if (allSectionExamples.length > needToDisplay) {
        selectedSectionExamples = chooseRandom(
          allSectionExamples,
          needToDisplay
        );
        finalExamplesOutput = selectedSectionExamples;
      } else {
        selectedSectionExamples = allSectionExamples;
        finalExamplesOutput = selectedSectionExamples;
      }
    }
  }

  console.log(finalSetOfExamplesToDisplay);
  console.log(selectedSectionExamples);

  const restartQuiz = () => {
    setSubmitted(false);
    setSumCorrect([]);
  };

  // //When user changes quiz then set submitted back to false

  // useEffect(() => {
  //   setSubmitted(false);
  //   setSumCorrect([]);
  // }, [props.topicNumber]);

  // //End
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onSubmit: () => {},
  });
  const [responseId, setResponseId] = useState(null);

  const handleClick = async (response) => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      console.error("User email not found in localStorage");
      return;
    }

    const responseData = {
      userEmail: userEmail,
      response: response,
    };

    try {
      const res = await api.post("/insertUserResponse", responseData);
      console.log("User response sent successfully!");
      setResponseId(res.data.responseId); // Capture the response ID

      if (response === "yes") {
        setModalContent({
          title: "Thank You!",
          message:
            "Got it! I will send it to your email as soon as it is ready. Please provide your feedback.",
          onSubmit: (feedback) =>
            handleFeedbackSubmit(res.data.responseId, feedback),
        });
      } else {
        setModalContent({
          title: "We Value Your Feedback",
          message: "Please let us know why you decided not to purchase.",
          onSubmit: (feedback) =>
            handleFeedbackSubmit(res.data.responseId, feedback),
        });
      }
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error sending user response:", error);
    }
  };

  const handleFeedbackSubmit = async (responseId, feedback) => {
    if (!responseId) {
      console.error("Response ID not found");
      return;
    }

    const feedbackData = {
      feedback: feedback,
    };

    try {
      await axios.post(`/updateUserResponse/${responseId}`, feedbackData);
      console.log("User feedback sent successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error sending user feedback:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  return (
    <ScoreCardBorder submitted={submitted} scorePercentage={scorePercentage}>
      {scorePercentage === 100 ? (
        <ScoreMessage submitted={submitted} scorePercentage={scorePercentage}>
          <p
            style={{
              color: "green",
              display: "inline",
              fontSize: "50px",
              margin: "0 10px 0 0",
            }}
          >
            ✓
          </p>
          <p>Congratulations you got them all right!</p>
          {/* Update chapter progress when score is 100 */}
        </ScoreMessage>
      ) : (
        <ScoreMessage submitted={submitted} scorePercentage={scorePercentage}>
          <p
            style={{
              color: "#ff726f",
              display: "inline",
              fontSize: "50px",
              margin: "0 10px",
            }}
          >
            ✖
          </p>
          <p>Not quite there yet!</p>
        </ScoreMessage>
      )}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            fontSize: "3vh",
          }}
        >
          <p>Score</p>

          <ScoreCardText>
            {sum}/{sumCorrect.length}
          </ScoreCardText>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            fontSize: "3vh",
          }}
        >
          <p style={{ marginRight: "50px" }}>Percentage</p>

          <ScoreCardText>{scorePercentage}%</ScoreCardText>
        </div>
      </div>
      {scorePercentage == 100 &&
        props.nextChapterFirstLessonNumber !== false && (
          <motion.div
            className="LessonExampleNextLessonBox"
            style={{
              marginTop: "0",
              marginBottom: "4vh",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: [1, 1.03, 1] }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div style={{ width: "100%" }}>
              {" "}
              <ChapterProgressBar
                chapterNumber={props.chapterNumber}
                courseTitleUserIsOn={courseTitleUserIsOn}
                chapterProgressData={chapterProgressData}
              ></ChapterProgressBar>
            </div>

            <div
              style={{ marginLeft: "10%", width: "100%" }}
              className="LessonTitleContainerOnSideNav"
            >
              <div>
                <span className="LessonNumber">
                  Next Chapter {props.nextChapterNumber}
                </span>{" "}
              </div>

              <div style={{ fontSize: "2vh", textAlign: "center" }}>
                {" "}
                <span className="LessonTitle">{props.nextChapterTitle}</span>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <Link
                to={`/${courseTitleUserIsOn}/lesson/${props.nextChapterFirstLessonNumber}`}
              >
                <motion.div
                  whileTap={{ scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    width: "100%",
                    damping: 17,
                  }}
                >
                  <SideNavRowLesson
                    number={props.nextChapterFirstLessonNumber}
                    title={props.nextChapterFirstLessonTitle}
                    marginLeft="5%"
                    borderRadius="14% 2% 2% 14% / 50% 10% 10% 50%"
                  ></SideNavRowLesson>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      {scorePercentage == 100 &&
        props.nextChapterFirstLessonNumber == false && (
          <motion.div
            className="LessonExampleNextLessonBox"
            style={{
              marginTop: "0",
              marginBottom: "4vh",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: [1, 1.03, 1] }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <div style={{ width: "95%" }}>
              {" "}
              <ChapterProgressBar
                chapterNumber={props.chapterNumber}
                courseTitleUserIsOn={courseTitleUserIsOn}
                chapterProgressData={chapterProgressData}
              ></ChapterProgressBar>
            </div>
            <div
              style={{ textAlign: "center", width: "100%", margin: "0" }}
              className="LessonTitleContainer"
            >
              <span className="LessonNumber"></span> <br />
              <span className="LessonTitle"> The course ends here but...</span>
              <p style={{ fontSize: "2.5vh", color: "#8747d4" }}>
                Would you like to purchase the full course
                <br /> for a small fee of $5?
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <button
                    style={{
                      padding: "10px 20px",
                      margin: "10px",
                      border: "none",
                      borderRadius: "5px",
                      color: "white",
                      backgroundColor: "green",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("yes")}
                  >
                    Yes
                  </button>
                </motion.div>
                <motion.div
                  whileTap={{ scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <button
                    style={{
                      padding: "10px 20px",
                      margin: "10px",
                      border: "none",
                      borderRadius: "5px",
                      color: "white",
                      backgroundColor: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick("no")}
                  >
                    No
                  </button>
                </motion.div>
                <Modal
                  isVisible={isModalVisible}
                  onClose={handleCloseModal}
                  title={modalContent.title}
                  message={modalContent.message}
                  onSubmit={modalContent.onSubmit}
                />
              </div>
            </div>
          </motion.div>
        )}
      {scorePercentage !== 100 && (
        <ScoreCardButtons>
          <Link
            to={{
              pathname: morePracticeHashLinkPath,
              state: {
                comingFrom: "ScoreCard",
                sections: props.sections,
                scoreCardSelectedQuizQuestons: finalExamplesOutput,
                sectionNumber: props.sectionNumber, //Retains the section number to pass where needed
              },
            }}
          >
            <ButtonH2 style={{ marginBottom: 20 }} onClick={restartQuiz}>
              Try Again
            </ButtonH2>
          </Link>

          {/* <HashLink to={backToStudiesHashLinkPath}>
          <ButtonH2>Back to Studies</ButtonH2>
        </HashLink> */}
        </ScoreCardButtons>
      )}
    </ScoreCardBorder>
  );
};

export default ScoreCard;
