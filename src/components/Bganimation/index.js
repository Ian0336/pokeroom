import React from "react";
import "./index.css";
const Bganmation = (props) => {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "absolute" }}>
      <div className="box">
        <div className="head-outline"></div>
        <div className="head" id="head">
          <div className="face-1"></div>
          <div className="face-1-outline"></div>
          <div className="face-2"></div>
          <div className="face-2-outline"></div>
          <div className="eye-1"></div>
          <div className="eye-2"></div>
          <div className={props.wake ? "mouthOpen" : "mouth"} id="mouth"></div>
          <div
            className={props.wake ? "tongueOpen" : "tongue"}
            id="tongue"
          ></div>

          <div
            className={props.wake ? "left-tooth-open" : "left-tooth"}
            id="left-tooth"
          ></div>

          <div
            className={props.wake ? "right-tooth-open" : "right-tooth"}
            id="right-tooth"
          ></div>
        </div>
        {props.wake ? (
          <></>
        ) : (
          <>
            <div style={{ "--i": 1 }} className="snorl snorl-1">
              Z
            </div>
            <div style={{ "--i": 2 }} className="snorl snorl-2">
              Z
            </div>
            <div style={{ "--i": 3 }} className="snorl snorl-3">
              Z
            </div>
          </>
        )}

        <div className="ear-left"></div>
        <div className="ear-right"></div>
      </div>
    </div>
  );
};

export default Bganmation;
