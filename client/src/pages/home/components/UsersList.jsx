import { useSelector } from "react-redux"

const UsersList = ({ searchKey }) => {
    const { allUsers } = useSelector(state => state.userReducer);

    return (
        <div className="flex flex-col gap-3 mt-5">
            {allUsers
                .filter((user) =>
                    user.name.toLowerCase().includes(searchKey.toLowerCase()) && searchKey
                )
                .map((userObj) => {
                    return (
                        <div className="shadow-sm border p-5 rounded-2xl bg-white" key={userObj._id}>
                            <div
                                className="flex gap-5">
                                {userObj.profilePic && (
                                    <img
                                        src={userObj.profilePic}
                                        alt="profile pic"
                                        className="w-10 h-10 rounded-full"
                                    />
                                )}
                                {!userObj.profilePic && (
                                    <div className="bg-gray-500 rounded-full h-10 w-10 flex items-center justify-center">
                                        <h1 className="uppercase text-2xl font-semibold text-white">
                                            {userObj.name[0]}
                                        </h1>
                                    </div>
                                )}
                                <h1>{userObj.name}</h1>
                            </div>
                        </div>
                    );
                })}
        </div>
    )
}

export default UsersList;