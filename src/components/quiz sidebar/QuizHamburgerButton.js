import React from "react";
import "./QuizSidebar.css";

export default function QuizHamburgerButton(props) {
  return (
    <div className="hamburger-btn" onClick={props.click}>
      &#9776;
    </div>
  );
}
