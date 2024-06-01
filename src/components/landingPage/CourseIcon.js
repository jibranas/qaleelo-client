import React, { useState } from "react";
import styled from "styled-components";
import "./landingPage.css";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";

function CourseIcon(props) {
  return (
    <div className="courseIconAndTitle">
      <div>
        <img className="courseImage" src={props.img} alt=""></img>{" "}
        {/* <h1>{props.title}</h1> */}
        {/* <h3>{props.description}</h3> */}
      </div>
    </div>
  );
}

export default CourseIcon;
