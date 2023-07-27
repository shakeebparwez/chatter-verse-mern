import { useState } from "react";
import { Link } from "react-router-dom";

export const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const register = async () => {
    console.log(user);
  }

  return (
    <div className="h-screen bg-primary flex items-center justify-center">
      <div className="bg-white shadow-md p-5 flex flex-col gap-5 w-96">
        <h1 className="text-2xl uppercase font-semibold text-primary">ChatterVerse Register</h1>
        <hr />
        <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Enter your name" />
        <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Enter your email" />
        <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Enter your password" />

        <button className="contained-btn" onClick={register}>Register</button>

        <Link to="/login" className="underline">Already have an account? Login</Link>
      </div>
    </div>
  )
}
