import React, { useState, useEffect, useContext } from "react";
import { colorContext } from "../../pages/Mainpage";
import { Modal, Icon, Button, Form, Dropdown } from "semantic-ui-react";
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
const Joinroom = (props) => {
  const { color } = useContext(colorContext);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [multiple, setMultiple] = useState(true);
  const [search, setSearch] = useState(true);
  const [searchQuery, setSearchQuery] = useState(null);
  const [value, setValue] = useState([]);
  const [options, setOptions] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");

  useEffect(() => {
    getRooms();
    return () => {};
  }, []);

  async function getUsersRoom() {
    const lobbyDocRef = doc(collection(db, "user"), props.data.id);
    const lobbyDocSnapshot = await getDoc(lobbyDocRef);
    const lobbyDocData = lobbyDocSnapshot.data();
    const rooms = lobbyDocData.rooms;
    return rooms;
  }
  async function getRooms() {
    setIsFetching(true);
    const rooms = await getUsersRoom();

    const snapshot = await getDocs(collection(db, "chatRooms"));
    let tmp = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      if (
        props.data !== undefined &&
        !rooms.some((room) => room === id) &&
        !data.private
      )
        tmp.push({
          key: id,
          value: id,
          text: id,
        });
      // 將文件ID和文件資料存入tmp物件中
    });
    setOptions(tmp);
    setIsFetching(false);
    return tmp;
  }

  const handleChange = (e, { value }) => setValue(value);

  const handleSearchChange = (e, { searchQuery }) =>
    setSearchQuery(searchQuery);
  async function userRoomAdd(room) {
    const chatRef = doc(db, "user", props.data.id);
    await updateDoc(chatRef, {
      rooms: arrayUnion(room),
    });
    const newDocRef = doc(db, "chatRooms", room);
    await updateDoc(newDocRef, {
      member: arrayUnion({ id: props.data.id, name: props.data.name }),
    });
  }
  const handleSubmit = async () => {
    setSubmitLoading(true);
    for (let room of value) {
      await userRoomAdd(room);
    }
    setSubmitLoading(false);
    props.close(false);
  };
  return (
    <>
      <Form style={{ width: "90%" }} onSubmit={handleSubmit}>
        <Form.Field>
          <label>Choose a room</label>
          <Dropdown
            fluid
            selection
            multiple={multiple}
            search={search}
            options={options}
            value={value}
            placeholder="Choose a room"
            onChange={handleChange}
            onSearchChange={handleSearchChange}
            disabled={isFetching}
            loading={isFetching}
          />
        </Form.Field>

        <Button
          color={color}
          type="submit"
          style={{
            position: "relative",
            left: "50%",
            transform: "translate(-50%, 0)",
          }}
          loading={submitLoading}
        >
          Join
        </Button>
      </Form>
    </>
  );
};

export default Joinroom;
