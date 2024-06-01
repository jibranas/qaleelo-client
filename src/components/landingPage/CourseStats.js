import "./landingPageCourseContent.css";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CourseIcon from "./CourseIcon";
import { useAmazonContext } from "../../Contexts/AmazonContext";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import CourseContentRow from "./CourseConentRow";
import axios from "axios";
import api from "../api";

/* Before coding it is important to agree on what each of the stats mean:
numberOfLessons = count of Sections
numberOfVideos = count of Sections that have a youTubeLink
numberOfQuizQuestions = count of examples data set
approxCourseDuration = (timeToCompleteEachLesson*numberOfLessons) + 
                       (timeToCompleteEachTopicQuiz*numberOfTopicsWithSections) + 
                       (addedBufferTime*numberOfTopicsWithSections)
    where timeToCompleteEachLesson = time it takes to complete a Section
    timeToCompleteEachTopicQuiz = time it takes to Complete a Topic Quiz [I am assuming this is the same time for each topic regardless of the number of sections in each Topic because the count of questions in the Topic Quiz is the same regardless of count of sections]
    numberOfTopicsWithSections = count of Topics with Sections
    addedBufferTime = added Time a user might spend on a Topic if a user makes mistakes in sections or Topics
*/

function CourseStats(props) {
  const { topicDatafromBackEnd, exampleDatafromBackEnd } = useAmazonContext();
  const [numberOfQuizQuestions, setNumberOfQuizQuestions] = useState(0);
  const [numberOfLessons, setNumberOfLessons] = useState(0);
  const [numberOfVideos, setNumberOfVideos] = useState(0);
  const [approxCourseDuration, setApproxCourseDuration] = useState(0);

  let {
    courseTitleUserIsOn,
    setCourseTitleUserIsOn,
    courseDetails,
    setCourseDetails,
    setTopicDatafromBackEnd,
    setExampleDatafromBackEnd,
    entryStore,
    setEntryStore,
    subContainer,
  } = useAmazonContext();

  // Fetch data for contents as well as stats based on course clicked
  useEffect(() => {
    // props.courseDetails &&
    //   axios(
    //     `/api/${props.courseDetails.courseTitle.replace(
    //       /\s/g,
    //       ""
    //     )}/sideBarData?collectionName=${
    //       props.courseDetails.courseTopicsCollectionName
    //     }&modelName=${props.courseDetails.courseTopicsModelName}`
    //   ).then((response) => {
    //     setEntryStore(response.data);
    //     console.log(response.data);
    //   });
    props.courseDetails &&
      api
        .get(
          `/${props.courseDetails.courseTitle.replace(
            /\s/g,
            ""
          )}/topicsData?collectionName=${
            props.courseDetails.courseTopicsCollectionName
          }&modelName=${props.courseDetails.courseTopicsModelName}`
        )
        .then((response) => {
          //counting topic youtube links

          let numberOfLessons = 0;
          let numberOfTopicsWithSections = 0;
          let numberOfVideos = 0;

          for (let i = 0; i < response.data.length; i++) {
            numberOfLessons += response.data[i].sections.length;
            if (response.data[i].sections.length !== 0) {
              numberOfTopicsWithSections += 1;
            }
            if (response.data[i].topicYoutubeLink) {
              numberOfVideos += 1;
            }
          }

          setNumberOfLessons(numberOfLessons);
          setNumberOfVideos(numberOfVideos);
          let timeToCompleteEachLesson = 1.5;
          let timeToCompleteEachTopicQuiz = 2;
          let addedBufferTime = 1;
          setApproxCourseDuration(timeToCompleteEachLesson * numberOfLessons);
          // setTopicDatafromBackEnd(response.data);
          console.log(response.data);
        });
    props.courseDetails &&
      api
        .get(
          `/examplesData?collectionName=${props.courseDetails.courseExamplesCollectionName}&modelName=${props.courseDetails.courseExamplesModelName}`
        )
        .then((response) => {
          // setExampleDatafromBackEnd(response.data);
          setNumberOfQuizQuestions(response.data.length);
          console.log(response.data);
        });
  }, [props.courseDetails]);
  console.log(entryStore, topicDatafromBackEnd, exampleDatafromBackEnd);

  // let numberOfLessons = 0;
  // let numberOfVideos = 0;
  let numberOfTopicsWithSections = 0;

  // counting section youtube links
  // for (let i = 0; i < topicDatafromBackEnd.length; i++) {
  //   numberOfLessons += topicDatafromBackEnd[i].sections.length;
  //   if (topicDatafromBackEnd[i].sections.length !== 0) {
  //     //if the topic has a section
  //     numberOfTopicsWithSections += 1;
  //     for (let j = 0; j < topicDatafromBackEnd[i].sections.length; j++) {
  //       if (topicDatafromBackEnd[i].sections[j].sectonYoutubeLink) {
  //         //count the sections with videos
  //         numberOfVideos += 1;
  //       }
  //     }
  //   }
  // }

  console.log(numberOfLessons);
  console.log(numberOfVideos);
  console.log(numberOfTopicsWithSections);

  console.log(topicDatafromBackEnd);

  // let numberOfQuizQuestions = exampleDatafromBackEnd.length;

  console.log(numberOfQuizQuestions);

  // let approxCourseDuration = timeToCompleteEachLesson * numberOfLessons;

  console.log(approxCourseDuration);

  return (
    <div className="courseStatBanner" style={{ color: props.color }}>
      <div className="courseStat">
        <div className="courseStatImage">
          <i class="fa-solid fa-clipboard-question"></i>
        </div>
        <div className="courseStatDescription">
          <div className="courseStatNumber">{numberOfQuizQuestions}</div>{" "}
          <div className="courseStatName">Questions</div>
        </div>
      </div>
      <div className="courseStat">
        <div className="courseStatImage">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div className="courseStatDescription">
          <div className="courseStatNumber">{numberOfLessons}</div>{" "}
          <div className="courseStatName">Lessons</div>
        </div>
      </div>
      {numberOfVideos > 0 && (
        <div className="courseStat">
          <div className="courseStatImage">
            <i class="fa-solid fa-play"></i>
          </div>
          <div className="courseStatDescription">
            <div className="courseStatNumber">{numberOfVideos}</div>{" "}
            <div className="courseStatName">Videos</div>
          </div>
        </div>
      )}

      <div className="courseStat">
        <div className="courseStatImage">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div className="courseStatDescription">
          <div className="courseStatNumber">{approxCourseDuration}</div>{" "}
          <div className="courseStatName">~ mins</div>
        </div>
      </div>
    </div>
  );
}

export default CourseStats;
