import React, { useState, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import TopicData, { allExampleData } from "./TopicData";
import QuizExample from "./QuizExample";
import ScoreCard from "./ScoreCard";
import { ScoreContext, SubmitButtonContext } from "../Contexts/ScoreContext";
import { ButtonH1 } from "./Buttons";
import styled from "styled-components";
import { useAmazonContext } from "../Contexts/AmazonContext";
import axios from "axios";
import api from "./api";
import QuizMainSideNav from "./quiz sidebar/QuizMainSideNav";
import { Link } from "react-router-dom";
import LessonMainSideNav from "./sidebar/LessonMainSideNav";
import ConfettiExplosion from "react-confetti-explosion";

const QuizTitle = styled.p`
  color: #eb8381;
  /* font-size: 3vh; */
  font-family: "Quicksand", sans-serif;
  justify-content: center;
  text-align: center;
  /* margin: 30px 30px; */
  display: flex;

  /* justify-content: space-between; */
`;

const CenteredButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StudyModeButton = styled.button`
  background: red;
  font-family: "Quicksand", sans-serif;
  padding: 7px 12px;
  margin: 20px;
  text-transform: uppercase;
  /* font-size: 15px; */
  font-size: 3vh;
  overflow: hidden;
  border: 0;
  border-radius: 5px;
  background: #eb3535;
  color: white;
  transition: all 0.25s ease;
  cursor: pointer;

  &:active {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    background: #f2b1ae;
  }
`;

const SubmitButton = styled.button`
  background: red;
  font-family: "Quicksand", sans-serif;
  padding: 7px 12px;
  text-transform: uppercase;
  font-size: 3vh;
  overflow: hidden;
  border: 0;
  border-radius: 5px;
  background: #8747d4;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.25s ease;
  cursor: pointer;

  &:active {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    background: #f2b1ae;
  }
`;

const ButtonH2 = styled.button`
  background: red;
  font-family: "Quicksand", sans-serif;
  padding: 7px 12px;
  margin-right: "20px";
  text-transform: uppercase;
  /* font-size: 15px; */
  font-size: 2vh;
  overflow: hidden;
  border: 0;
  border-radius: 5px;
  background: #e8e2ef;
  color: #252525;
  transition: all 0.25s ease;
  cursor: pointer;

  &:active {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    background: #e8e2ef;
  }
`;

const TopicTitle = styled.div`
  color: #9589be;
  /* font-size: 1rem; */
  /* font-size: clamp(4vh, 30px, 30px); */
  /* font-size: min(2rem, 4vh); */
  font-size: 4vh;
  display: block;
  margin: 30px;
  font-family: "Quicksand", sans-serif;

  /* @media (max-width: 40em) {
    font-size: 5vh;
  } */

  /* justify-content: space-between; */
`;

const Quiz = (props) => {
  //set the courseTitle for whatever course the User is on here as well as course landing page in case a user is lands onto a topic page directly
  let {
    courseTitleUserIsOn,
    setCourseTitleUserIsOn,
    courseDetails,
    setCourseDetails,
    entryStore,
    setEntryStore,
    setSubContainerEntries,
    setSubContainer,
    navOpen,
  } = useAmazonContext();

  console.log(courseDetails);
  useEffect(() => {
    setCourseTitleUserIsOn(props.match.params.courseTitle);
  }, []);
  console.log(courseTitleUserIsOn);
  console.log(props.match.params.courseTitle);

  console.log(courseDetails);

  const [submitted, setSubmitted] = useState(false);
  const [sumCorrect, setSumCorrect] = useState([]);
  const [whereDidIComeFrom, setWhereDidIComeFrom] = useState("none");
  const location = useLocation(); //Props obtained from Router Link

  const checkSubmission = () => setSubmitted(true);

  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [submitted]);

  // console.log(sumCorrect);

  console.log(whereDidIComeFrom);
  console.log(location);
  console.log(location.state);
  // console.log(location.state.comingFrom);

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

  //Topic to be displayed
  console.log(props.match);
  console.log(props.match.params.topicNumber);

  let topicNumberFromSideBar = props.match.params.topicNumber;
  console.log(topicNumberFromSideBar);
  console.log(courseDetails);
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
  }, [courseDetails]);

  // let { exampleDatafromBackEnd } = useAmazonContext();
  console.log(exampleDatafromBackEnd);

  // // Finding quiz questions algorithm starts here

  //Topic Data from BackEnd
  const [selectedTopic, setSelectedTopic] = useState([]);

  console.log(courseTitleUserIsOn);

  //Set the selected topic
  useEffect(() => {
    api
      .get(
        `/${courseTitleUserIsOn}/topicRESTCAll/${topicNumberFromSideBar}?collectionName=${courseDetails.courseTopicsCollectionName}&modelName=${courseDetails.courseTopicsModelName}`
      )
      .then((response) => {
        setSelectedTopic(response.data);
        console.log(response.data);
      });
  }, [topicNumberFromSideBar, courseDetails]);

  // let selectedTopic = topicDatafromBackEnd.find(
  //   (o) => o.topicNumber === topicNumberFromSideBar
  // );

  console.log(selectedTopic);
  //End

  //This use Effect is needed incase someone lands onto the topic page first, (we are loading sidebar data on the landing page, but need it for the topic page too)
  useEffect(() => {
    api
      .get(
        `/${courseTitleUserIsOn}/sideBarData?collectionName=${courseDetails.courseTopicsCollectionName}&modelName=${courseDetails.courseTopicsModelName}`
      )
      .then((response) => {
        setEntryStore(response.data);
        console.log(response.data);
      });
  }, [selectedTopic.topicNumber]);
  console.log(entryStore);

  //Logic to open the Chapter Lessons Menu subentry (on the subcontainer in the side bar) related to the lesson the user is on

  console.log(entryStore);
  useEffect(() => {
    let nextSectionNumber = null;
    let nextSectionTitle = null;
    let foundCurrentSection = false;
    // Example usage:
    const currentChapterNumber = selectedTopic.topicNumber;

    if (entryStore) {
      //Needed to wait for entryStore to load
      // Iterate through the entryStore data
      for (const topic of entryStore) {
        for (const entry of topic.entries) {
          for (const subEntry of entry.entries) {
            // Check if the section number matches the currentSectionNumber
            if (subEntry.topicNumber === currentChapterNumber) {
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
    }
  }, [navOpen, courseDetails, selectedTopic]);

  //End

  //function to find next chapter number and title along with the first lesson in that chapter
  //Start
  function findNextTopic(currentTopicNumber) {
    let foundCurrentTopic = false;

    if (entryStore) {
      // Iterate through the entryStore data
      for (const topicHeader of entryStore) {
        for (const topic of topicHeader.entries) {
          // Check if the topic number matches the currentTopicNumber
          if (topic.topicNumber === currentTopicNumber) {
            foundCurrentTopic = true;
            console.log(currentTopicNumber);

            // Find the index of the current topic in the topicHeader
            const currentIndex = topicHeader.entries.findIndex(
              (topic) => topic.topicNumber === currentTopicNumber
            );
            console.log(currentIndex);

            // Find the index of the current topicHeader

            console.log(topicHeader.title);

            const currentTopicHeaderIndex = entryStore.findIndex(
              (entry) =>
                entry.topicHeaderNumber ===
                String(Math.floor(parseFloat(currentTopicNumber)))
            );
            console.log(entryStore);
            console.log(Math.floor(parseFloat(currentTopicNumber)));
            console.log(topicHeader.topicHeaderNumber, currentTopicHeaderIndex);

            // If the current topic is not the last one in the entry
            if (currentIndex !== topicHeader.entries.length - 1) {
              // Get the next topic's data
              const nextTopic = topicHeader.entries[currentIndex + 1];
              return nextTopic;
            } else if (currentIndex == topicHeader.entries.length - 1) {
              // Get the next topicHeaders first chapter
              if (currentTopicHeaderIndex !== entryStore.length - 1) {
                const nextTopic =
                  entryStore[currentTopicHeaderIndex + 1].entries[0];
                return nextTopic;
              }
            }
            break;
          }
        }
        if (foundCurrentTopic) break;
      }
    }

    if (!foundCurrentTopic) {
      console.log("Current topic not found.");
    }

    return null;
  }

  // Example usage:
  const currentTopicNumber = topicNumberFromSideBar; // Assuming this is the last topic
  const nextTopic = findNextTopic(currentTopicNumber, entryStore);

  var nextChapterTitle = "";
  var nextChapterNumber = "";
  var nextChapterFirstLessonNumber = "";
  var nextChapterFirstLessonTitle = "";

  if (nextTopic) {
    console.log("Next Chapter Number:", nextTopic.entries[0].topicNumber);
    console.log("Next Chapter Title:", nextTopic.entries[0].title);
    console.log(
      "Next Chapter First Lesson Number:",
      nextTopic.entries[0].entries[0].sectionNumber
    );
    console.log(
      "Next Chapter First Lesson Title:",
      nextTopic.entries[0].entries[0].title
    );

    nextChapterNumber = nextTopic.entries[0].topicNumber;
    nextChapterTitle = nextTopic.entries[0].title;
    nextChapterFirstLessonNumber =
      nextTopic.entries[0].entries[0].sectionNumber;
    nextChapterFirstLessonTitle = nextTopic.entries[0].entries[0].title;
  } else {
    console.log("No next topic.");
    nextChapterNumber = false;
    nextChapterTitle = false;
    nextChapterFirstLessonNumber = false;
    nextChapterFirstLessonTitle = false;
  }

  //End

  const [topicNumbersListfromBackEnd, setTopicNumbersListfromBackEnd] =
    useState([]);
  useEffect(() => {
    api
      .get(
        `/${courseTitleUserIsOn}/topicNumbersList?collectionName=${courseDetails.courseTopicsCollectionName}&modelName=${courseDetails.courseTopicsModelName}`
      )
      .then((response) => {
        setTopicNumbersListfromBackEnd(response.data);
        console.log(response.data);
      });
  }, [selectedTopic.topicNumber]);
  console.log(topicNumbersListfromBackEnd);

  const sectionList = []; //Creates a list of all the sectionNumbers on this topic
  selectedTopic.sections &&
    selectedTopic.sections.map((section) => {
      return sectionList.push(section.sectionNumber);
    });

  console.log(sectionList);

  // Number of questions display properties

  let needToDisplay = 100;
  let needtoSelect = Math.ceil(needToDisplay / sectionList.length);
  console.log(needtoSelect);

  let selectedSectionExamples = []; //List of selected examples from each section
  let selectedSectionExamplesPool = []; //List of all selected examples from all sections
  let newselectedSectionExamplesPool = []; //Needed this to use the concat logic because concat requires you to store the concatenation into a new variable
  let finalSetOfExamplesToDisplay = []; //final list of examples to display

  // Algorithm for obtaining questions from each section:

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

  sectionList.map((sectionNumber) => {
    //Mapping through the list of sections that from the Topic
    let allSectionExamples =
      exampleDatafromBackEnd &&
      exampleDatafromBackEnd.length !== 0 &&
      exampleDatafromBackEnd.filter(
        //list of ALL examples for a particular section in the database
        (example) => example.sectionNumber == sectionNumber
      );
    console.log(allSectionExamples);
    if (allSectionExamples.length > needtoSelect) {
      selectedSectionExamples = chooseRandom(allSectionExamples, needtoSelect);
      console.log(selectedSectionExamples);
      newselectedSectionExamplesPool = selectedSectionExamplesPool.concat(
        newselectedSectionExamplesPool,
        selectedSectionExamples
      );
    } else {
      newselectedSectionExamplesPool = selectedSectionExamplesPool.concat(
        newselectedSectionExamplesPool,
        allSectionExamples
      );
    }
    console.log(selectedSectionExamplesPool);
    console.log(newselectedSectionExamplesPool);
  });
  console.log(selectedSectionExamplesPool);
  console.log(newselectedSectionExamplesPool);
  if (newselectedSectionExamplesPool.length > needToDisplay) {
    finalSetOfExamplesToDisplay = chooseRandom(
      newselectedSectionExamplesPool,
      needToDisplay
    );
  } else {
    finalSetOfExamplesToDisplay = newselectedSectionExamplesPool;
  }

  console.log(finalSetOfExamplesToDisplay);

  // let selectedQuizQuestions = [];

  // // if (location.state.comingFrom == "Topic") {
  // //   selectedQuizQuestions = location.state.topicSelectedQuizQuestions;
  // // } else if (location.state.comingFrom == "Section") {
  // //   selectedQuizQuestions = location.state.sectionSelectedQuizQuestions;
  // // } else if (location.state.comingFrom == "ScoreCard") {
  // //   selectedQuizQuestions = location.state.scoreCardSelectedQuizQuestons;
  // // }

  // console.log(selectedQuizQuestions);

  // //When user changes quiz then set submitted back to false

  useEffect(() => {
    setSubmitted(false);
    setSumCorrect([]);
  }, [selectedTopic.topicNumber]);

  //End

  const sum = sumCorrect.reduce(function (a, b) {
    return a + b;
  }, 0);

  const scorePercentage = Math.round((sum / sumCorrect.length) * 100);

  return (
    <ScoreContext.Provider value={[sumCorrect, setSumCorrect]}>
      <SubmitButtonContext.Provider value={[submitted, setSubmitted]}>
        <>
          <LessonMainSideNav></LessonMainSideNav>
          <div className="Quiz">
            <div className="QuizContainer">
              <div style={{}} className="LessonTitleContainer">
                <span className="LessonNumber">
                  Chapter Quiz {selectedTopic.topicNumber}
                </span>{" "}
                <br />
                <span className="LessonTitle">{selectedTopic.topicTitle}</span>
                <div
                  className="confettiContainer"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {submitted && scorePercentage == 100 && (
                    <ConfettiExplosion
                      height={"1000vh"}
                      particleSize={30}
                      autoStart={true}
                      duration={5000}
                      particleCount={350}
                      spread={360}
                      origin={{ x: 0.8, y: 0.5 }}
                      force={0.8}
                      width={1600}
                    />
                  )}
                </div>
              </div>
              {/* <CenteredButtonContainer>
            <Link
              to={`/${courseTitleUserIsOn}/topic/` + selectedTopic.topicNumber}
            >
              <StudyModeButton>
                <p style={{ fontSize: "2vh", margin: "0px" }}>Switch to</p>
                <b>Study Mode</b>
              </StudyModeButton>
            </Link>
          </CenteredButtonContainer> */}
              {submitted ? (
                <ScoreCard
                  // goBackTo={
                  //   location.state.comingFrom == "Topic"
                  //     ? "Topic"
                  //     : location.state.section
                  // } //Used to send section to HashLink
                  sections={
                    location.state
                      ? location.state.comingFrom == "Topic"
                        ? location.state.sectionList
                        : location.state.comingFrom == "Section"
                        ? location.state.section
                        : location.state.comingFrom == "ScoreCard"
                        ? location.state.sections
                        : "none"
                      : sectionList
                  }
                  comingFrom={
                    location.state &&
                    (location.state.comingFrom == "Topic"
                      ? "Topic"
                      : location.state.comingFrom == "Section"
                      ? "Section"
                      : location.state.comingFrom == "ScoreCard"
                      ? "ScoreCard"
                      : "none")
                  }
                  whereDidIComeFrom={whereDidIComeFrom}
                  topicNumber={props.match.params.topicNumber}
                  sectionNumber={
                    location.state &&
                    (location.state.comingFrom == "Section"
                      ? location.state.section
                      : location.state.comingFrom == "ScoreCard"
                      ? location.state.sectionNumber
                      : "none")
                  }
                  nextChapterNumber={nextChapterNumber}
                  nextChapterTitle={nextChapterTitle}
                  nextChapterFirstLessonNumber={nextChapterFirstLessonNumber}
                  nextChapterFirstLessonTitle={nextChapterFirstLessonTitle}
                  chapterNumber={selectedTopic.topicNumber}
                ></ScoreCard>
              ) : (
                <QuizTitle></QuizTitle>
              )}

              {finalSetOfExamplesToDisplay.map((example, index) => {
                return (
                  <div key={index}>
                    <QuizExample
                      topicNumber={props.match.params.topicNumber} //Passed from the 'Link' id substitute which is the topicNumber obtained from the Sidebar
                      example={example}
                      exampleIndex={index}
                    ></QuizExample>
                    {index !== finalSetOfExamplesToDisplay.length - 1 ? (
                      <hr
                        style={{
                          width: "70%",
                          backgroundColor: "#9589be",
                          height: 2,
                          borderRadius: 20,
                          border: 0,
                          marginTop: "10%",
                          marginBottom: "10%",
                        }}
                      ></hr>
                    ) : (
                      <div
                        style={{
                          marginTop: "10%",
                          marginBottom: "30%",
                        }}
                      ></div>
                    )}
                  </div>
                );
              })}
              {sumCorrect.includes(undefined) == false && //When User has clicked all answers, show button, list of answers should not contain undefined
              sumCorrect.length == finalSetOfExamplesToDisplay.length &&
              submitted == false ? ( //Button will dissappear when submitted == true
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "100px",
                    position: "fixed",
                    bottom: "0px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <SubmitButton onClick={checkSubmission}>
                    <b>Submit</b>
                  </SubmitButton>
                </div>
              ) : null}
            </div>
          </div>
        </>
      </SubmitButtonContext.Provider>
    </ScoreContext.Provider>
  );
};

export default Quiz;
