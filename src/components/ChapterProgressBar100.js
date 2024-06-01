import React, { useState, useContext, useEffect, useRef } from "react";
import { useAmazonContext } from "../Contexts/AmazonContext";
import axios from "axios";
import { motion } from "framer-motion";

const ChapterProgressBar100 = (props) => {
  const {
    courseTitleUserIsOn,
    entryStore,
    isDarkMode,
    subContainer,

    setCourseTitleUserIsOn,
    courseDetails,
    setCourseDetails,
    topicDatafromBackEnd,
    setTopicDatafromBackEnd,
    exampleDatafromBackEnd,
    setExampleDatafromBackEnd,

    setEntryStore,

    setIsDarkMode,
    progressData,
    setProgressData,
    chapterProgressData,
    setChapterProgressData,
  } = useAmazonContext();

  return (
    <div>
      <div style={{}} className="LessonTitleContainer">
        <span
          className="LessonNumber"
          style={{ color: props.color ? props.color : "rgb(80, 200, 120)" }}
        >
          Chapter Progress
        </span>{" "}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "85%",
          marginLeft: "7%",
        }}
      >
        <span
          style={{
            marginRight: "25px",
            color: props.color ? props.color : "rgb(80, 200, 120)",
            fontSize: "3vh",
            fontWeight: "bold",
          }}
        >
          100%
        </span>
        <div style={{ flex: 1, backgroundColor: "#f0f0f0", borderRadius: 20 }}>
          <motion.div
            style={{
              width: "100%",
              backgroundColor: "rgb(80, 200, 120)",
              height: 30,
              borderRadius: "inherit",
              textAlign: "center",
              lineHeight: "20px",
              color: "white",
            }}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChapterProgressBar100;
