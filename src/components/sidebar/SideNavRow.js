import React, { useState, useEffect } from "react";
import ColorThief from "colorthief";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import ChapterProgressBarMini from "../ChapterProgressBarMini";

export default function SideNavRow(props) {
  const {
    setSubContainer,
    setSubContainerEntries,
    courseDetails,
    courseTitleUserIsOn,
    chapterProgressData,
  } = useAmazonContext();
  const [dominantColor, setDominantColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#dd6260");

  useEffect(() => {
    const imageUrl =
      "https://qaleelo-assets.s3.us-east-2.amazonaws.com/" +
      courseDetails.courseTitle.replace(/\s/g, "") +
      "/sectionImages/" +
      props.number +
      ".1.png";

    fetchAndExtractColorWithCache(imageUrl);
  }, []);

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

  const openRow = () => {
    setSubContainer(true);
    setSubContainerEntries(props.entries);
  };

  useEffect(() => {
    if (
      courseTitleUserIsOn &&
      chapterProgressData &&
      chapterProgressData.length > 0
    ) {
      const matchingCourse = chapterProgressData.find(
        (course) => course.courseProgress === courseTitleUserIsOn
      );

      if (
        matchingCourse &&
        matchingCourse.chapterProgress.includes(props.number)
      ) {
        setBackgroundColor("rgb(80, 200, 120)");
      } else {
        setBackgroundColor("#dd6260");
      }
    }
  }, [courseTitleUserIsOn, chapterProgressData]);

  const imageUrl = `https://qaleelo-assets.s3.us-east-2.amazonaws.com/${courseDetails.courseTitle.replace(
    /\s/g,
    ""
  )}/sectionImages/${props.number}.1.png`;

  return (
    <div
      className="sidenavRow"
      style={{
        ...props.styleVariable,
        backgroundColor: dominantColor,
        opacity:
          props.lockState === "locked" && props.number !== "1.1" ? 0.6 : 1,
      }}
      onClick={() => props.entries && openRow()}
    >
      <div
        className="circle"
        style={{
          backgroundColor: backgroundColor,
          opacity:
            props.lockState === "locked" && props.number !== "1.1" ? 0.8 : 1,
        }}
      >
        <span className="circle-number">{props.number}</span>
      </div>

      {props.lockState === "locked" && props.number !== "1.1" ? (
        <div
          className="quizImage"
          style={{
            position: "relative",

            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            borderRadius: "10%",
            float: "left",
            opacity: 0.8,
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
            borderRadius: "10%",
            float: "left",
          }}
        ></div>
      )}
      <div
        className="sideNavRowChapterContent"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {" "}
        <div style={{ marginTop: "20px" }}>
          <ChapterProgressBarMini
            chapterNumber={props.number}
            courseTitleUserIsOn={courseTitleUserIsOn}
          ></ChapterProgressBarMini>
        </div>
        {/* {courseDetails.courseTitle && (
        <img
          className="sideNavRowImage"
          src={
            "https://qaleelo-assets.s3.us-east-2.amazonaws.com/" +
            courseDetails.courseTitle.replace(/\s/g, "") +
            "/sectionImages/" +
            props.number +
            ".1.png"
          }
          alt=""
          crossOrigin="anonymous"
          style={{ opacity: props.lockState === "locked" ? 0.3 : 1 }}
        />
      )} */}
        <p className="sidenavRowText" style={{ color: textColor }}>
          {isLoading ? "Loading..." : `${props.title}`}
        </p>
      </div>
    </div>
  );
}
