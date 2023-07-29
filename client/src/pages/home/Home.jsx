import { useState } from "react";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from './components/UsersList';

export const Home = () => {
  const [searchKey, setSearchKey] = useState("");
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
      <div>
        <ChatArea />
      </div>
    </div>
  )
}
