import React, { useState, useEffect, useContext } from "react";
import { colorContext } from "../../pages/Mainpage";
import {
  Modal,
  Icon,
  Button,
  Form,
  Dropdown,
  Checkbox,
} from "semantic-ui-react";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.js";

const Createroom = (props) => {
  const { color } = useContext(colorContext);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
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

  async function getUsers() {
    setIsFetching(true);

    const snapshot = await getDocs(collection(db, "user"));
    let tmp = [];
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      if (props.data !== undefined && id !== props.data.id)
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
  async function checkSameName() {
    const snapshot = await getDocs(collection(db, "chatRooms"));
    let tmp = false;
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      if (id === newRoomName) tmp = true;
      // 將文件ID和文件資料存入tmp物件中
    });

    return tmp;
  }
  const create = async () => {
    const newDocRef = doc(db, "chatRooms", `${newRoomName}`);
    await setDoc(newDocRef, {
      chats: [],
      member: [...value, { name: props.data.name, id: props.data.id }],
      private: isPrivate,
    });
  };

  async function userRoomAdd(id) {
    const chatRef = doc(db, "user", id);
    await updateDoc(chatRef, {
      rooms: arrayUnion(newRoomName),
    });
  }
  const handleSubmit = async () => {
    setSubmitLoading(true);
    if (newRoomName === "") {
      setErrorMsg("Fill the Room Name !!!");
      setErrorPrompt(true);
      setSubmitLoading(false);
      return;
    }
    let res = await checkSameName();
    if (res) {
      setErrorMsg(newRoomName + "is used");
      setNewRoomName("");
      setErrorPrompt(true);
      setSubmitLoading(false);
      return;
    }
    let tmp = 0;
    let ress = await create().catch((err) => {
      setNewRoomName("");
      setErrorMsg(err.message);
      setErrorPrompt(true);
      setSubmitLoading(false);
      tmp = 1;
    });
    if (tmp) return;

    await userRoomAdd(props.data.id);
    for (let mem of value) {
      await userRoomAdd(mem.id);
    }
    setSubmitLoading(false);
    props.close();
  };
  return (
    <>
      <Form style={{ width: "90%" }} onSubmit={handleSubmit}>
        <Form.Field>
          <label>Room Name</label>
          <input
            placeholder="Room Name"
            onChange={(e) => {
              setNewRoomName(e.target.value);
            }}
            value={newRoomName}
          />
        </Form.Field>
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
        <Form.Field>
          <Checkbox
            label="Private"
            slider
            onChange={(e, data) => setIsPrivate(data.checked)}
            checked={isPrivate}
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
          Create
        </Button>
      </Form>
      <Modal
        basic
        onClose={() => setErrorPrompt(false)}
        open={errorPrompt}
        size="small"
      >
        <Modal.Content>{errorMsg}</Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={() => setErrorPrompt(false)}>
            <Icon name="checkmark" /> confirm
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Createroom;
