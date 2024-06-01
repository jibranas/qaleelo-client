import React, { useState, useEffect } from "react";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import QuizSideNavRow from "./QuizSideNavRow";
import styled from "styled-components";
import QuizDropDown from "./QuizDropDown";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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
  width: 100%;
  max-width: 700px;
  margin-bottom: 20px;
  margin-right: 50px;
`;

const SearchBar = styled.input`
  width: 100%;
  height: 80px;
  padding: 10px;
  padding-left: 70px;
  font-family: "Quicksand", sans-serif;
  font-size: 3vh;

  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  font-size: 3vh;
`;

export default function QuizSideNavContent(props) {
  const { courseTitleUserIsOn, entryStore } = useAmazonContext();
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

  return (
    <div
      className="sideNavContainer"
      style={
        props.state === "exiting"
          ? { animation: "QuizmoveMainContainer .3s forwards" }
          : props.state === "entering"
          ? { animation: "QuizmoveMainContainer .3s reverse backwards" }
          : null
      }
    >
      <SearchBarContainer>
        <SearchIcon>
          <FontAwesomeIcon icon={faSearch} />
        </SearchIcon>
        <SearchBar
          type="text"
          placeholder="Search for a Topic"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        ></SearchBar>
      </SearchBarContainer>
      {filteredEntries &&
        filteredEntries.map((entry, index) => {
          return (
            <div>
              <div className="sidenavContentHeaderMainMenu">
                {entry.topicHeaderNumber && entry.topicHeaderNumber}
                &nbsp; &nbsp;
                {entry.title}
              </div>
              {entry.entries.map((subEntry, index) => {
                return (
                  <div>
                    {/* Renable below when ready for section quiz */}
                    {/* {subEntry.rows ? (
                      <QuizSideNavRow
                        number={subEntry.topicNumber}
                        title={subEntry.title}
                        entries={subEntry.entries}
                        styleVariable={
                          subEntry.topicNumber == currentTopicNumber
                            ? { background: "#ebebeb" }
                            : {}
                        }
                      />
                    ) : (
                      <Link
                        to={`/${courseTitleUserIsOn}/quiz/${subEntry.topicNumber}`}
                      >
                        <div
                          className="sidenavContent"
                          onClick={props.closeNav}
                          style={
                            subEntry.topicNumber == currentTopicNumber
                              ? { background: "#ebebeb" }
                              : {}
                          }
                        >
                          {subEntry.topicNumber && subEntry.topicNumber}
                          &nbsp; &nbsp;
                          {subEntry.title}
                        </div>
                      </Link>
                    )} */}

                    <Link
                      to={`/${courseTitleUserIsOn}/quiz/${subEntry.topicNumber}`}
                    >
                      <div
                        className="sidenavContent"
                        onClick={props.closeNav}
                        style={
                          subEntry.topicNumber == currentTopicNumber
                            ? { background: "#dfdfdf" }
                            : {}
                        }
                      >
                        {subEntry.topicNumber && subEntry.topicNumber}
                        &nbsp; &nbsp;
                        {subEntry.title}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          );
        })}
      <div style={{ minHeight: "60px" }}></div>
    </div>
  );
}
