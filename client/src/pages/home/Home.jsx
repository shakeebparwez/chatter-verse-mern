import { useState, useEffect } from "react";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from './components/UsersList';
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("https://chatterverse-shark.onrender.com");

export const Home = () => {

  const [searchKey, setSearchKey] = useState("");
  const { selectedChat, user } = useSelector(state => state.userReducer);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // join the room
    if (user) {
      socket.emit("join-room", user._id);
      socket.emit("came-online", user._id);

      socket.on("online-users", (users) => {
        setOnlineUsers(users);
      });

      socket.on("online-users-updated", (users) => {
        setOnlineUsers(users);
      })

      //   // send new message to receipent (Diana)
      //   socket.emit("send-message", {text: "Hi Diana, This is from Shakeeb",
      //   sender: user._id,
      //   receipent: "64c53c5f4e87fb255ab78a54",
      // });

      //   // receive message from receipent (Shakeeb)
      //   socket.on("receive-message", (data) => {
      //     console.log(data);
      //   })
    }
  }, [user])

  // useEffect(() => {
  //   socket.emit("send-new-message-to-all", {
  //     message: "Hi from Shakeeb"
  //   })

  //   socket.on("new-message-from-server", (data) => {
  //     console.log(data);
  //   })
  // }, []);

  return (
    <div className="flex gap-5">
      {/* 1st Part  User-Search, UsersList/ChatList*/}
      <div className="w-96">
        <UserSearch
          searchKey={searchKey}
          setSearchKey={setSearchKey}
        />
        <UsersList
          searchKey={searchKey}
          socket={socket}
          onlineUsers={onlineUsers}
          setSearchKey={setSearchKey}
        />
      </div>

      {/* 2nd Part ChatBox */}
      {selectedChat && (
        <div className="w-full"><ChatArea socket={socket} /></div>
      )}
      {!selectedChat && (
        <div className="w-full h-[80vh]  items-center justify-center flex bg-white flex-col">
          <img
            src="https://www.pngmart.com/files/16/Speech-Chat-Icon-Transparent-PNG.png"
            alt=""
            className="w-96 h-96"
          />
          <h1 className="text-2xl font-semibold text-gray-500">
            Select a user to chat
          </h1>
        </div>
      )}
    </div>
  )
}
