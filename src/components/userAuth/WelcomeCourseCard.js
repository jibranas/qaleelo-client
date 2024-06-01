import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "../landingPage/landingPage.css";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import CourseIcon from "../landingPage/CourseIcon";
import CourseStats from "../landingPage/CourseStats";
import ColorThief from "colorthief";

const ButtonH2 = styled.button`
  background: red;
  position: relative;
  font-family: "Quicksand", sans-serif;
  /* padding-left: 15px; */
  /* padding-right: 15px; */
  /* margin: 30px; */
  text-transform: uppercase;
  /* font-size: 15px; */
  font-size: 1.4vh;
  font-weight: bold;
  overflow: hidden;
  border: 0;
  border-radius: 20% 20% 20% 20% / 50% 50% 50% 50%;
  background: none;
  color: #dd6260;
  height: 6vh;
  text-decoration: underline;

  transition: all 0.25s ease;
  cursor: pointer;
  margin-right: 20px;
`;

const StartButton = styled.button`
  background: red;
  position: relative;
  font-family: "Quicksand", sans-serif;
  padding-left: 15px;
  padding-right: 15px;
  /* margin-bottom: 10px; */
  text-transform: uppercase;
  /* font-size: 15px; */
  font-size: 1.8vh;
  font-weight: bold;
  overflow: hidden;
  border: 0;
  border-radius: 20% 20% 20% 20% / 50% 50% 50% 50%;
  background: none;
  color: yellow;
  height: 6vh;

  transition: all 0.25s ease;
  cursor: pointer;
  margin-right: 20px;

  &:active {
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
    background: #f2b1ae;
  }
`;

function WelcomeCourseCard(props) {
  const [dominantColor, setDominantColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showGoals, setShowGoals] = useState(false);

  const toggleGoals = () => {
    setShowGoals(!showGoals);
  };

  const fetchAndExtractColorWithCache = async (imageUrl) => {
    const cachedColor = localStorage.getItem(imageUrl);

    if (cachedColor) {
      handleColorExtraction(cachedColor);
    } else {
      try {
        const response = await fetch(imageUrl, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();

          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;

            const image = new Image();
            image.src = base64data;

            image.onload = () => {
              const colorThief = new ColorThief();
              const dominantColorRGB = colorThief.getColor(image);
              const dominantColorCSS = `rgb(${dominantColorRGB[0]}, ${dominantColorRGB[1]}, ${dominantColorRGB[2]})`;

              handleColorExtraction(dominantColorCSS);

              // Store the color in local storage for caching
              localStorage.setItem(imageUrl, dominantColorCSS);
            };
          };
        } else {
          console.error("Image fetch failed:", response.status);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }
  };

  const handleColorExtraction = (color) => {
    setDominantColor(color);
    const luminance = calculateLuminance(color);
    const textColor = luminance > 0.5 ? "#000" : "#fff";
    setTextColor(textColor);
    setIsLoading(false);
  };

  const calculateLuminance = (color) => {
    const rgb = color.match(/\d+/g);
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return luminance;
  };

  useEffect(() => {
    const imageUrl =
      "https://qaleelo-assets.s3.us-east-2.amazonaws.com/" +
      props.course.courseTitle.replace(/\s/g, "") +
      "/courseImage/" +
      props.course.courseTitle.replace(/\s/g, "") +
      ".png";

    fetchAndExtractColorWithCache(imageUrl);
  }, []);

  return (
    <div
      className="courseFullDetails"
      style={{ backgroundColor: dominantColor }}
    >
      {" "}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          background: "#8747D4",
          fontWeight: "bold",
          fontSize: "4vh",
          marginBottom: "2vh",
        }}
      >
        {props.course.courseCardTitle}
      </div>
      <div className="courseHeader">
        <CourseIcon
          img={
            "https://qaleelo-assets.s3.us-east-2.amazonaws.com/" +
            props.course.courseTitle.replace(/\s/g, "") +
            "/courseImage/" +
            props.course.courseTitle.replace(/\s/g, "") +
            ".png"
          }
          title={props.course.courseTitle}
          description={props.course.courseDescription}
        ></CourseIcon>
        <div className="courseDescriptionANDGoals">
          <CourseStats
            courseDetails={props.course}
            color={textColor}
          ></CourseStats>
        </div>
      </div>
      <h1 className="courseDescription" style={{ color: textColor }}>
        {props.course.courseDescription}
        <br></br>
        <ButtonH2 onClick={toggleGoals} style={{ color: textColor }}>
          {showGoals ? "Hide Course Details" : "Show Course Details"}
        </ButtonH2>
        ​
      </h1>
      {showGoals && (
        <div className="courseGoals">
          <div className="courseGoalsDescription" style={{ color: textColor }}>
            <div className="courseGoalsHeader" style={{ color: textColor }}>
              You will learn
            </div>
            {Object.entries(props.course).length === 0 ? ( //UseEffects need to fetch object details and hence object will be empty until useEffect gets data, until then this is empty
              <div>Loading</div>
            ) : (
              props.course.courseGoals.map((goal, index) => {
                return <p className="courseGoalItem">{goal}</p>;
              })
            )}
          </div>
          <div className="courseReference">
            <div
              className="courseReferenceDescription"
              style={{ color: textColor }}
            >
              {props.course.courseReferenceDescription}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WelcomeCourseCard;
