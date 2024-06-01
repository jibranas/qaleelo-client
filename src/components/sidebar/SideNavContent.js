import React, { useState, useEffect } from "react";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import SideNavRow from "./SideNavRow";
import styled from "styled-components";
import DropDown from "./DropDown";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import CourseProgressBar from "./CourseProgressBar";
import SideNavRowLesson from "./SideNavRowLesson";
import SideNavRowQuiz from "./SideNavRowQuiz";
import { motion } from "framer-motion";

const CourseContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%; /* Ensure the div takes full height */
`;

const SearchBarContainer = styled.div`
  position: relative;
  width: 60%;
  /* max-width: 700px; */
  /* margin: 50px; */
  margin-right: 50px;
`;

const SearchBar = styled.input`
  width: 100%;
  height: 80px;
  padding: 10px;
  padding-left: 70px;
  font-family: "Quicksand", sans-serif;
  font-size: 3vh;
  margin-left: 29%;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  font-size: 2vh;
  margin-left: 20%;
`;

export default function SideNavContent(props) {
  const {
    courseDetails,
    courseTitleUserIsOn,
    entryStore,
    isDarkMode,
    setIsDarkMode,
    setNavOpen,
  } = useAmazonContext();
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [filteredEntries, setFilteredEntries] = useState([]); // State for filtered entries

  // Filter the entries based on the search term
  useEffect(() => {
    if (entryStore && searchTerm) {
      const filtered = entryStore
        .map((entry) => {
          const filteredSubEntries = entry.entries.filter((subEntry) => {
            const subEntryMatches = subEntry.title
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            const nestedEntryMatches =
              subEntry.entries &&
              subEntry.entries.some((nestedEntry) =>
                nestedEntry.entries.some(
                  (section) =>
                    section.title &&
                    section.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
              );
            return subEntryMatches || nestedEntryMatches;
          });
          return { ...entry, entries: filteredSubEntries };
        })
        .filter((entry) => entry.entries.length > 0);
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entryStore);
    }
  }, [entryStore, searchTerm]);

  console.log(entryStore);
  console.log(entryStore, courseTitleUserIsOn);
  const [dropDownEntries, setDropDownEntries] = useState(null);

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
  let currentTopicNumber = topicAndSectionArray[0];
  let currentSectionNumber = topicAndSectionArray[1];
  console.log(currentTopicNumber);

  console.log("progressData:", props.progressData);
  console.log("chapterProgressData:", props.chapterProgressData);
  console.log(
    "simplifiedChaptersLessonsData:",
    props.simplifiedChaptersLessonsData
  );
  console.log("unlockedLessons:", props.unlockedLessons);
  console.log("unlockedChapters:", props.unlockedChapters);
  console.log("unlockedQuizzes:", props.unlockedQuizzes);
  console.log("isLastLessonOfChapter:", props.isLastLessonOfChapter);
  console.log("isFirstLessonOfChapter:", props.isFirstLessonOfChapter);
  console.log(
    "chapterOfLastCompletedLesson:",
    props.chapterOfLastCompletedLesson
  );
  console.log("lastUnlockedLessonNumber:", props.lastUnlockedLessonNumber);
  console.log("lastUnlockedLessonTitle:", props.lastUnlockedLessonTitle);

  return (
    <div
      className={`sideNavContainer ${isDarkMode ? "dark" : "light"}`}
      style={
        props.state === "exiting"
          ? { animation: "moveMainContainer .3s forwards" }
          : props.state === "entering"
          ? { animation: "moveMainContainer .3s reverse backwards" }
          : null
      }
    >
      <div
        className="sidenavHeader"
        style={{
          background: "#8747d4",
          position: "sticky",
          top: "0",
          zIndex: "2000",
        }}
      >
        {courseDetails.courseTitle && (
          <img
            className="courseSideNavImage"
            src={
              "https://qaleelo-assets.s3.us-east-2.amazonaws.com/" +
              courseDetails.courseTitle.replace(/\s/g, "") +
              "/courseImage/" +
              courseDetails.courseTitle.replace(/\s/g, "") +
              ".png"
            }
            alt=""
          ></img>
        )}

        <CourseProgressBar
          progressData={props.progressData}
          chapterProgressData={props.chapterProgressData}
          simplifiedChaptersLessonsData={props.simplifiedChaptersLessonsData}
          courseTitleUserIsOn={courseTitleUserIsOn}
        ></CourseProgressBar>
        {props.isLessonProgressEmpty == null ? (
          <div></div>
        ) : props.isLastLessonOfChapter && !props.isFirstLessonOfChapter ? (
          <div className="ContinueSideNavContainer">
            <div style={{}} className="LessonTitleContainer">
              <span className="LessonNumber" style={{ color: "#80e8a2" }}>
                Continue
              </span>{" "}
            </div>{" "}
            <Link
              to={`/${courseTitleUserIsOn}/quiz/${props.chapterOfLastCompletedLesson.chapterNumber}`}
            >
              <motion.div
                onClick={
                  props.closeNav ? props.closeNav : () => setNavOpen(false)
                }
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <SideNavRowQuiz
                    number={props.chapterOfLastCompletedLesson.chapterNumber}
                    title={props.chapterOfLastCompletedLesson.chapterTitle}
                    width="90%"
                    marginLeft="5%"
                  ></SideNavRowQuiz>
                </motion.div>
              </motion.div>
            </Link>
          </div>
        ) : (
          <div>
            <div style={{}} className="LessonTitleContainer">
              <span className="LessonNumber" style={{ color: "#80e8a2" }}>
                Continue
              </span>{" "}
            </div>
            <Link
              to={`/${courseTitleUserIsOn}/lesson/${props.lastUnlockedLessonNumber}`}
            >
              <motion.div
                onClick={
                  props.closeNav ? props.closeNav : () => setNavOpen(false)
                }
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <SideNavRowLesson
                    backgroundColor="white"
                    number={props.lastUnlockedLessonNumber}
                    title={props.lastUnlockedLessonTitle}
                    width="90%"
                    marginLeft="5%"
                    borderRadius="14% 2% 2% 14% / 50% 10% 10% 50%"
                  ></SideNavRowLesson>
                </motion.div>
              </motion.div>
            </Link>
          </div>
        )}
      </div>
      <div className="sideNavContentsContainer">
        <div className="sideNavChapterHeader">
          <p>Chapters</p>
        </div>
        {filteredEntries &&
          filteredEntries.map((entry, index) => {
            return (
              <div className="sidenavContentChapter">
                <div className="sidenavContentHeaderMainMenu">
                  {entry.topicHeaderNumber && entry.topicHeaderNumber}: &nbsp;
                  {entry.title}
                </div>
                {entry.entries.map((subEntry, index) => {
                  return (
                    <>
                      <SideNavRow
                        number={subEntry.topicNumber}
                        title={subEntry.title}
                        entries={subEntry.entries}
                        styleVariable={
                          subEntry.topicNumber == currentTopicNumber
                            ? { background: "#dfdfdf" }
                            : {}
                        }
                        lockState={
                          props.unlockedChapters &&
                          props.unlockedChapters.includes(subEntry.topicNumber)
                            ? "unlocked"
                            : "locked"
                        }
                      />
                    </>
                  );
                })}
              </div>
            );
          })}
        <div style={{ minHeight: "400px" }}></div>
      </div>
    </div>
  );
}
