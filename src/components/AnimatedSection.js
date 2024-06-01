import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import TopicData, { allExampleData } from "./TopicData";
import MainSideNav from "./sidebar/MainSideNav";
import { useAmazonContext } from "../Contexts/AmazonContext";
import axios from "axios";
import Confetti from "react-dom-confetti";
import { motion } from "framer-motion";
import "../components/Lesson.css";
import jsonData from "./sectionDescription.json";
import ReactHtmlParser from "react-html-parser";
import { useInView } from "react-intersection-observer";

function AnimatedSection({
  className,
  style,
  initial,
  animate,
  transition,
  content,
}) {
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger once when it enters the viewport
    threshold: 0.1, // Trigger when at least 50% of the element is visible
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={initial}
      animate={inView ? animate : initial} // Animate when in view, otherwise keep it initial
      transition={transition}
    >
      {content}
    </motion.div>
  );
}

export default AnimatedSection;
