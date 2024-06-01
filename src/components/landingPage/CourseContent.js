import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import CourseIcon from "./CourseIcon";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import CourseContentRow from "./CourseConentRow";
import axios from "axios";

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
  margin-right: 90px;
`;

const SearchBar = styled.input`
  width: 100%;
  height: 80px;
  padding: 10px;
  padding-left: 100px;
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

function CourseContent() {
  const { courseTitleUserIsOn, courseDetails, entryStore } = useAmazonContext();
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

  return (
    <div className="courseContent">
      <CourseContentWrapper>
        <div className="courseContentHeader">Course Content</div>
        <SearchBarContainer>
          <SearchBar
            type="text"
            placeholder="Search for a topic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon>
            <FontAwesomeIcon icon={faSearch} />
          </SearchIcon>
        </SearchBarContainer>
      </CourseContentWrapper>
      {filteredEntries &&
        filteredEntries.map((entry, index) => {
          return (
            <div key={index}>
              <div className="sidenavContentHeaderMainMenuCC">
                {entry.title}
              </div>
              {entry.entries.map((subEntry, index) => {
                return (
                  <div key={index}>
                    <CourseContentRow topic={subEntry}></CourseContentRow>
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}

export default CourseContent;
