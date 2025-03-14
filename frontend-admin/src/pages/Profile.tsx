import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { admin } = authContext;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold">Admin Profile</h1>
      <p><strong>Email:</strong> {admin?.email || "Loading..."}</p>
      <p><strong>Role:</strong> {admin?.role || "Loading..."}</p>
    </div>
  );
};

export default Profile;
