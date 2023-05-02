import React, { useState, useEffect, useContext, useRef } from "react";
import { colorContext } from "../../pages/Mainpage";
import { Comment, Header, Form, Icon, Message } from "semantic-ui-react";
const Msg = (props) => {
  const ref = useRef();
  const { color } = useContext(colorContext);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.msg]);
  return (
    <div ref={ref}>
      <Comment
        className="msg"
        style={
          props.isMine ? { display: "flex", flexDirection: "row-reverse" } : {}
        }
      >
        <div className="avatar" style={{ zIndex: 3 }}>
          <div
            alt="avatar"
            style={{
              backgroundImage: `url(${require("../../img/pokemonImg/" +
                props.msg.avatar)})`,
            }}
            className={props.isMine ? "myPokemonAvatar" : "pokemonAvatar"}
          />
        </div>

        <Comment.Content>
          <Comment.Author as="span" style={{ zIndex: 2 }}>
            {props.msg.name}
          </Comment.Author>

          <Comment.Text>
            <Message
              color={color}
              compact
              style={
                props.isMine
                  ? {
                      borderRadius: " 20px 0 20px  20px ",
                      maxWidth: "600px",
                      maxHeight: "600px",
                      overflow: "auto",
                      zIndex: 2,
                    }
                  : {
                      borderRadius: "0 20px 20px 20px",
                      maxWidth: "600px",
                      maxHeight: "600px",
                      overflow: "auto",
                      zIndex: 2,
                    }
              }
            >
              {props.msg.type === "text" ? (
                <div
                  style={{ color: "black" }}
                  onLoad={() => {
                    ref.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {props.msg.content}
                </div>
              ) : props.msg.type === "img" ? (
                <img
                  src={props.msg.img}
                  alt="img"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "300px",
                  }}
                  onLoad={() => {
                    ref.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                ></img>
              ) : (
                <img
                  src={props.msg.img}
                  alt="gif"
                  onLoad={() => {
                    ref.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                ></img>
              )}
            </Message>
            <Comment.Metadata>
              <div
                style={
                  props.isMine
                    ? {
                        position: "absolute",
                        bottom: "0px",
                        right: "0px",
                        marginRight: "3.5em",
                        zIndex: 2,
                      }
                    : {
                        position: "absolute",
                        bottom: "0px",
                        left: "0px",
                        marginLeft: "3.5em",
                        zIndex: 2,
                      }
                }
              >
                {props.msg.time !== undefined
                  ? props.msg.time.toDate().toLocaleString([], {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </Comment.Metadata>
          </Comment.Text>
        </Comment.Content>
      </Comment>
    </div>
  );
};

export default Msg;
