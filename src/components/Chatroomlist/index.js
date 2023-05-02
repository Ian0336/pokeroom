import React, { useState, useEffect, useContext } from "react";
import { colorContext } from "../../pages/Mainpage";
import { Menu, Image, Icon, Card, Grid, Header, Meta } from "semantic-ui-react";
import { auth, db } from "../../firebase/firebase.js";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import "./index.scss";
import Addroom from "../Addroom/index.js";
const Chatroomlist = (props) => {
  const { color } = useContext(colorContext);
  const [avatar, setAvatar] = useState("001.png");
  const [data, setData] = useState({});
  const [activeRoom, setActiveRoom] = useState("Lobby");
  const [list, setList] = useState([]);
  const [addRoom, setAddRoom] = useState(false);

  useEffect(() => {
    setActiveRoom(props.nowRoom);
    return () => {};
  }, [props.nowRoom]);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "user", props.data.id), (doc) => {
        setList(doc.data().rooms);
      });

      return () => {
        unsub();
      };
    };

    props.data.id !== undefined && getChats();
  }, [props.data.id]);
  useEffect(() => {
    if (props.data.avatar !== undefined) setAvatar(props.data.avatar);
    if (props.data.avatar !== undefined) setData(props.data);
    return () => {};
  }, [props]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",

        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card color={color}>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={2}>
              <div className="avatar">
                <div
                  alt="avatar"
                  style={{
                    backgroundImage: `url(${require("../../img/pokemonImg/" +
                      avatar)})`,
                  }}
                  className="pokemonProfile"
                />
              </div>
            </Grid.Column>
            <Grid.Column width={14}>
              <Header style={{ marginTop: "10px" }}>{data.name}</Header>
              <div style={{ marginBottom: "20px" }}>{data.email}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card>
      <Menu
        pointing
        vertical
        inverted
        color={color}
        style={{
          width: "90%",
        }}
      >
        <Menu.Header>
          <Icon
            name="add circle"
            size="small"
            link
            inverted
            circular
            color={color}
            onClick={() => {
              setAddRoom(true);
            }}
          />
        </Menu.Header>
        <div
          style={{
            overflow: "auto",
            maxHeight: "75vh",

            overflowX: "hidden",
          }}
        >
          {list.map((li) => (
            <Menu.Item
              name={li}
              active={activeRoom === li}
              onClick={() => {
                setActiveRoom(li);
                props.setNowRoom(li);
              }}
            >
              <span>{li}</span>
            </Menu.Item>
          ))}
        </div>
      </Menu>
      <Addroom
        addRoom={addRoom}
        setAddRoom={setAddRoom}
        data={props.data}
      ></Addroom>
    </div>
  );
};

export default Chatroomlist;
