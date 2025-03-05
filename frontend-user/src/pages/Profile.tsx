import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { user } = authContext;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold">User Profile</h1>
      <p><strong>Email:</strong> {user?.email || "Loading..."}</p>
      <p><strong>Role:</strong> {user?.role || "Loading..."}</p>
    </div>
  );
};

export default Profile;
