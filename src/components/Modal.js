import React, { useState } from "react";
import { motion } from "framer-motion";

const Modal = ({ isVisible, onClose, title, message, onSubmit }) => {
  const [feedback, setFeedback] = useState("");

  const handleFeedbackChange = (e) => setFeedback(e.target.value);

  const handleSubmit = () => {
    onSubmit(feedback);
    setFeedback(""); // Clear the input after submission
  };

  if (!isVisible) return null;

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h2>{title}</h2>
        <p>{message}</p>
        <textarea
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Enter your feedback here..."
          style={textareaStyle}
        />
        <div style={buttonContainerStyle}>
          <button onClick={handleSubmit} style={submitButtonStyle}>
            Submit
          </button>
          <button onClick={onClose} style={closeButtonStyle}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "5px",
  maxWidth: "500px",
  width: "100%",
};

const textareaStyle = {
  width: "100%",
  height: "100px",
  marginTop: "10px",
  marginBottom: "10px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const submitButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const closeButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "red",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Modal;
