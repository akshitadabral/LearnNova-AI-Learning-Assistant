import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import { User, Mail, Lock, ShieldCheck, X } from "lucide-react";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getProfile();
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        toast.error("Failed to fetch profile data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setPasswordLoading(true);

    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswordModal(false);

    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">

      <PageHeader title="Profile Settings" />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1D4ED8] to-[#06B6D4] p-7 text-white shadow-xl">

        <div className="absolute right-0 top-0 opacity-10">
          <User size={200} />
        </div>

        <div className="relative flex items-center gap-5">

          <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/20">
            {username?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold">{username}</h2>
            <p className="text-sm text-white/80 mt-1">Manage your account information and security</p>
          </div>

        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 hover:shadow-lg transition">

          <div className="flex items-center gap-3 mb-6">

            <div className="p-2 rounded-xl bg-[#06B6D4]/10">
              <User size={20} className="text-[#0891B2]" />
            </div>

            <h3 className="text-lg font-semibold text-neutral-900">
              User Information
            </h3>

          </div>

          <div className="space-y-5">

            <div>
              <label className="text-xs font-medium text-neutral-500">
                Username
              </label>

              <div className="mt-2 flex items-center gap-3 rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                <User size={18} className="text-neutral-400" />
                <p className="text-sm">{username}</p>
              </div>

            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500">
                Email Address
              </label>

              <div className="mt-2 flex items-center gap-3 rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                <Mail size={18} className="text-neutral-400" />
                <p className="text-sm">{email}</p>
              </div>

            </div>

          </div>

        </div>


        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 hover:shadow-lg transition">

          <div className="flex items-center gap-3 mb-5">

            <div className="p-2 rounded-xl bg-[#06B6D4]/10">
              <ShieldCheck size={20} className="text-[#0891B2]" />
            </div>

            <h3 className="text-lg font-semibold text-neutral-900">
              Security
            </h3>

          </div>

          <p className="text-sm text-neutral-500 mb-6">
            Update your password regularly to keep your account secure.
          </p>

          <Button onClick={() => setShowPasswordModal(true)}>
            Change Password
          </Button>

        </div>

      </div>


      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 mx-4">

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-xl font-semibold">
                Change Password
              </h3>

              <button onClick={() => setShowPasswordModal(false)}>
                <X size={22} />
              </button>

            </div>


            <form onSubmit={handleChangePassword} className="space-y-4">

              {[
                ["Current Password", currentPassword, setCurrentPassword],
                ["New Password", newPassword, setNewPassword],
                ["Confirm New Password", confirmNewPassword, setConfirmNewPassword]
              ].map(([label, value, setter], index) => (

                <div key={index}>

                  <label className="text-xs font-medium text-neutral-600">
                    {label}
                  </label>

                  <div className="relative mt-2">

                    <Lock size={17} className="absolute left-3 top-3 text-neutral-400" />

                    <input
                      type="password"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
                    />

                  </div>

                </div>

              ))}

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-sm hover:bg-neutral-50"
                >
                  Cancel
                </button>

                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? "Changing..." : "Update Password"}
                </Button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;