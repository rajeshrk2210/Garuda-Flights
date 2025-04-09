import { useEffect, useState } from "react";

// Define a type for the profile data
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
      const res = await fetch("http://localhost:5000/auth/upload-image", {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-6">
        <SkeletonLoader />
      </div>
    );
  }

  if (!profile) return <div className="p-6 text-gray-600">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-700 mb-8 text-center">Admin Profile</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          {/* Profile Image */}
          {profile.userImage && (
            <div className="flex justify-center mb-6">
              <img
                src={profile.userImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-100"
              />
            </div>
          )}

          {/* Profile Form */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Full Name"
                value={profile.userName || ""}
                onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <input
                type="date"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={profile.dateOfBirth || ""}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Gender</label>
              <select
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={profile.gender || ""}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Nationality</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Nationality"
                value={profile.nationality || ""}
                onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                value={profile.email || ""}
                disabled
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Phone Number"
                value={profile.phoneNumber || ""}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Alternate Phone</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Alternate Phone"
                value={profile.alternatePhoneNumber || ""}
                onChange={(e) => setProfile({ ...profile, alternatePhoneNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Mailing Address</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Mailing Address"
                value={profile.mailingAddress || ""}
                onChange={(e) => setProfile({ ...profile, mailingAddress: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Passport Number</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Passport Number"
                value={profile.passportNumber || ""}
                onChange={(e) => setProfile({ ...profile, passportNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Emergency Contact"
                value={profile.emergencyContactDetails || ""}
                onChange={(e) => setProfile({ ...profile, emergencyContactDetails: e.target.value })}
              />
            </div>

            {/* Image Upload */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600">Profile Image</label>
              <input
                type="file"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
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

// 🔹 Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="max-w-2xl mx-auto">
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
      {/* Image Placeholder */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 rounded-full bg-gray-200"></div>
      </div>

      {/* Form Fields Placeholder */}
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index}>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
        {/* Image Upload Placeholder */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        {/* Save Button Placeholder */}
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Change Password Placeholder */}
      <div className="mt-8">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;