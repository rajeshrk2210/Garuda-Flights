import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const authContext = useContext(AuthContext);
  const [profile, setProfile] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [userImage, setUserImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.user?.userImage?.data) {
          const base64Image = arrayBufferToBase64(data.user.userImage.data.data);
          data.user.userImage = `data:image/png;base64,${base64Image}`;
        }

        setProfile(data.user);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  const handleImageUpload = async () => {
    if (!userImage) return;
    const formData = new FormData();
    formData.append("image", userImage);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/auth/upload-image", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.userImage?.data) {
        const base64Image = arrayBufferToBase64(data.userImage.data.data);
        setProfile((prev: any) => ({ ...prev, userImage: `data:image/png;base64,${base64Image}` }));
        alert("✅ Profile image updated!");
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) return alert("⚠️ Enter a new password");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Password changed successfully!");
        setNewPassword("");
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Error changing password:", err);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Profile updated successfully!");
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err);
    }
  };

  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Profile</h1>

      {profile.userImage && (
        <img
          src={profile.userImage}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 object-cover border"
        />
      )}

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Full Name"
          value={profile.userName || ""}
          onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
        />

        <label className="text-sm font-semibold">Date of Birth</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={profile.dateOfBirth || ""}
          onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
        />

        <label className="text-sm font-semibold">Gender</label>
        <select
          className="border p-2 rounded"
          value={profile.gender || ""}
          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Nationality"
          value={profile.nationality || ""}
          onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
        />

        {/* ✅ Email (non-editable) */}
        <label className="text-sm font-semibold">Email</label>
        <input
          type="email"
          className="border p-2 rounded bg-gray-100 cursor-not-allowed"
          value={profile.email || ""}
          disabled
        />

        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Phone Number"
          value={profile.phoneNumber || ""}
          onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Alternate Phone"
          value={profile.alternatePhoneNumber || ""}
          onChange={(e) => setProfile({ ...profile, alternatePhoneNumber: e.target.value })}
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Mailing Address"
          value={profile.mailingAddress || ""}
          onChange={(e) => setProfile({ ...profile, mailingAddress: e.target.value })}
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Passport Number"
          value={profile.passportNumber || ""}
          onChange={(e) => setProfile({ ...profile, passportNumber: e.target.value })}
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Emergency Contact"
          value={profile.emergencyContactDetails || ""}
          onChange={(e) => setProfile({ ...profile, emergencyContactDetails: e.target.value })}
        />

        <input type="file" onChange={(e) => setUserImage(e.target.files?.[0] || null)} />
        <button onClick={handleImageUpload} className="px-4 py-2 bg-blue-500 text-white rounded">
          Upload Image
        </button>

        <button onClick={handleProfileUpdate} className="px-4 py-2 bg-purple-600 text-white rounded">
          Save Profile Changes
        </button>
      </div>

      {/* Change Password */}
      <div className="mt-6">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleChangePassword} className="px-4 py-2 bg-green-600 text-white rounded">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
