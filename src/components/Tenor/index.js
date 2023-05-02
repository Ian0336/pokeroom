import React, { useState, useEffect, useContext } from "react";
import { colorContext } from "../../pages/Mainpage";
import {
  Dimmer,
  Image,
  Form,
  Icon,
  Modal,
  Button,
  Loader,
  Grid,
  Segment,
  Pagination,
} from "semantic-ui-react";
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
import axios from "axios";
import { storage, db } from "../../firebase/firebase.js";
const Gifimage = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const { color } = useContext(colorContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    return () => {};
  }, [props.url]);
  async function addChat() {
    const chatRef = doc(db, "chatRooms", `${props.nowRoom}`);
    await updateDoc(chatRef, {
      chats: arrayUnion({
        content: props.title,
        name: props.data.name,
        time: Timestamp.now(),
        avatar: props.data.avatar,
        type: "gif",
        id: props.data.id,
        img: props.url,
      }),
    });
  }
  const handleSend = async () => {
    await addChat();
    props.setGifs([]);
    props.setShowGifs([]);
    props.setSearchText("");
    props.setShowGif(false);
  };
  return (
    <Segment
      style={{
        width: "20%",
        aspectRatio: "1/1",
        marginTop: "0px",
        marginBottom: "0px",
      }}
      color={color}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      inverted={isHovered}
      onClick={handleSend}
    >
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <Image
        src={props.url}
        size="small"
        onLoad={() => setLoading(false)}
        style={{ width: "100%", height: "100%" }}
      />
    </Segment>
  );
};

const Tenor = (props) => {
  const API_KEY = "AIzaSyAmROWzzqMbM1GET23EJjh7Ufwt9Ehfe6E";
  const API_URL = `https://g.tenor.com/v1/search?q=%QUERY%&key=${API_KEY}&limit=10`;
  const { color } = useContext(colorContext);
  const [searchText, setSearchText] = useState("pokemon");
  const [gifs, setGifs] = useState([]);
  const [showGifs, setShowGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    setSearchText("pokemon");
    if (props.showGif === true) handleSearch();

    return () => {};
  }, [props.showGif]);
  useEffect(() => {
    setShowGifs(gifs.slice((page - 1) * 10, page * 10));
    return () => {};
  }, [page]);

  const handleSearch = async () => {
    setLoading(true);
    var search_url =
      "https://tenor.googleapis.com/v2/search?q=" +
      searchText +
      "&key=" +
      API_KEY +
      "&limit=60";
    console.log(search_url);

    try {
      const response = await axios.get(search_url);

      const results = response.data.results.map((result) => ({
        url: result.media_formats.tinygif.url,
        title: result.content_description,
      }));
      setGifs(results);
      setShowGifs(results.slice(0, 10));
      setPage(1);
      console.log(results);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Modal
      onClose={() => {
        props.setShowGif(false);
        setGifs([]);
        setShowGifs([]);
        setSearchText("");
      }}
      open={props.showGif}
    >
      <Modal.Content style={{ display: "flex", justifyContent: "center" }}>
        <Grid>
          <Grid.Row centered>
            <Form
              reply
              onSubmit={handleSearch}
              loading={loading}
              style={{ width: "80%" }}
            >
              <Form.Input
                icon={
                  <Icon
                    name="search"
                    inverted
                    circular
                    link
                    color={color}
                    onClick={handleSearch}
                  />
                }
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />{" "}
            </Form>
          </Grid.Row>
          <Grid.Row>
            {showGifs.map((ele) => (
              <Gifimage
                url={ele.url}
                title={ele.title}
                {...props}
                setGifs={setGifs}
                setShowGifs={setShowGifs}
                setSearchText={setSearchText}
              />
            ))}
          </Grid.Row>
        </Grid>
      </Modal.Content>

      <Modal.Actions>
        <Pagination
          activePage={page}
          boundaryRange={0}
          defaultActivePage={1}
          onPageChange={(e, { activePage }) => setPage(activePage)}
          siblingRange={1}
          totalPages={5}
        />
        <Button
          onClick={() => {
            props.setShowGif(false);
            setGifs([]);
            setShowGifs([]);
            setSearchText("");
          }}
        >
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Tenor;
