import React, { useState, useContext, useEffect, useRef } from "react";
import { useAmazonContext } from "../Contexts/AmazonContext";
import axios from "axios";
import api from "./api";
import { motion } from "framer-motion";

const ChapterProgressBarMini = (props) => {
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

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      console.error("User email not found in local storage");
      return;
    }

    const fetchProgress = async () => {
      try {
        const response = await api.get("/fetchProgressRecord", {
          params: {
            userEmail: userEmail,
          },
        });
        setProgressData(response.data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgress();
  }, []);

  console.log(progressData);
  console.log(courseTitleUserIsOn);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      console.error("User email not found in local storage");
      return;
    }

    const fetchChapterProgress = async () => {
      try {
        const response = await api.get("/fetchChapterProgressRecord", {
          params: {
            userEmail: userEmail,
          },
        });
        setChapterProgressData(response.data);
      } catch (error) {
        console.error("Error fetching chapter progress data:", error);
      }
    };

    fetchChapterProgress();
  }, []);

  console.log(chapterProgressData);
  console.log(courseTitleUserIsOn);

  //Simplfied entryStore

  function simplifyData(data) {
    return (
      data &&
      data
        .map((topicHeader) => {
          return topicHeader.entries.map((chapter) => {
            return {
              chapterNumber: chapter.topicNumber,
              chapterTitle: chapter.title,
              lessons: chapter.entries[0].entries.map((lesson) => {
                return {
                  lessonNumber: lesson.sectionNumber,
                  lessonTitle: lesson.title,
                };
              }),
            };
          });
        })
        .flat()
    );
  }

  // Usage
  const simplifiedChaptersLessonsData = simplifyData(entryStore);
  console.log(simplifiedChaptersLessonsData);

  function generateunlockedLessons(
    progressData,
    simplifiedChaptersLessonsData,
    chapterProgressData,
    courseTitleUserIsOn
  ) {
    const unlockedLessons = [];

    const userProgress =
      progressData &&
      progressData.find(
        (progress) => progress.courseProgress === courseTitleUserIsOn
      );
    if (userProgress) {
      const { lessonProgress } = userProgress;
      const lastCompletedLesson = lessonProgress[lessonProgress.length - 1];
      const chapterContainingLastCompletedLesson =
        simplifiedChaptersLessonsData &&
        simplifiedChaptersLessonsData.find((chapter) => {
          return chapter.lessons.some(
            (lesson) => lesson.lessonNumber === lastCompletedLesson
          );
        });

      if (chapterContainingLastCompletedLesson) {
        const { lessons } = chapterContainingLastCompletedLesson;
        const lastCompletedLessonIndex = lessons.findIndex(
          (lesson) => lesson.lessonNumber === lastCompletedLesson
        );
        if (lastCompletedLessonIndex === lessons.length - 1) {
          // Add all completed lessons and check chapter completion
          unlockedLessons.push(...lessonProgress);
          const nextChapterIndex =
            simplifiedChaptersLessonsData.findIndex(
              (chapter) =>
                chapter.chapterNumber ===
                chapterContainingLastCompletedLesson.chapterNumber
            ) + 1;
          const nextChapter = simplifiedChaptersLessonsData[nextChapterIndex];
          if (nextChapter) {
            const chapterProgress =
              chapterProgressData &&
              chapterProgressData.find(
                (progress) => progress.courseProgress === courseTitleUserIsOn
              )?.chapterProgress;
            if (
              chapterProgress &&
              chapterProgress.includes(
                chapterContainingLastCompletedLesson.chapterNumber
              )
            ) {
              const nextLesson = nextChapter.lessons[0];
              unlockedLessons.push(nextLesson.lessonNumber);
            }
          }
        } else {
          // Add completed lessons and next lesson in the same chapter
          const nextLesson = lessons[lastCompletedLessonIndex + 1];
          unlockedLessons.push(...lessonProgress, nextLesson.lessonNumber);
        }
      }
    }

    return unlockedLessons;
  }

  // Generate the third dataset
  const unlockedLessons = generateunlockedLessons(
    progressData,
    simplifiedChaptersLessonsData,
    chapterProgressData,
    courseTitleUserIsOn
  );

  // Log the result
  console.log(unlockedLessons);

  function generateUnlockedQuizzes(
    progressData,
    simplifiedChaptersLessonsData,
    courseTitleUserIsOn
  ) {
    const unlockedQuizzes = [];

    const userProgress =
      progressData &&
      progressData.find(
        (progress) => progress.courseProgress === courseTitleUserIsOn
      );
    if (userProgress) {
      simplifiedChaptersLessonsData &&
        simplifiedChaptersLessonsData.forEach((chapter) => {
          const lastLessonNumber =
            chapter.lessons[chapter.lessons.length - 1].lessonNumber;
          const isLastLessonCompleted =
            userProgress.lessonProgress.includes(lastLessonNumber);
          if (isLastLessonCompleted) {
            unlockedQuizzes.push(chapter.chapterNumber);
          }
        });
    }

    return unlockedQuizzes;
  }

  function generateUnlockedChapters(
    simplifiedChaptersLessonsData,
    unlockedLessons
  ) {
    const unlockedChapters = [];

    simplifiedChaptersLessonsData &&
      simplifiedChaptersLessonsData.forEach((chapter) => {
        const hasUnlockedLesson = chapter.lessons.some((lesson) =>
          unlockedLessons.includes(lesson.lessonNumber)
        );
        if (hasUnlockedLesson) {
          unlockedChapters.push(chapter.chapterNumber);
        }
      });

    return unlockedChapters;
  }

  // Generate the arrays
  const unlockedQuizzes = generateUnlockedQuizzes(
    progressData,
    simplifiedChaptersLessonsData,
    courseTitleUserIsOn
  );
  const unlockedChapters = generateUnlockedChapters(
    simplifiedChaptersLessonsData,
    unlockedLessons
  );

  // Log the results
  console.log(unlockedQuizzes);
  console.log(unlockedChapters);

  // Find the progress data for the current chapter

  const courseProgressData =
    progressData &&
    progressData.find(
      (progress) => progress.courseProgress === props.courseTitleUserIsOn
    );

  console.log(courseProgressData);

  // Find the chapter progress data for the current course
  const chapterProgressDataAgain =
    chapterProgressData &&
    chapterProgressData.find(
      (progress) => progress.courseProgress === props.courseTitleUserIsOn
    );

  console.log(chapterProgressDataAgain);

  // Get the lessons the user has completed
  const completedLessons = new Set(courseProgressData?.lessonProgress || []);
  console.log(completedLessons);

  // Get the chapters the user has completed
  const completedChapters = new Set(
    chapterProgressDataAgain?.chapterProgress || []
  );
  console.log(completedChapters);
  // Calculate total number of lessons in the chapter
  const chapterNumber = props.lessonNumber
    ? props.lessonNumber.substring(0, props.lessonNumber.lastIndexOf("."))
    : props.chapterNumber;
  console.log(chapterNumber);

  const chapterData =
    simplifiedChaptersLessonsData &&
    simplifiedChaptersLessonsData.find(
      (chapter) => chapter.chapterNumber === chapterNumber
    );
  console.log(chapterData);

  const totalLessonsInChapter = chapterData?.lessons.length || 0;
  console.log(totalLessonsInChapter);

  // Calculate total number of quizzes for the chapter
  const totalQuizzesCompletedInChapter = completedChapters.has(chapterNumber)
    ? 1
    : 0;
  console.log(totalQuizzesCompletedInChapter);

  // Calculate total number of completed lessons and quizzes
  // Calculate total number of completed lessons in the chapter
  let completedCount = 0;
  chapterData?.lessons.forEach((lesson) => {
    if (completedLessons.has(lesson.lessonNumber)) {
      completedCount++;
    }
  });

  console.log(completedCount);

  // Calculate percentage of chapter completed and round up
  const percentage = Math.ceil(
    ((completedCount + totalQuizzesCompletedInChapter) /
      (totalLessonsInChapter + 1)) *
      100
  );

  //Note the 1 in the dinominator takes into account that each chapter has one quiz (Total Lessons and Quzzies completed over total lessons and quizzes in the chapter)

  console.log(percentage);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "100%",
          marginLeft: "7%",
        }}
      >
        <div style={{ flex: 1, backgroundColor: "#f0f0f0", borderRadius: 20 }}>
          <motion.div
            style={{
              width: `${percentage}%`,
              backgroundColor: "rgb(80, 200, 120)",
              height: 10,
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

export default ChapterProgressBarMini;
