import React, { useState, useEffect, useRef } from "react";
import "./index.scss";
import { Button, Popup } from "semantic-ui-react";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  setDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.js";
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // 保存新回調
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 建立 interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Pokewalk = (props) => {
  const [avatar, setAvatar] = useState("001.png");
  const [leftVal, setLeftVal] = useState(0);
  const [topVal, setTopVal] = useState(0);
  const [dir, setDir] = useState("right");
  const [stop, setStop] = useState(false);
  const [stopCount, setStopCount] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    if (data.avatar !== undefined) setAvatar(data.avatar);
    return () => {};
  }, [data]);

  useEffect(() => {
    props.id && getUsersData();
    return () => {};
  }, [props]);
  useEffect(() => {
    if (leftVal > document.querySelector(".chatroomSize").clientWidth) {
      setDir("left");
    }
    if (leftVal < 0) {
      setDir("right");
    }
  }, [leftVal]);
  useEffect(() => {
    if (topVal > document.querySelector(".chatroomSize").clientHeight - 5) {
      setDir("up");
    }
    if (topVal < 0) {
      setStop("down");
    }
  }, [topVal]);
  useEffect(() => {
    let dirs = ["right", "left", "up", "down"];
    if (!stop) setDir(dirs[Math.floor(Math.random() * 4)]);
  }, [stop]);
  useInterval(() => {
    move();
  }, 500);
  const move = () => {
    if (stop) {
      setStopCount((pre) => pre + 1);
      if (stopCount > 1) {
        setStop(false);
        setStopCount(0);
      }
      return;
    }
    if (Math.random() < 0.03) {
      setStop(true);
    }
    if (dir === "right") setLeftVal((pre) => pre + 5);
    else if (dir === "left") setLeftVal((pre) => pre - 5);
    else if (dir === "up") setTopVal((pre) => pre - 5);
    else setTopVal((pre) => pre + 5);
  };

  async function getUsersData() {
    const lobbyDocRef = doc(collection(db, "user"), props.id);
    const lobbyDocSnapshot = await getDoc(lobbyDocRef);
    const lobbyDocData = lobbyDocSnapshot.data();
    setData(lobbyDocData);
  }

  return (
    <>
      <div className="avatar">
        <Popup
          content={data.name}
          trigger={
            <div
              alt="avatar"
              style={{
                backgroundImage: `url(${require("../../img/pokemonImg/" +
                  avatar)})`,
                left: leftVal,
                top: topVal,
              }}
              className={
                dir === "right"
                  ? "pokemonWalk goRight"
                  : dir === "left"
                  ? "pokemonWalk goLeft"
                  : dir === "up"
                  ? "pokemonWalk goUp"
                  : "pokemonWalk goDown"
              }
            />
          }
        />
      </div>
    </>
  );
};

export default Pokewalk;
