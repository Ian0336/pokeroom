import React, { useState, useEffect, useContext } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase.js";
import { Link, useNavigate } from "react-router-dom";
import pokemonList from "../../img/data.js";
import {
  Button,
  Icon,
  Transition,
  Grid,
  Modal,
  Header,
} from "semantic-ui-react";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";

const FillData = (props) => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [avatar, setAvatar] = useState("001.png");

  const [firstRender, setFirstRender] = useState(false);
  const [email, setEmail] = useState("Google");
  const [name, setName] = useState("");

  const [myStyle, setMyStyle] = useState({
    backgroundImage: `url(${require("../../img/pokemonImg/001.png")})`,
  });

  useEffect(() => {
    setAvatar(getRandomPokemon());
    setFirstRender(true);

    getUsers();
    return () => {};
  }, []);

  useEffect(() => {
    const imageUrl = require(`../../img/pokemonImg/${avatar}`);

    setMyStyle({
      ...myStyle,
      backgroundImage: `url(${imageUrl})`,
    });

    return () => {};
  }, [avatar]);

  async function getUsers() {
    const snapshot = await getDocs(collection(db, "user"));
    let tmp = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      tmp[id] = data;
      // 將文件ID和文件資料存入tmp物件中
    });

    return tmp;
  }
  async function addUser(id) {
    const newDocRef = doc(db, "user", `${id}`);
    await setDoc(newDocRef, {
      name: name,
      avatar: avatar,
      email: props.user.email,
      color: "blue",
      rooms: ["Lobby"],
    });
  }

  const handleName = async () => {
    let users = await getUsers();

    if (users === undefined) {
      setErrorMsg("Cannot connet to database");
      setErrorPrompt(true);
      setSubmitLoading(false);
      return -1;
    }
    if (name === "") {
      setErrorMsg("You need to fill up your Name");
      setErrorPrompt(true);
      setSubmitLoading(false);

      return -1;
    }
    let err = 0;
    Object.values(users).forEach((user) => {
      if (user.name === name) {
        setErrorMsg(`${name} is used`);
        setErrorPrompt(true);
        setSubmitLoading(false);
        setName("");
        err = -1;
      }
    });
    return err;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitLoading(true);
    let result = await handleName();

    if (result !== -1) {
      addUser(props.user.uid);
      navigate("/");
    }
    setSubmitLoading(false);
  };

  function getRandomPokemon() {
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    const randomPokemon = pokemonList[randomIndex];
    return randomPokemon;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Grid centered columns={1} verticalAlign="middle">
        <Transition animation={"zoom"} duration={500} visible={firstRender}>
          <Grid.Row>
            <Grid.Column>
              <form onSubmit={handleSubmit} className="signupForm">
                <div alt="avatar" style={myStyle} className="avatar">
                  <Button
                    type="button"
                    icon="repeat"
                    className="repeatBtn"
                    circular
                    size="mini"
                    onClick={() => setAvatar(getRandomPokemon())}
                  />
                </div>
                <div className="inputGroup inputGroup1">
                  <label htmlFor="name" className="emailLabel">
                    Name<p className="helper helper1">Name</p>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onFocus={(event) =>
                      event.target.parentElement.classList.add("focusWithText")
                    }
                    onBlur={(event) => {
                      if (name.length === 0)
                        event.target.parentElement.classList.remove(
                          "focusWithText"
                        );
                    }}
                  />
                </div>

                <div className="inputGroup inputGroup3">
                  <Button
                    inverted
                    color="blue"
                    type="submit"
                    id="login"
                    className="submitBtn"
                    size="massive"
                    loading={submitLoading}
                  >
                    Go Chat !
                  </Button>
                </div>
              </form>
            </Grid.Column>
          </Grid.Row>
        </Transition>
      </Grid>
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
    </div>
  );
};
export default FillData;
