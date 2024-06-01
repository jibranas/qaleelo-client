import React from "react";
import { motion } from "framer-motion";
import "./ProgressBar.css";

const CourseProgressBar = (props) => {
  // Find the progress data for the current course
  const courseProgressData =
    props.progressData &&
    props.progressData.find(
      (progress) => progress.courseProgress === props.courseTitleUserIsOn
    );

  // Find the chapter progress data for the current course
  const chapterProgressData =
    props.chapterProgressData &&
    props.chapterProgressData.find(
      (progress) => progress.courseProgress === props.courseTitleUserIsOn
    );

  // Get the lessons the user has completed
  const completedLessons = new Set(courseProgressData?.lessonProgress || []);

  // Get the chapters the user has completed
  const completedChapters = new Set(chapterProgressData?.chapterProgress || []);

  // Calculate total number of lessons and quizzes
  let totalLessons = 0;
  let totalQuizzes = 0;
  props.simplifiedChaptersLessonsData &&
    props.simplifiedChaptersLessonsData.forEach((chapter) => {
      totalLessons += chapter.lessons.length;
      totalQuizzes++; // Assuming each chapter has one quiz
    });

  // Calculate total number of completed lessons and quizzes
  let completedCount = completedLessons.size + completedChapters.size;

  // Calculate percentage of lessons and quizzes completed and round up
  const percentage = Math.ceil(
    (completedCount / (totalLessons + totalQuizzes)) * 100
  );

  return (
    <div>
      <div style={{}} className="CourseTitleContainer">
        <span className="LessonNumber" style={{ color: "#80e8a2" }}>
          Course Progress
        </span>{" "}
      </div>
      <div className="courseProgressBarContainer">
        <span
          style={{ marginRight: "25px", color: "#80e8a2", fontSize: "3vh" }}
        >{`${percentage}%`}</span>
        <div
          style={{
            flex: 1,
            backgroundColor: "#f0f0f0",
            borderRadius: 20,
            maxWidth: "82%",
          }}
        >
          <motion.div
            style={{
              width: `${percentage}%`,
              backgroundColor: "rgb(80, 200, 120)",
              height: "2vh",
              borderRadius: "inherit",
              textAlign: "center",
              lineHeight: "20px",
              color: "white",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgressBar;
