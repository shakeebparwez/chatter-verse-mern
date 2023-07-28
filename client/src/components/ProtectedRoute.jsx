import { useEffect, useState } from "react"
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const getCurrentUser = async () => {
    
    try {
      const response = await GetCurrentUser();

      if (response.success) {
        setUser(response.data);
      }
      else {
        toast.error(response.message);
        navigate("/login");
        return false;
      }
    } catch (error) {
      toast.error(response.message);
      navigate("/login");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (

    <div>
      <h1>{(user?.name)}</h1>
      <h1>{(user?.email)}</h1>
      {children}
    </div>
  )
}
