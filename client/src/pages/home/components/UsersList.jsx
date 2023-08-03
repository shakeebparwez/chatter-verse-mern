import { useSelector, useDispatch } from "react-redux";
import { SetAllChats, SetSelectedChat } from "../../../redux/userSlice";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { CreateNewChat } from "../../../apicalls/chats";
import toast from "react-hot-toast";
import moment from "moment";
import store from "../../../redux/store";
import { useEffect } from "react";


const UsersList = ({ searchKey, socket, onlineUsers, setSearchKey }) => {
    const { allUsers, allChats, user, selectedChat } = useSelector(state => state.userReducer);

    const dispatch = useDispatch();

    const createNewChat = async (receipentUserId) => {
        try {
            dispatch(ShowLoader());
            const response = await CreateNewChat([user._id, receipentUserId]);
            dispatch(HideLoader());

            if (response.success) {
                toast.success(response.message);
                const newChat = response.data;
                const updatedChats = [...allChats, newChat];
                dispatch(SetAllChats(updatedChats));
                dispatch(SetSelectedChat(newChat));
                setSearchKey("");
            } else {

            }
        } catch (error) {
            dispatch(HideLoader());
            toast.error(error.message);
        }
    }

    const openChat = (receipentUserId) => {
        const chat = allChats.find((chat) => chat.members.map((mem) => mem._id).includes(user._id) && chat.members.map((mem) => mem._id).includes(receipentUserId));

        if (chat) {
            dispatch(SetSelectedChat(chat));
        }
    };

    const getData = () => {
        // if search key is empty then return all chats else return filtered chats and users
        if (searchKey === "") {
            return allChats;
        }
        return allUsers.filter((user) => user.name.toLowerCase().includes(searchKey.toLowerCase()));
    }

    const getIsSelectedChatOrNot = (userObj) => {
        if (selectedChat) {
            return selectedChat.members.map((mem) => mem._id).includes(userObj._id)
        }
        return false;
    }

    const getDateInRegularFormat = (date) => {
        let result = "";

        // if date is today then return time in hh:mm format
        // if date is today then return time in hh:mm format
        if (moment(date).isSame(moment(), "day")) {
            result = moment(date).format("hh:mm");
        }
        // if date is yesterdat return yesterday and time in hh:mm format
        else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
            result = `Yesterday ${moment(date).format("hh:mm")}`;
        }
        // if date is this year return date and time in MMM DD hh:mm format
        else if (moment(date).isSame(moment(), "year")) {
            result = moment(date).format("MMM DD hh:mm");
        }

        return result;
    }

    const getLastMsg = (userObj) => {
        const chat = allChats.find(
            (chat) => chat.members.map((mem) => mem._id).includes(userObj._id)
        );

        if (!chat || !chat.lastMessage) {
            return "";
        } else {
            const lastMsgPerson = chat?.lastMessage?.sender === user._id ? "You:" : "";
            return <div className="flex justify-between w-72">
                <h1 className="text-gray-600 text-sm">{lastMsgPerson} {chat?.lastMessage?.text}</h1>
                <h1 className="text-gray-500 text-sm">
                    {getDateInRegularFormat(chat?.lastMessage?.createdAt)}
                </h1>
            </div>
        }
    }



    const getUnreadMessages = (userObj) => {
        const chat = allChats.find((chat) => chat.members.map((mem) => mem._id).includes(userObj._id));

        if (chat && chat?.unreadMessages && chat?.lastMessage?.sender !== user._id) {
            return (
                <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {chat?.unreadMessages}
                </div>
            );
        }
    }

    useEffect(() => {
        socket.on("receive-message", (message) => {
            // if the chat area opened is not equal to chat in message, then increase unread messages by 1 and update last message

            const tempSelectedChat = store.getState().userReducer.selectedChat;

            let tempAllChats = store.getState().userReducer.allChats;

            if (tempSelectedChat?._id !== message.chat) {
                const updatedAllChats = tempAllChats.map((chat) => {
                    if (chat._id === message.chat) {
                        return {
                            ...chat,
                            unreadMessages: (chat?.unreadMessages || 0) + 1,
                            lastMessage: message,
                        };
                    }

                    return chat;
                });
                tempAllChats = updatedAllChats;
            }

            // always latest message chat will be on top
            const latestChat = tempAllChats.find((chat) => chat._id === message.chat);
            const otherChats = tempAllChats.filter((chat) => chat._id !== message.chat);
            tempAllChats = [latestChat, ...otherChats];
            dispatch(SetAllChats(tempAllChats));
        });
    }, []);

    return (
        <div className="flex flex-col gap-3 mt-5 lg:w-96 md:w-60 sm:w-60 xl:w-96">
            {getData()
                .map((chatObjOrUserObj) => {
                    let userObj = chatObjOrUserObj;
                    if (chatObjOrUserObj.members) {
                        userObj = chatObjOrUserObj.members.find((mem) => mem._id !== user._id);
                    }
                    return (
                        <div className={`shadow-sm border p-2 rounded-xl bg-white flex justify-between items-center cursor-pointer w-full ${getIsSelectedChatOrNot(userObj) && "border-primary border-2"}`} key={userObj._id} onClick={() => openChat(userObj._id)}>
                            <div
                                className="flex gap-5 items-center">
                                {userObj.profilePic && (
                                    <div className= "h-12 w-12 flex items-center justify-center relative">
                                    <img
                                        src={userObj.profilePic}
                                        alt="profile pic"
                                        className="w-12 h-12 rounded-full"
                                    />
                                    {onlineUsers.includes(userObj._id) && <div className="bg-green-700 h-3 w-3 rounded-full absolute bottom-[2px] right-1"></div>}
                                    </div>
                                )}
                                {!userObj.profilePic && (
                                    <div className="bg-gray-400 rounded-full h-12 w-12 flex items-center justify-center relative">
                                        <h1 className="uppercase text-xl font-semibold text-white">
                                            {userObj.name[0]}
                                        </h1>
                                        {onlineUsers.includes(userObj._id) && <div className="bg-green-700 h-3 w-3 rounded-full absolute bottom-[2px] right-1"></div>}
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-1">
                                        <h1>{userObj.name}</h1>
                                        {getUnreadMessages(userObj)}
                                    </div>

                                    {getLastMsg(userObj)}

                                </div>

                            </div>
                            <div onClick={() => createNewChat(userObj._id)}>
                                {!allChats.find((chat) => chat.members.map((mem) => mem._id).includes(userObj._id)) && (
                                    <button className="border-primary border text-primary bg-white p-1 rounded">
                                        Create Chat
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
        </div>
    )
}

export default UsersList;