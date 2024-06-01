import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
import styled from "styled-components";

import WelcomeCourseCard from "./WelcomeCourseCard";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { useHistory } from "react-router-dom";

function WelcomeCourseMenuPage() {
  const [coursesDisplayed, setCoursesDisplayed] = useState([]);
  useEffect(() => {
    api.get(`/coursesData`).then((response) => {
      setCoursesDisplayed(response.data);
      console.log(response.data);
    });
  }, []);
  console.log(coursesDisplayed);

  return (
    <div>
      <div>
        {coursesDisplayed.map((course, index) => {
          return (
            <div className="courseCardsContainer">
              {course.courseIsActive && (
                <WelcomeCourseCard course={course}></WelcomeCourseCard>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WelcomeCourseMenuPage;
