import React, { useState, useEffect } from "react";
import { ColorExtractor } from "react-color-extractor";
import ColorThief from "colorthief";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import axios from "axios";

export default function SideNavRowLesson(props) {
  const {
    setSubContainer,
    setSubContainerEntries,
    courseDetails,
    progressData,
    courseTitleUserIsOn,
  } = useAmazonContext();
  const [dominantColor, setDominantColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#dd6260");
  console.log(progressData);
  console.log(courseTitleUserIsOn);

  useEffect(() => {
    const imageUrl =
      "https://qaleelo-assets.s3.us-east-2.amazonaws.com/" +
      courseTitleUserIsOn +
      "/sectionImages/" +
      props.number +
      ".png";

    console.log(props.number);
    console.log(props.chapter); // string

    fetchAndExtractColor(imageUrl);
  }, []);

  useEffect(() => {
    if (courseTitleUserIsOn && progressData && progressData.length > 0) {
      const matchingCourse = progressData.find(
        (course) => course.courseProgress === courseTitleUserIsOn
      );

      if (
        matchingCourse &&
        matchingCourse.lessonProgress.includes(props.number)
      ) {
        setBackgroundColor("rgb(80, 200, 120)");
      } else {
        setBackgroundColor("#dd6260");
      }
    }
  }, [courseTitleUserIsOn, progressData]);

  // console.log(props.number, props.lockState);

  const fetchAndExtractColor = async (imageUrl) => {
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
          };
        };
      } else {
        console.error("Image fetch failed:", response.status);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleColorExtraction = (color) => {
    setDominantColor(color);

    const luminance = calculateLuminance(color);

    const textColor = luminance > 0.5 ? "#000" : "#fff";
    setTextColor(textColor);
  };

  const calculateLuminance = (color) => {
    const rgb = color.match(/\d+/g);
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return luminance;
  };

  const openRow = () => {
    setSubContainer(true);
    setSubContainerEntries(props.entries);
  };

  const imageUrl = `https://qaleelo-assets.s3.us-east-2.amazonaws.com/${
    courseDetails.courseTitle && courseDetails.courseTitle.replace(/\s/g, "")
  }/sectionImages/${props.number}.png`;

  return (
    <div
      className="sidenavRowLesson"
      style={{
        // backroundColor: fetchedLessonProgress.includes(props.number) && fetchedCourseProgress.includes(props.chapter) ? "lightgreen" : "white",
        backgroundColor: "white",
        width: props.width,
        marginLeft: props.marginLeft,
        borderRadius: props.borderRadius,
        // backgroundColor: dominantColor,
      }}
    >
      <div
        className="circleLesson"
        style={{
          backgroundColor: backgroundColor,
          opacity: props.lockState === "locked" ? 0.5 : 1,
        }}
      >
        <span className="circle-numberLesson">{props.number}</span>
      </div>
      {props.lockState === "locked" ? (
        <div
          className="quizImage"
          style={{
            position: "relative",

            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            borderRadius: "50%",
            float: "left",
            opacity: 0.5,
          }}
        >
          <img
            src="https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/lockblack.png"
            alt=""
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              display: "block",
              margin: "auto",
              width: "50px",
            }}
          ></img>
        </div>
      ) : (
        <div
          className="quizImage"
          style={{
            position: "relative",

            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            borderRadius: "50%",
            float: "left",
          }}
        ></div>
      )}
      {/* {courseDetails.courseTitle && (
        <img
          className="sideNavRowLessonImage"
          src={
            "https://qaleelo-assets.s3.us-east-2.amazonaws.com/" +
            courseDetails.courseTitle.replace(/\s/g, "") +
            "/sectionImages/" +
            props.number +
            ".png"
          }
          alt=""
          crossOrigin="anonymous"
          style={{ opacity: props.lockState === "locked" ? 0.3 : 1 }}
        />
      )} */}
      <div className="sideNavRowLessonTextContainer">
        {" "}
        <div className="sidenavRowLessonText">{props.title}</div>
      </div>
    </div>
  );
}
