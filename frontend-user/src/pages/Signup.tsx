import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-role": "user"
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup successful!");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">User SignUp</h2>
      <input name="userName" type="text" placeholder="Name" className="border p-2 w-full mb-2" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" className="border p-2 w-full mb-2" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" className="border p-2 w-full mb-2" onChange={handleChange} />
      <button onClick={handleSignup} className="bg-green-600 text-white w-full py-2 rounded">Sign Up</button>
    </div>
  );
};

export default Signup;
