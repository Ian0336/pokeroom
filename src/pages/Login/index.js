import React, { useState, useEffect, useContext } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase.js";
import { updateDoc, doc, collection, getDocs } from "firebase/firestore";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";

import { Button, Icon, Transition, Grid, Modal } from "semantic-ui-react";
import FillData from "../../components/Filldata/index.js";
import Bganmation from "../../components/Bganimation/index.js";

const Login = (props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [googleAccountInit, setGoogleAccountInit] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loginGoogle, setLoginGoogle] = useState(false);
  const [firstRender, setFirstRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focus, setFocus] = useState(false);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    setFirstRender(true);
    document.getElementById("root").style.backgroundColor = "#29738f";
    if (props.user) navigate("/");
    return () => {};
  }, []);

  async function existUsers(id) {
    const snapshot = await getDocs(collection(db, "user"));
    let tmp = {};
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      tmp[id] = data;
      // 將文件ID和文件資料存入tmp物件中
    });

    let ans = false;

    Object.keys(tmp).forEach((uid) => {
      if (uid === id) ans = true;
    });

    return ans;
  }
  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitLoading(true);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
      .then((userCredential) => {
        // 用戶登入成功
        const user = userCredential.user;
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMsg(error.message);
        setErrorPrompt(true);
        setSubmitLoading(false);
        if (
          error.code === "auth/invalid-email" ||
          error.code === "auth/user-not-found"
        ) {
          setEmail("");
          setPassword("");
        }

        // 如果密碼有問題，清空 password 狀態
        if (error.code === "auth/wrong-password") {
          setPassword("");
        }
        // 處理錯誤
      });
    setSubmitLoading(false);
  };
  const handleSignIn = async () => {
    setLoginGoogle(true);
    let result = await signInWithPopup(auth, provider).catch((error) => {
      console.error(error);
      setErrorMsg(error.message);
      setErrorPrompt(true);
      setLoginGoogle(false);
      return;
    });

    let exist = await existUsers(result.user.uid);
    setUser(result.user);
    setLoginGoogle(false);
    if (!exist) setGoogleAccountInit(true);
    else navigate("/");
  };

  return (
    <>
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
          opacity: loginGoogle || submitLoading ? "0" : focus ? ".82" : ".7",
        }}
      >
        {googleAccountInit ? (
          <FillData user={user} />
        ) : (
          <Grid centered columns={1} verticalAlign="middle">
            <Transition animation={"zoom"} duration={500} visible={firstRender}>
              <Grid.Row>
                <Grid.Column>
                  <form onSubmit={handleLogin} className="loginForm">
                    <div className="inputGroup inputGroup1">
                      <label htmlFor="email1">Email</label>
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
                      <p className="helper helper1">email@domain.com</p>
                      <span className="indicator"></span>
                    </div>
                    <div className="inputGroup inputGroup2">
                      <label htmlFor="password">
                        Password
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
                      <Button
                        inverted
                        color="blue"
                        type="submit"
                        id="login"
                        className="submitBtn"
                        size="massive"
                        loading={submitLoading}
                        disabled={submitLoading}
                      >
                        Log in
                      </Button>
                    </div>
                    <div className="inputGroup inputGroup3">
                      <Button
                        inverted
                        color="blue"
                        type="button"
                        id="loginWithGoogle"
                        className="submitBtn"
                        size="massive"
                        loading={loginGoogle}
                        icon={"google"}
                        content="Log in with google"
                        onClick={handleSignIn}
                        disabled={loginGoogle}
                      ></Button>
                    </div>
                    <Link to="/signup" className="signupText">
                      Sign Up
                    </Link>
                  </form>
                </Grid.Column>
              </Grid.Row>
            </Transition>
          </Grid>
        )}

        <Modal
          onClose={() => setErrorPrompt(false)}
          open={errorPrompt}
          size="small"
          centered
          basic
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
export default Login;
