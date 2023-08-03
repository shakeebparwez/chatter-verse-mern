import { useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";
import { UpdateProfilePicture } from './../../apicalls/users';
import toast from 'react-hot-toast';
import { SetUser } from "../../redux/userSlice";

function Profile() {
  const { user } = useSelector(state => state.userReducer);
  const [image = "", setImage] = useState("");
  const dispatch = useDispatch();

  const onFileSelect = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setImage(reader.result);
    }

  }

  useEffect(() => {
    if (user?.profilePic) {
      setImage(user.profilePic);
    }
  }, [user]);

  const updateProfilePic = async () => {
    try {
      dispatch(ShowLoader());
      const response = await UpdateProfilePicture(image);
      dispatch(HideLoader());

      if (response.success) {
        toast.success("Profile Pic Updated");
        dispatch(SetUser(response.data));
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  }

  return (
    user && <div className="text-xl font-semibold uppercase text-gray-500 flex gap-2 flex-col p-2 shadow-md border w-max border-gray-500">
      <h1>{user.name}</h1>
      <h1>{user.email}</h1>
      <h1>Created At: {moment(user.createdAt).format("MMMM Do YYYY, hh:mm:ss a")}</h1>
      {image && <img src={image} alt="profile pic" className="w-32 h-32 rounded-full" />}

      <div className="flex gap-2">
        <label htmlFor="file-input" className="cursor-pointer">Update Profile Pic</label>
        <input type="file" onChange={onFileSelect} className="file-input" id="file-input" />
        <button className="contained-btn"
          onClick={updateProfilePic}>Update</button>
      </div>
    </div>
  )
}

export default Profile;