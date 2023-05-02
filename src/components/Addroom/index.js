import React, { useState, useEffect, useContext } from "react";
import { colorContext } from "../../pages/Mainpage";

import { Modal, Menu, Button, Form, Dropdown } from "semantic-ui-react";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.js";
import Createroom from "../Creatroom/index.js";
import Joinroom from "../Joinroom/index.js";

const Addroom = (props) => {
  const { color } = useContext(colorContext);
  const [activeItem, setActiveItem] = useState("create");

  const close = () => {
    props.setAddRoom(false);
  };

  return (
    <Modal onClose={() => close} open={props.addRoom}>
      <Menu attached="top" tabular widths={2}>
        <Menu.Item
          color={color}
          name="Create a room"
          active={activeItem === "create"}
          onClick={() => setActiveItem("create")}
        />
        <Menu.Item
          color={color}
          name="Join in a room"
          active={activeItem === "join"}
          onClick={() => setActiveItem("join")}
        />
      </Menu>
      <Modal.Content style={{ display: "flex", justifyContent: "center" }}>
        {activeItem === "create" ? (
          <Createroom {...props} close={close}></Createroom>
        ) : (
          <Joinroom {...props} close={close}></Joinroom>
        )}
      </Modal.Content>

      <Modal.Actions>
        <Button
          onClick={() => {
            close();
          }}
        >
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Addroom;
