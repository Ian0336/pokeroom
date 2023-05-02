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

const Addothers = (props) => {
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
    getUsers();
    return () => {};
  }, []);

  async function getUsersInRoom() {
    const lobbyDocRef = doc(collection(db, "chatRooms"), props.nowRoom);
    const lobbyDocSnapshot = await getDoc(lobbyDocRef);
    const lobbyDocData = lobbyDocSnapshot.data();
    const members = lobbyDocData.member;
    return members;
  }
  async function getUsers() {
    setIsFetching(true);
    const userInRoom = await getUsersInRoom();

    const snapshot = await getDocs(collection(db, "user"));
    let tmp = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      if (
        props.data !== undefined &&
        !userInRoom.some((user) => user.name === data.name && user.id === id)
      )
        tmp.push({
          key: data.name,
          value: { name: data.name, id: id },
          text: data.name,
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

  async function userRoomAdd(mem) {
    const chatRef = doc(db, "user", mem.id);
    await updateDoc(chatRef, {
      rooms: arrayUnion(props.nowRoom),
    });
    const newDocRef = doc(db, "chatRooms", props.nowRoom);
    await updateDoc(newDocRef, {
      member: arrayUnion(mem),
    });
  }

  const handleSubmit = async () => {
    setSubmitLoading(true);
    for (let mem of value) {
      await userRoomAdd(mem);
    }
    setSubmitLoading(false);
    props.close(false);
  };
  return (
    <>
      <Form style={{ width: "90%" }} onSubmit={handleSubmit}>
        <Form.Field>
          <label>Add Members</label>
          <Dropdown
            fluid
            selection
            multiple={multiple}
            search={search}
            options={options}
            value={value}
            placeholder="Add Users"
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
          Add
        </Button>
      </Form>
    </>
  );
};

export default Addothers;
