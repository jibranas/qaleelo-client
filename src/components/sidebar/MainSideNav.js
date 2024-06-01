import React, { useEffect } from "react";
import HHLogo from "./HHLogo.png";
import HamburgerButton from "./HamburgerButton";
import styled, { keyframes, css } from "styled-components";
import Sidenav from "./Sidenav";
import BackgroundPage from "./BackgroundPage";
import { useState } from "react";
import { Transition, TransitionGroup } from "react-transition-group";
import {
  AmazonContextProvider,
  useAmazonContext,
} from "../../Contexts/AmazonContext";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Navbar = styled.nav`
  background: #eb8381;
  /* top: 80; */
  height: 6vh;
  transform: translateY(${(props) => props.navTop + "vh"});
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
`;

const QuizMeButton = styled.button`
  font-family: "Quicksand", sans-serif;
  padding: 7px 12px;
  /* margin: 20px; */
  text-transform: uppercase;
  /* font-size: 15px; */
  font-size: 2.5vh;
  overflow: hidden;
  border: 0;
  border-radius: 5px;
  background: #8747d4;
  color: white;
  transition: all 0.25s ease;
  cursor: pointer;
  height: 6vh;

  &:active {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    background: #f2b1ae;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 6vh; /* Adjust the width as needed */
  height: 6vh; /* Adjust the height as needed */
  margin-left: 70px; /* Adjust the margin as needed */
`;

const ButtonH2 = styled.button`
  background: red;
  position: relative;
  font-family: "Quicksand", sans-serif;
  padding: 7px 12px;
  text-transform: uppercase;
  /* font-size: 15px; */
  font-size: 4vh;
  font-weight: bold;
  overflow: hidden;
  border: 0;
  border-radius: 5px;
  background: #eb3535;
  color: #f8f6f0;
  height: 6vh;

  transition: all 0.25s ease;
  cursor: pointer;
  margin-right: 20px;

  &:active {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    background: #f2b1ae;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-family: "Quicksand", sans-serif;
  font-size: 1.5vh;
  font-weight: bold;
  color: #f8f6f0;
  cursor: pointer;
  outline: none;
  position: relative;
  padding: 0;
  margin: 0;
  width: 70px;
  height: 35px;
  background-color: #bbb;
  border-radius: 35px;
  transition: background-color 0.3s;

  &:after {
    content: "";
    position: absolute;
    top: 2.5px;
    left: 2.5px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: white;
    transition: left 0.3s;
  }

  &.study {
    background-color: #eb8381;
    &:after {
      left: 37.5px;
    }
  }
`;

export default function MainSideNav(props) {
  const [topicNumbersListfromBackEnd, setTopicNumbersListfromBackEnd] =
    useState([]);
  // const [entryStore, setEntryStore] = useState([]);
  const {
    courseTitleUserIsOn,
    entryStore,
    setEntryStore,
    courseDetails,
    setSubContainerEntries,
    subContainer,
    setSubContainer,
    rowClicked,
    setRowClicked,
    navOpen,
    setNavOpen,
  } = useAmazonContext();
  console.log(courseTitleUserIsOn, courseDetails, entryStore);
  useEffect(() => {
    api
      .get(
        `/${courseTitleUserIsOn}/topicNumbersList?collectionName=${courseDetails.courseTopicsCollectionName}&modelName=${courseDetails.courseTopicsModelName}`
      )
      .then((response) => {
        setTopicNumbersListfromBackEnd(response.data);
        console.log(response.data);
      });
  }, [courseTitleUserIsOn]);
  console.log(topicNumbersListfromBackEnd);
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
  }, [courseTitleUserIsOn]);
  console.log(entryStore);

  const [currentUrlState, setCurrentUrlState] = useState("0");
  const [currentTopicNumberState, setCurrentTopicNumberState] = useState("0");
  const [nextTopicNumberState, setNextTopicNumberState] = useState("0");
  const [previousTopicNumberState, setPreviousTopicNumberState] = useState("0");

  //Code for nav to hide scroll down and show on scroll up
  const [navTop, setNavTop] = useState(0);
  var lastScrollY = window.scrollY;
  window.addEventListener("scroll", function () {
    if (lastScrollY < window.scrollY) {
      setNavTop(-6); //needs to be same as Nav Height defined above
    } else {
      setNavTop(0);
    }
    lastScrollY = window.scrollY;
  });
  //End

  const openNav = () => {
    setNavOpen(true);
  };

  const closeNav = () => {
    setNavOpen(false);
  };

  //Logic for next and previous buttons
  console.log(topicNumbersListfromBackEnd);
  // Step 0.1 I needed this for this component to re-render any time the currentUrl changed, so that re-render would run the useEffect below:
  const setCurrentUrl = () => {
    var currentUrl = window.location.href;
    setCurrentUrlState(currentUrl);
    console.log(currentUrl);

    if (entryStore) {
      entryStore.forEach(function (entry) {
        entry.entries.forEach(function (subEntry) {
          if (
            subEntry.topicNumber == nextTopicNumberState && //this is wried that the nextTopicNumberState needed to be matched against instead of current, but looks like if i use current, then it doesnt work, mismatch
            subEntry.rows == true
          ) {
            console.log(currentTopicNumberState);
            console.log(subEntry.entries);
            setSubContainer(true);
            setSubContainerEntries(subEntry.entries);
          } else if (
            subEntry.topicNumber == nextTopicNumberState && //this is wried that the nextTopicNumberState needed to be matched against instead of current, but looks like if i use current, then it doesnt work, mismatch
            subEntry.rows == false &&
            subContainer == true
          ) {
            console.log(subEntry.entries);
            setSubContainer(false);
          }
        });
      });
    }
  };

  useEffect(() => {
    // Step 1 obtain current topic:
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
    console.log(currentTopicNumber);
    setCurrentTopicNumberState(currentTopicNumber);
    //Step 2 Find the index of the currentTopicNumber in list of topic numbers from back end

    let indexofCurrentTopicNumber = topicNumbersListfromBackEnd.findIndex(
      (topicNumber) => topicNumber == currentTopicNumber
    );
    console.log(indexofCurrentTopicNumber);

    //Step 3 Derive next topic number in list with catch error for out of bound index
    let indexofNextTopicNumber = indexofCurrentTopicNumber + 1;
    if (indexofNextTopicNumber > topicNumbersListfromBackEnd.length - 1) {
      //if next index great then lenght of array set index number to 0 so you go back to beginning
      indexofNextTopicNumber = 0;
    }
    console.log(indexofNextTopicNumber);
    let nextTopicNumber = topicNumbersListfromBackEnd[indexofNextTopicNumber];
    console.log(nextTopicNumber);
    setNextTopicNumberState(nextTopicNumber);

    //Step 4 Derive previous topic number in list with catch error for out of bound index
    let indexofPreviousTopicNumber = indexofCurrentTopicNumber - 1;
    if (indexofPreviousTopicNumber < 0) {
      //if next index less then 0 set index number to last so you go back to ending
      indexofPreviousTopicNumber = topicNumbersListfromBackEnd.length - 1;
    }
    console.log(indexofPreviousTopicNumber);
    let previousTopicNumber =
      topicNumbersListfromBackEnd[indexofPreviousTopicNumber];
    console.log(previousTopicNumber);
    setPreviousTopicNumberState(previousTopicNumber);

    //Step 5 - Change sidebar to show menu based on current topic
    console.log(entryStore); // when code below uncommetned it is saying entrystroe has no properties

    // if (entryStore) {
    //   entryStore.forEach(function (entry) {
    //     entry.entries.forEach(function (subEntry) {
    //       if (
    //         subEntry.topicNumber == currentTopicNumberState &&
    //         subEntry.rows == true
    //       ) {
    //         console.log(subEntry.entries);
    //         setSubContainerEntries(subEntry.entries);
    //         // setSubContainer(true);
    //       }
    //       // else if (
    //       //   subEntry.topicNumber == currentTopicNumberState &&
    //       //   subEntry.rows == false &&
    //       //   subContainer == true
    //       // ) {
    //       //   console.log(subEntry.entries);
    //       //   setSubContainer(false);
    //       // }
    //     });
    //   });
    // }

    //End
  });

  return (
    <div style={{ display: "unset" }}>
      <Navbar
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
        navTop={navTop}
      >
        <div>
          <HamburgerButton click={openNav}></HamburgerButton>{" "}
          <Link to={"/"}>
            <Logo src={HHLogo} alt="Logo" />{" "}
          </Link>
        </div>
        <Link
          to={`/${courseTitleUserIsOn}/quiz/` + props.selectedTopic.topicNumber}
        >
          {props.selectedTopic.sections.length !== 0 && (
            <QuizMeButton>
              <p style={{ fontSize: "1.5vh", margin: "0px" }}>Switch to</p>
              <b>Quiz Mode</b>
            </QuizMeButton>
          )}
        </Link>
        <div>
          {topicNumbersListfromBackEnd.findIndex(
            (topicNumber) => topicNumber == currentTopicNumberState
          ) !== 0 && (
            <Link
              to={`/${courseTitleUserIsOn}/topic/${previousTopicNumberState}`}
            >
              <ButtonH2 onClick={setCurrentUrl}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </ButtonH2>
            </Link>
          )}
          {topicNumbersListfromBackEnd.findIndex(
            (topicNumber) => topicNumber == currentTopicNumberState
          ) >
          topicNumbersListfromBackEnd.length - 2 ? (
            <a href="https://subscribepage.io/hhcourses">
              <ButtonH2>
                {" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </ButtonH2>
            </a>
          ) : (
            <Link to={`/${courseTitleUserIsOn}/topic/${nextTopicNumberState}`}>
              <ButtonH2 onClick={setCurrentUrl}>
                {" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </ButtonH2>
            </Link>
          )}
        </div>
      </Navbar>

      <Transition
        in={navOpen && entryStore}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        {(state) => {
          {
            /* if (state === "exited") setSubContainer(false); */
          } //Code for NavBar to reset to main menu every time it closes
          return (
            <>
              <Sidenav state={state} click={closeNav} />
              <div
                className="overlay"
                style={
                  state === "entering"
                    ? { animation: "show .3s forwards" }
                    : state === "entered"
                    ? { opacity: "1" }
                    : { animation: "show .3s backwards reverse" }
                }
                onClick={closeNav}
              ></div>
              {
                <div
                  className="closeBtn"
                  style={
                    state === "entering"
                      ? { animation: "show .3s forwards" }
                      : state === "entered"
                      ? { opacity: "1" }
                      : { animation: "show .3s backwards reverse" }
                  }
                  onClick={closeNav}
                >
                  &times;
                </div> //This is code for a close button
              }
            </>
          );
        }}
      </Transition>

      <BackgroundPage></BackgroundPage>
    </div>
  );
}
