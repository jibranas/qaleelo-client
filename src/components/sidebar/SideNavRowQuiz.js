import React, { useState, useEffect } from "react";
import { ColorExtractor } from "react-color-extractor";
import ColorThief from "colorthief";
import { useAmazonContext } from "../../Contexts/AmazonContext";

export default function SideNavRowQuiz(props) {
  const {
    setSubContainer,
    setSubContainerEntries,
    courseDetails,
    courseTitleUserIsOn,
    chapterProgressData,
  } = useAmazonContext();
  const [dominantColor, setDominantColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("white");

  const openRow = () => {
    setSubContainer(true);
    setSubContainerEntries(props.entries);
  };

  useEffect(() => {
    if (chapterProgressData == null) {
      setBackgroundColor("#a678de");
    }

    if (courseTitleUserIsOn && chapterProgressData) {
      const matchingCourse = chapterProgressData.find(
        (course) => course.courseProgress === courseTitleUserIsOn
      );

      if (
        matchingCourse &&
        matchingCourse.chapterProgress.includes(props.number)
      ) {
        setBackgroundColor("rgb(80, 200, 120)");
      } else {
        setBackgroundColor("#a678de");
      }
    }
  }, [courseTitleUserIsOn, chapterProgressData]);

  const imageUrl =
    "https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/QuizImage.png";

  return (
    <div
      className="sidenavRowLesson"
      style={{
        backgroundColor: "white",
        width: props.width,
        marginLeft: props.marginLeft,
        borderRadius: props.borderRadius,
        // backgroundColor: dominantColor,
      }}
    >
      <div
        className="circleQuiz"
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
            borderRadius: "80%",
            float: "left",
            opacity: 0.5,
          }}
        >
          <img
            src="https://qaleelo-assets.s3.us-east-2.amazonaws.com/General/CanvaGeneratedImages/lockblack.png"
            alt=""
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              display: "block",
              margin: "auto",
              width: "100px",
              opacity: "1",
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
            borderRadius: "80%",
            float: "left",
          }}
        ></div>
      )}

      <div>
        <p
          style={{
            margin: 0,
            marginTop: "25px",
            color: "#a678de",
            fontSize: "2vh",
            fontWeight: "bold",
          }}
        >
          Chapter Quiz
        </p>
        <p className="sidenavRowLessonText" style={{ marginTop: 0 }}>
          {props.title}
        </p>
      </div>
    </div>
  );
}
