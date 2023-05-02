import React, { useState, useContext } from "react";
import { colorContext } from "../../pages/Mainpage";
import {
  Menu,
  Icon,
  Dropdown,
  Sidebar,
  Segment,
  Confirm,
  Modal,
  Button,
} from "semantic-ui-react";
import Chatroomlist from "../Chatroomlist";
import { getAuth, signOut } from "firebase/auth";
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

import Changeprofile from "../Changeprofile";
const Functionbar = (props) => {
  const [changeProfile, setChangeProfile] = useState(false);
  const { color, setColor } = useContext(colorContext);
  const [settingShow, setSettingShow] = useState(false);
  const [sideBarShow, setSideBarShow] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const logout = () => {
    const auth = getAuth();
    signOut(auth);
  };
  async function changeColor(color) {
    const chatRef = doc(db, "user", props.data.id);
    await updateDoc(chatRef, {
      color: color,
    });
  }
  const handleChangeColor = async (color) => {
    await changeColor(color);
    setColor(color);
  };
  return (
    <>
      <Menu
        inverted
        color={color}
        secondary
        style={{
          /* backgroundColor: "rgb(112,112,112)", */
          borderRadius: " 0% 0% 30% 30%",
        }}
      >
        <Menu.Item className="mobile-only">
          <Icon
            name="group"
            size="large"
            link
            circular
            onClick={() => {
              setSideBarShow(true);
            }}
          />
        </Menu.Item>
        <Menu.Item position="right">
          <Dropdown
            trigger={
              <Icon
                name="setting"
                size="large"
                link
                circular
                loading={settingShow}
              />
            }
            pointing="top right"
            icon={null}
            onFocus={() => setSettingShow(true)}
            onBlur={() => setSettingShow(false)}
          >
            <Dropdown.Menu>
              <Dropdown
                text="Change Color"
                floating
                button
                className="icon"
                pointing="right"
                icon="angle left"
                style={{
                  backgroundColor: "white",
                }}
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    label={{ color: "red", empty: true, circular: true }}
                    text="red"
                    onClick={() => {
                      handleChangeColor("red");
                    }}
                  />
                  <Dropdown.Item
                    label={{ color: "orange", empty: true, circular: true }}
                    text="orange"
                    onClick={() => {
                      handleChangeColor("orange");
                    }}
                  />
                  <Dropdown.Item
                    label={{ color: "yellow", empty: true, circular: true }}
                    text="yellow"
                    onClick={() => {
                      handleChangeColor("yellow");
                    }}
                  />
                  <Dropdown.Item
                    label={{ color: "olive", empty: true, circular: true }}
                    text="olive"
                    onClick={() => {
                      handleChangeColor("olive");
                    }}
                  />
                  <Dropdown.Item
                    label={{ color: "green", empty: true, circular: true }}
                    text="green"
                    onClick={() => {
                      handleChangeColor("green");
                    }}
                  />

                  <Dropdown.Item
                    label={{ color: "teal", empty: true, circular: true }}
                    text="teal"
                    onClick={() => {
                      handleChangeColor("teal");
                    }}
                  />
                  <Dropdown.Item
                    label={{ color: "violet", empty: true, circular: true }}
                    text="violet"
                    onClick={() => {
                      handleChangeColor("violet");
                    }}
                  />
                  <Dropdown.Item
                    label={{ color: "purple", empty: true, circular: true }}
                    text="purple"
                    onClick={() => {
                      handleChangeColor("purple");
                    }}
                  />
                  <Dropdown.Item
                    label={{ color: "pink", empty: true, circular: true }}
                    text="pink"
                    onClick={() => {
                      handleChangeColor("pink");
                    }}
                  />
                  <Dropdown.Item
                    label={{ color: "brown", empty: true, circular: true }}
                    text="brown"
                    onClick={() => {
                      handleChangeColor("brown");
                    }}
                  />
                  <Dropdown.Item
                    label={{ color: "grey", empty: true, circular: true }}
                    text="grey"
                    onClick={() => {
                      handleChangeColor("grey");
                    }}
                  />
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown.Item onClick={() => setChangeProfile(true)}>
                Change Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setConfirm(true)}>
                <span style={{ color: "red" }}>Log out</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Menu>
      <Sidebar
        as={Segment}
        animation="scale down"
        direction="left"
        visible={sideBarShow}
        onHide={() => setSideBarShow(false)}
        style={{ zIndex: 4 }}
      >
        <div
          style={{
            display: "none!important",
            textAlign: "center",
          }}
          media={{ minWidth: "992px" }}
        >
          <Chatroomlist {...props}></Chatroomlist>
        </div>
      </Sidebar>

      <Modal onClose={() => setConfirm(false)} open={confirm}>
        <Modal.Content>
          <Modal.Description>
            <p>Do you want to log out ?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setConfirm(false)}>Cancel</Button>
          <Button
            color={color}
            onClick={() => {
              logout();
              setConfirm(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal onClose={() => setChangeProfile(false)} open={changeProfile}>
        <Changeprofile {...props} close={setChangeProfile}></Changeprofile>
        <Modal.Actions>
          <Button onClick={() => setChangeProfile(false)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Functionbar;
