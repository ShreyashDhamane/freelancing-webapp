import React, { useState, useEffect } from "react";
import "./ChatMiddle.scss";
import { Search } from "@material-ui/icons";

import { useSelector, useDispatch } from "react-redux";
import { update } from "./../../features/chatMain/chatMainSlice";

const ChatMiddle = (props) => {
  const chatMainData = useSelector((state) => state.chatMainData.value);
  const dispatch = useDispatch();

  const sender = localStorage.getItem("username");

  const [chats, setChats] = useState(props.chats);
  const [chatData, setChatData] = useState(props.chatData);
  const searchUserForChat = (event) => {
    const name = event.target.value;
  };
  const getLastMsg = (room) => {
    for (let i = 0; i < chatData.length; i++) {
      if (chatData[i].room === room) {
        return chatData[i].data[chatData[i].data.length - 1];
      }
    }
  };

  useEffect(() => {
    setChatData((pData) => {
      for (let i = 0; i < pData.length; i++) {
        if (
          pData[i].room === chatMainData.room &&
          pData[i].data.length !== chatMainData.chatData.length
        ) {
          pData[i].data = chatMainData.chatData;
          const element = document.querySelector(
            `#${chatMainData.room} .last-chat`
          );
          element.textContent = chatMainData.chatData.slice(-1)[0].message;
          break;
        }
      }
      return pData;
    });
  }, [chatMainData]);

  const changeChatMain = (room, receiverImage) => {
    if (chatMainData.room === room) {
      return;
    }
    let chatDataForUser, chatForUser;
    for (let i = 0; i < chats.length; i++) {
      if (chats[i].usernames === room) {
        chatForUser = chats[i];
        break;
      }
    }
    for (let i = 0; i < chatData.length; i++) {
      if (chatData[i].room === room) {
        chatDataForUser = chatData[i];
        break;
      }
    }
    const receiver =
      sender === chatForUser.username1
        ? chatForUser.username2
        : chatForUser.username1;
    localStorage.setItem("receiver", receiver);
    dispatch(
      update({
        image: "not added yet",
        receiver: receiver,
        receiverImage: receiverImage,
        status: "offline",
        room: room,
        chatData: chatDataForUser.data,
      })
    );
  };

  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setChats(() => {
      return props.chats.filter((chat) => {
        const receiver =
          sender === chat.username1 ? chat.username2 : chat.username1;
        if (receiver.includes(value)) {
          return chat;
        }
      });
    });
  };

  return (
    <div className="chat-middle">
      <div className={`search-container`}>
        <input
          type="text"
          placeholder="Search here..."
          value={searchInput}
          onChange={handleSearch}
        />
        <Search className="i" />
      </div>
      <div className="people-container">
        {chats.map((chat) => {
          const username1 = chat.username1;
          const username2 = chat.username2;
          const receiver = sender === username1 ? username2 : username1;
          const room = chat.usernames;
          let lastMsg;
          let lstTimeOfMsg;
          let lastMsgTime;
          const receiverImage =
            sender === username1 ? chat.image2 : chat.image1;
          if (!receiverImage) {
            receiverImage = `https://ui-avatars.com/api/?name=${receiver}`;
          }
          try {
            lastMsg = getLastMsg(room);

            lstTimeOfMsg = new Date(lastMsg.time);
            lastMsgTime =
              lstTimeOfMsg.getHours() + ":" + lstTimeOfMsg.getMinutes();
            if (lastMsg.message.length > 15) {
              lastMsg.message = lastMsg.message.substring(0, 20) + "...";
            }
          } catch (error) {
            lastMsg = "start the conversation";
            lstTimeOfMsg = "";
            lastMsgTime = "";
          }

          return (
            <div
              className="person-wrapper"
              key={room}
              id={room}
              onClick={() => {
                setSearchInput("");
                setChats(props.chats);
                changeChatMain(room, receiverImage);
              }}
            >
              <div className="person">
                <div className="person-img">
                  <img src={receiverImage} alt="" />
                </div>
                <div className="person-mid">
                  <div className="person-name">{receiver}</div>
                  <div className="last-chat">{lastMsg.message}</div>
                </div>
                <div className="last-chat-time">{lastMsgTime}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatMiddle;
