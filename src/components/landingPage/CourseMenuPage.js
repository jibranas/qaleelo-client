import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import styled from "styled-components";
import CourseIcon from "./CourseIcon";
import CourseStats from "./CourseStats";
import CourseCard from "./CourseCard";
import { Link } from "react-router-dom";
import Logout from "../userAuth/Logout";
import { useHistory } from "react-router-dom";

function CourseMenuPage() {
  const [coursesDisplayed, setCoursesDisplayed] = useState([]);
  useEffect(() => {
    api.get(`/coursesData`).then((response) => {
      setCoursesDisplayed(response.data);
      console.log(response.data);
    });
  }, []);
  console.log(coursesDisplayed);
  const history = useHistory();
  // In your component that requires authentication
  useEffect(() => {
    if (!sessionStorage.getItem("isLoggedIn")) {
      // Redirect to login page
      history.replace("/");
    }
  }, []);

  return (
    <div>
      <div className="sideNavChapterHeader">
        <p>Courses</p>
      </div>
      <div
        style={{
          marginBottom: "50px",
        }}
      >
        {" "}
        <Logout />
      </div>

      <div className="courseCardsContainer">
        {coursesDisplayed.map((course, index) => {
          return (
            <>
              {course.courseIsActive && (
                <CourseCard course={course}></CourseCard>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}

export default CourseMenuPage;
