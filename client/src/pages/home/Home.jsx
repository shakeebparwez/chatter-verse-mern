import { useState, useEffect } from "react";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from './components/UsersList';
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export const Home = () => {

  const [searchKey, setSearchKey] = useState("");
  const { selectedChat, user } = useSelector(state => state.userReducer);

  useEffect(() => {
    // join the room
    if (user) {
      socket.emit("join-room", user._id);

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
        />
      </div>

      {/* 2nd Part ChatBox */}
      {selectedChat && (
        <div className="w-full"><ChatArea socket={socket} /></div>
      )}
    </div>
  )
}
