import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

function LottieAnimation(props) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Replace with the URL of your S3 object
    const animationUrl = props.lottieFile;

    fetch(animationUrl)
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error fetching animation:", error));
  }, []);

  return (
    <motion.div
      className={props.className}
      style={props.style}
      initial={props.initial}
      animate={props.animate}
      exit={props.exit}
      transition={props.transition}
    >
      {animationData && (
        <Lottie
          animationData={animationData}
          speed={props.speed}
          loop={props.loop}
        />
      )}
    </motion.div>
  );
}

export default LottieAnimation;
