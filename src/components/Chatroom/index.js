import React, { useState, useEffect, useContext } from "react";
import { colorContext } from "../../pages/Mainpage";
import {
  Comment,
  Header,
  Form,
  Icon,
  Modal,
  Button,
  Confirm,
  Grid,
  Dropdown,
} from "semantic-ui-react";
import { storage, db } from "../../firebase/firebase.js";
import {
  updateDoc,
  doc,
  collection,
  getDoc,
  onSnapshot,
  arrayUnion,
  Timestamp,
  arrayRemove,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import "./index.scss";
import Msg from "../Msg/index.js";
import Addothers from "../Addothers/index.js";
import Pokewalk from "../Pokewalk/index.js";
import axios from "axios";
import Tenor from "../Tenor";
const Chatroom = (props) => {
  const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";
  const API_KEY = "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";
  const { color } = useContext(colorContext);
  const [chats, setChats] = useState([]);
  const [oddChat, setOddChat] = useState(0);
  const [saySth, setSaySth] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [addOthers, setAddOthers] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [callAI, setCallAI] = useState(false);
  const [users, setUsers] = useState([]);
  const [img, setImg] = useState(null);
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    setChats([]);
    getUsersInRoom();
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "chatRooms", props.nowRoom), (doc) => {
        if (doc.data() === undefined) return;
        const chatsWithKey = doc.data().chats.map((chat, index) => {
          return { ...chat, key: index }; // 加上 key 屬性
        });

        setChats(chatsWithKey);
      });

      return () => {
        unsub(); // 在清除函数中调用 unsub 函数
      };
    };

    if (props.nowRoom !== undefined) {
      const unsubscribe = getChats(); // 保存清除函数
      return () => {
        unsubscribe(); // 在 useEffect 返回的清除函数中调用 getChats 返回的清除函数
      };
    }
  }, [props.nowRoom]);

  useEffect(() => {
    if (oddChat !== 0 && chats.length > oddChat) {
      if (chats[chats.length - 1].id !== props.data.id) {
        sendAlert(chats[chats.length - 1]);
      }
    }
    setOddChat(chats.length);
    return () => {};
  }, [chats]);

  useEffect(() => {
    if (img) setCallAI(false);
    return () => {};
  }, [img]);

  async function getUsersInRoom() {
    if (props.nowRoom === "Lobby") {
      const snapshot = await getDocs(collection(db, "user"));
      let tmp = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;

        tmp.push({
          id: id,
          name: data.name,
        });
        // 將文件ID和文件資料存入tmp物件中
      });
      setUsers(tmp);
    } else {
      const lobbyDocRef = doc(collection(db, "chatRooms"), props.nowRoom);
      const lobbyDocSnapshot = await getDoc(lobbyDocRef);
      const lobbyDocData = lobbyDocSnapshot.data();
      const members = lobbyDocData.member;

      setUsers(members);
    }
  }
  async function addChat() {
    if (img) {
      const storageRef = ref(storage, img.name);

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
          }
        },
        (error) => {
          //TODO:Handle Error
          console.log("error");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chatRooms", props.nowRoom), {
              chats: arrayUnion({
                content: saySth,
                type: "img",
                id: props.data.id,
                time: Timestamp.now(),
                img: downloadURL,
                avatar: props.data.avatar,
                name: props.data.name,
              }),
            });
          });
        }
      );
    } else {
      const chatRef = doc(db, "chatRooms", `${props.nowRoom}`);
      await updateDoc(chatRef, {
        chats: arrayUnion({
          content: callAI ? "@多邊獸 " + saySth : saySth,
          name: props.data.name,
          time: Timestamp.now(),
          avatar: props.data.avatar,
          type: "text",
          id: props.data.id,
        }),
      });
    }
  }
  async function sendAlert(msg) {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification

      const options = {
        title: msg.name,
        body: msg.content,
        // image: 'image.jpg'
      };
      const notification = new Notification(msg.name, options);
    } else if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification(msg.name, {
            title: msg.name,
            body: msg.content,
            // image: 'image.jpg'
          });
          // …
        }
      });
    }
  }
  async function removeUser() {
    const chatRef = doc(db, "chatRooms", props.nowRoom);
    await updateDoc(chatRef, {
      member: arrayRemove({ id: props.data.id, name: props.data.name }),
    });
    const lobbyDocRef = doc(collection(db, "chatRooms"), props.nowRoom);
    const lobbyDocSnapshot = await getDoc(lobbyDocRef);
    const lobbyDocData = lobbyDocSnapshot.data();
    const members = lobbyDocData.member;

    if (members.length === 0) deleteDoc(lobbyDocRef);
  }
  async function removeRoom() {
    const chatRef = doc(db, "user", props.data.id);
    await updateDoc(chatRef, {
      rooms: arrayRemove(props.nowRoom),
    });
  }
  async function leave() {
    await removeUser();
    await removeRoom();
    props.setNowRoom("Lobby");
  }
  async function generateText(prompt) {
    try {
      // 構建請求內容
      const client = axios.create({
        headers: {
          Authorization: "Bearer " + API_KEY,
        },
      });
      const params = {
        prompt: prompt,
        model: "text-davinci-003",
        max_tokens: 100,
        temperature: 0,
      };

      const response = await client.post(
        "https://api.openai.com/v1/completions",
        params
      );

      // 發送POST請求，傳遞請求內容和金鑰

      console.log(response.data);
      // 返回模型生成的文本

      const chatRef = doc(db, "chatRooms", `${props.nowRoom}`);
      await updateDoc(chatRef, {
        chats: arrayUnion({
          content: `@${props.data.name} ${response.data.choices[0].text}`,
          name: "多邊獸",
          time: Timestamp.now(),
          avatar: "137.png",
          type: "text",
          id: "haha",
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }
  const handleSubmit = async () => {
    setIsSending(true);
    if (saySth !== "") {
      await addChat();
      if (callAI) await generateText(saySth);
    }

    setSaySth("");
    setImg(null);
    setCallAI(false);

    setIsSending(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
      id="chatroomSize"
    >
      {users &&
        users.map((user) => {
          return <Pokewalk id={user.id}></Pokewalk>;
        })}

      <Comment.Group
        className="chatroomSize"
        style={{ maxWidth: "1900px", width: "90%", marginTop: "0px" }}
      >
        <Header as="h1" dividing textAlign="center" style={{ zIndex: 2 }}>
          {props.nowRoom}
          {props.nowRoom !== "Lobby" ? (
            <>
              <Icon
                name="sign-out"
                link
                inverted
                circular
                color={color}
                className="chatroomIcon "
                style={{ float: "right", fontSize: "0.6em" }}
                onClick={() => setConfirm(true)}
              />
              <Icon
                name="user plus"
                link
                inverted
                circular
                color={color}
                className="chatroomIcon"
                style={{
                  float: "right",
                  fontSize: "0.6em",
                  marginRight: "10px",
                }}
                onClick={() => setAddOthers(true)}
              />
            </>
          ) : (
            <></>
          )}
        </Header>

        <div
          style={{
            height: "70vh",
            margin: "0",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {chats.map((li) => (
            <Msg msg={li} isMine={li.id === props.data.id} />
          ))}
        </div>

        <Grid centered>
          <Grid.Row width={2}>
            <Grid.Column width={14}>
              <Form reply onSubmit={handleSubmit} loading={isSending}>
                <Form.Input
                  icon={
                    <Icon
                      name="send"
                      inverted
                      circular
                      link
                      color={color}
                      onClick={handleSubmit}
                    />
                  }
                  placeholder="Say something..."
                  onChange={(event) => {
                    if (img) {
                      if (img !== null && event.target.value !== img.name) {
                        setSaySth("");
                        setImg(null);
                      }
                    } else setSaySth(event.target.value);
                  }}
                  value={saySth}
                />{" "}
              </Form>
            </Grid.Column>
            <Grid.Column
              width={2}
              verticalAlign="middle"
              style={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
              <Dropdown
                trigger={
                  <Icon name="list alternate" link circular color={color} />
                }
                pointing="top right"
                icon={null}
              >
                <Dropdown.Menu>
                  {" "}
                  <Dropdown.Item as="label" for="upload">
                    <input
                      name="image"
                      type="file"
                      id="upload"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setImg(e.target.files[0]);
                          setSaySth(e.target.files[0].name);
                        }
                      }}
                      onClick={(e) => {
                        if (e.target.files[0]) {
                          setImg(e.target.files[0]);
                          setSaySth(e.target.files[0].name);
                        }
                      }}
                    />
                    <label for="upload">
                      <Icon name="image" color={color} link circular></Icon>
                    </label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setShowGif(true);
                    }}
                  >
                    <Icon
                      name="object ungroup outline"
                      color={color}
                      link
                      circular
                    ></Icon>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Icon
                name="android"
                color={color}
                link
                inverted={callAI}
                circular
                bordered={false}
                onClick={() => {
                  setCallAI((pre) => !pre);
                }}
              ></Icon>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Comment.Group>
      <Confirm
        open={confirm}
        content={"Are you sure to leave " + props.nowRoom + " ?"}
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          leave();
          setConfirm(false);
        }}
      />
      <Tenor {...props} showGif={showGif} setShowGif={setShowGif}></Tenor>
      <Modal onClose={() => setAddOthers(false)} open={addOthers}>
        <Modal.Content style={{ display: "flex", justifyContent: "center" }}>
          <Addothers {...props} close={setAddOthers}></Addothers>
        </Modal.Content>

        <Modal.Actions>
          <Button
            onClick={() => {
              setAddOthers(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Chatroom;
