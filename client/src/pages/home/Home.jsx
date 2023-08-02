import { useState } from "react";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from './components/UsersList';
import { useSelector } from "react-redux";

export const Home = () => {
  const [searchKey, setSearchKey] = useState("");
  const { selectedChat } = useSelector(state => state.userReducer);
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
        />
      </div>

      {/* 2nd Part ChatBox */}
      {selectedChat && (
        <div className="w-full"><ChatArea /></div>
      )}
    </div>
  )
}
