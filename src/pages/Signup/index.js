import React, { useState, useEffect, useContext } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase.js";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import pokemonList from "../../img/data.js";
import Bganmation from "../../components/Bganimation/index.js";
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

const Signup = (props) => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [avatar, setAvatar] = useState("001.png");
  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [firstRender, setFirstRender] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focus, setFocus] = useState(false);
  const [myStyle, setMyStyle] = useState({
    backgroundImage: `url(${require("../../img/pokemonImg/001.png")})`,
  });

  useEffect(() => {
    setAvatar(getRandomPokemon());
    setFirstRender(true);
    document.getElementById("root").style.backgroundColor = "#29738f";
    getUsers();
    if (props.user) navigate("/");
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
      email: email,
      color: "blue",
      rooms: ["Lobby"],
    });
  }

  const handleConfirm = async () => {
    setSubmitLoading(true);

    if (password !== confirmPassword) {
      setErrorMsg("Confirm Password is not correct !");
      setErrorPrompt(true);
      setSubmitLoading(false);
      setConfirmPassword("");
      return -1;
    }

    return 0;
  };
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
  const handleSignup = async () => {
    setSubmitLoading(true);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
      .then((userCredential) => {
        // 新用戶註冊成功

        const user = userCredential.user;
        addUser(user.uid);
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMsg(error.message);
        setErrorPrompt(true);
        setSubmitLoading(false);
        if (error.code === "auth/invalid-email") {
          setEmail("");
        }

        // 如果密碼有問題，清空 password 狀態
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/weak-password"
        ) {
          setPassword("");
          setConfirmPassword("");
        }
        // 處理錯誤
      });
    setSubmitLoading(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let result = await handleConfirm();
    if (result !== -1) result = await handleName();

    if (result !== -1) handleSignup();
  };

  function getRandomPokemon() {
    const randomIndex = Math.floor(Math.random() * pokemonList.length);
    const randomPokemon = pokemonList[randomIndex];
    return randomPokemon;
  }

  return (
    <>
      {" "}
      <Transition animation={"zoom"} duration={1000} visible={firstRender}>
        <div>
          <Bganmation wake={focus}></Bganmation>
        </div>
      </Transition>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          opacity: submitLoading ? "0" : focus ? ".82" : ".7",
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
                      onFocus={(event) => {
                        setFocus(true);
                        event.target.parentElement.classList.add(
                          "focusWithText"
                        );
                      }}
                      onBlur={(event) => {
                        setFocus(false);
                        if (name.length === 0)
                          event.target.parentElement.classList.remove(
                            "focusWithText"
                          );
                      }}
                    />
                  </div>
                  <div className="inputGroup inputGroup1">
                    <label htmlFor="email1" className="emailLabel">
                      Email<p className="helper helper1">email@domain.com</p>
                    </label>
                    <input
                      type="text"
                      id="email"
                      className="email"
                      maxLength="256"
                      onFocus={(event) => {
                        setFocus(true);
                        event.target.parentElement.classList.add(
                          "focusWithText"
                        );
                      }}
                      onBlur={(event) => {
                        setFocus(false);
                        if (email.length === 0)
                          event.target.parentElement.classList.remove(
                            "focusWithText"
                          );
                      }}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <div className="inputGroup inputGroup3">
                    <label htmlFor="password" className="emailLabel">
                      Password{" "}
                      <Icon
                        name="eye"
                        className="passwordVisible"
                        style={{ opacity: visible ? 1 : 0.3 }}
                        onClick={() => setVisible(!visible)}
                      />
                    </label>
                    <input
                      type={visible ? "text" : "password"}
                      id="password"
                      className="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onFocus={(event) => setFocus(true)}
                      onBlur={(event) => setFocus(false)}
                    />
                  </div>
                  <div className="inputGroup inputGroup3">
                    <label htmlFor="password" className="emailLabel">
                      Confirm Password{" "}
                      <Icon
                        name="eye"
                        className="passwordVisible"
                        style={{ opacity: visibleConfirm ? 1 : 0.3 }}
                        onClick={() => setVisibleConfirm(!visibleConfirm)}
                      />
                    </label>
                    <input
                      type={visibleConfirm ? "text" : "password"}
                      id="password"
                      className="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      onFocus={(event) => setFocus(true)}
                      onBlur={(event) => setFocus(false)}
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
                      Sign up
                    </Button>
                  </div>
                  <Link to="/login" className="loginText">
                    Already has an account
                  </Link>
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
            <Button
              color="green"
              inverted
              onClick={() => setErrorPrompt(false)}
            >
              <Icon name="checkmark" /> confirm
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    </>
  );
};
export default Signup;
