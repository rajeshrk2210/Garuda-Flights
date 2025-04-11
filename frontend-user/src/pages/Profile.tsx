import { useEffect, useState } from "react";
import apiURL from "../config/config";

interface ProfileData {
  userName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  email?: string;
  phoneNumber?: string;
  alternatePhoneNumber?: string;
  mailingAddress?: string;
  passportNumber?: string;
  emergencyContactDetails?: string;
  userImage?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [userImage, setUserImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiURL}/auth/profile`, {
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
      } finally {
        setLoading(false);
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
      const res = await fetch(`${apiURL}/auth/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.userImage?.data) {
        const base64Image = arrayBufferToBase64(data.userImage.data.data);
        setProfile((prev) => ({
          ...prev,
          userImage: `data:image/png;base64,${base64Image}`,
        }));
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
      const res = await fetch(`${apiURL}/auth/change-password`, {
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
      const res = await fetch(`${apiURL}/auth/update-profile`, {
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

  if (loading) return <SkeletonLoader />;
  if (!profile) return <div className="p-6 text-gray-600">Failed to load profile.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-700 mb-8 text-center">User Profile</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          {profile.userImage && (
            <div className="flex justify-center mb-6">
              <img
                src={profile.userImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-100"
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {[
              ["Full Name", "userName"],
              ["Date of Birth", "dateOfBirth"],
              ["Gender", "gender"],
              ["Nationality", "nationality"],
              ["Phone Number", "phoneNumber"],
              ["Alternate Phone", "alternatePhoneNumber"],
              ["Mailing Address", "mailingAddress"],
              ["Passport Number", "passportNumber"],
              ["Emergency Contact", "emergencyContactDetails"],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-600">{label}</label>
                <input
                  type={key === "dateOfBirth" ? "date" : "text"}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={profile[key as keyof ProfileData] || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, [key]: e.target.value })
                  }
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                value={profile.email || ""}
                disabled
              />
            </div>

            {/* Upload Image */}
            <div>
              <label className="text-sm font-medium text-gray-600">Profile Image</label>
              <input
                type="file"
                className="w-full mt-1 p-2"
                onChange={(e) => setUserImage(e.target.files?.[0] || null)}
              />
              <button
                onClick={handleImageUpload}
                className="mt-2 w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
              >
                Upload Image
              </button>
            </div>

            {/* Save Profile Button */}
            <button
              onClick={handleProfileUpdate}
              className="mt-4 w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
            >
              Save Profile Changes
            </button>
          </div>

          {/* Change Password */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleChangePassword}
                className="w-full sm:w-auto px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition duration-200"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="p-6 text-gray-600">Loading profile...</div>
);

export default Profile;
