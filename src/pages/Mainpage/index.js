import React, { useState, useEffect, createContext } from "react";
import { Transition, Grid } from "semantic-ui-react";
import Functionbar from "../../components/Functionbar";
import Chatroomlist from "../../components/Chatroomlist";
import Chatroom from "../../components/Chatroom";
import "./index.scss";
import { auth, db } from "../../firebase/firebase.js";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import Pokewalk from "../../components/Pokewalk";

export const colorContext = createContext();

const Mainpage = (props) => {
  const [changeProfile, setChangeProfile] = useState(false);
  const [color, setColor] = useState("blue");
  const [transition, setTransition] = useState(false);
  const [userData, setUserData] = useState({});
  const [nowRoom, setNowRoom] = useState("Lobby");
  useEffect(() => {
    setTransition(true);
    document.getElementById("root").style.backgroundColor = "white";
    props.uid && getUserData(props.uid);

    return () => {};
  }, []);
  useEffect(() => {
    userData.id && updateUser();
    return () => {};
  }, [changeProfile]);

  async function updateUser() {
    const lobbyDocRef = doc(collection(db, "user"), userData.id);
    const lobbyDocSnapshot = await getDoc(lobbyDocRef);
    const lobbyDocData = lobbyDocSnapshot.data();
    setUserData({ ...lobbyDocData, id: userData.id });
  }
  async function getUserData(id) {
    const snapshot = await getDocs(collection(db, "user"));
    let tmp = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      tmp[id] = data;

      // 將文件ID和文件資料存入tmp物件中
    });
    tmp[id] = { ...tmp[id], id: id };
    setUserData(tmp[id]);
    setColor(tmp[id].color);
    return;
  }

  return (
    <colorContext.Provider value={{ color, setColor }}>
      <Grid divided>
        <Grid.Row centered>
          <Transition
            animation={"fly down"}
            duration={500}
            visible={transition}
          >
            <Grid.Column width={16}>
              <Functionbar
                data={userData}
                setNowRoom={setNowRoom}
                nowRoom={nowRoom}
                setChanged={setChangeProfile}
              />
            </Grid.Column>
          </Transition>
        </Grid.Row>

        <Grid.Row centered>
          <Grid.Column
            width={4}
            className="tablet-and-desktop-only"
            textAlign="center"
            style={{ display: "none!important" }}
            media={{ minWidth: "992px" }}
          >
            <Transition
              animation={"fly right"}
              duration={1000}
              visible={transition}
              style={{ display: "none!important" }}
              media={{ minWidth: "992px" }}
            >
              <div>
                <Chatroomlist
                  data={userData}
                  setNowRoom={setNowRoom}
                  nowRoom={nowRoom}
                />
              </div>
            </Transition>
          </Grid.Column>

          <Grid.Column computer={12} tablet={16} mobile={16}>
            <Chatroom
              data={userData}
              nowRoom={nowRoom}
              setNowRoom={setNowRoom}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </colorContext.Provider>
  );
};
export default Mainpage;
