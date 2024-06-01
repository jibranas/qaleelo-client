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
import Logout from "../userAuth/Logout";

const Navbar = styled.nav`
  /* background: #dd6260; */
  background: #8747d4;
  /* top: 80; */
  height: 6vh;
  transform: translateY(${(props) => props.navTop + "vh"});
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
`;

export default function LessonMainSideNav(props) {
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
    isDarkMode,
    setIsDarkMode,
    navOpen,
    setNavOpen,
  } = useAmazonContext();
  console.log(courseTitleUserIsOn, courseDetails, entryStore);

  // Toggle dark mode
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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
  }, [courseDetails]);
  console.log(
    `/api/${courseTitleUserIsOn}/sideBarData?collectionName=${courseDetails.courseTopicsCollectionName}&modelName=${courseDetails.courseTopicsModelName}`
  );
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

  return (
    <div style={{ display: "unset" }}>
      <Navbar
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10000,
        }}
        navTop={navTop}
      >
        <div>
          <HamburgerButton click={openNav}></HamburgerButton>{" "}
        </div>
        {/* <button
          onClick={toggleMode}
          className={`toggle-button ${isDarkMode ? "dark" : "light"}`}
        >
          {isDarkMode ? "Dark" : "Light"}
        </button> */}
        <div className="toggle-container">
          {" "}
          <input
            type="checkbox"
            id="toggle_checkbox"
            checked={isDarkMode}
            onChange={toggleMode}
          />
          <label for="toggle_checkbox">
            <div id="star">
              <div class="star" id="star-1">
                ★
              </div>
              <div class="star" id="star-2">
                ★
              </div>
            </div>
            <div id="moon"></div>
          </label>
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
              {/* <div
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
              } */}
            </>
          );
        }}
      </Transition>
    </div>
  );
}
