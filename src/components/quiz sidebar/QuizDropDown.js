import React, { useState } from "react";
import QuizSideNavRow from "./QuizSideNavRow";
import { Transition } from "react-transition-group";

export default function QuizDropDown(props) {
  const [openDropDown, setOpenDropDown] = useState(false);
  let arrowDirection = "fas fa-chevron-down";

  if (!openDropDown) {
    arrowDirection = "fas fa-chevron-down";
  } else {
    arrowDirection = "fas fa-chevron-up";
  }

  return (
    <>
      <Transition
        mountOnEnter
        unmountOnExit
        in={openDropDown}
        timeout={{ enter: 300, exit: 200 }}
      >
        {(state) => (
          <div
            className="sidenavContainer"
            style={
              state === "entering"
                ? {
                    animation: "dropDown .3s forwards",
                    height: `${51 * props.entries.length}px`,
                  }
                : state === "entered"
                ? {
                    transform: "scaleY(1)",
                    opacity: "1",
                    height: `${51 * props.entries.length}px`,
                  }
                : {
                    animation: "dropDown .2s reverse backwards",
                    transition: "height 0.2s",
                  }
            }
          >
            <hr />
            {props.entries.map((entry) => (
              <QuizSideNavRow text={entry.title} />
            ))}
          </div>
        )}
      </Transition>
      <div
        className="sidenavRowDropdown"
        onClick={() => setOpenDropDown((prevState) => !prevState)}
      >
        <div>See All</div>
        <i className={arrowDirection}></i>
      </div>
    </>
  );
}
