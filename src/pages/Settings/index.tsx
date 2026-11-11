import { useState } from "react";

const getSavedSettings = () => {
  const savedSettings = localStorage.getItem("dashboardSettings");

  if (savedSettings) {
    try {
      return {
        siteName: "Admin Dashboard",
        adminName: "Admin",
        email: "admin@example.com",
        emailNotifications: true,
        darkMode: false,
        ...JSON.parse(savedSettings),
      };
    } catch {
      return {
        siteName: "Admin Dashboard",
        adminName: "Admin",
        email: "admin@example.com",
        emailNotifications: true,
        darkMode: false,
      };
    }
  }

  return {
    siteName: "Admin Dashboard",
    adminName: "Admin",
    email: "admin@example.com",
    emailNotifications: true,
    darkMode: false,
  };
};

const Settings = () => {
  const [savedSettings] = useState(getSavedSettings);

  const [siteName, setSiteName] = useState(savedSettings.siteName);
  const [adminName, setAdminName] = useState(savedSettings.adminName);
  const [email, setEmail] = useState(savedSettings.email);

  const [emailNotifications, setEmailNotifications] = useState(
    savedSettings.emailNotifications,
  );

  const [darkMode, setDarkMode] = useState(savedSettings.darkMode);

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");
    setSuccessMessage("");

    if (!siteName.trim()) {
      setError("Site name is required.");
      return;
    }

    if (!adminName.trim()) {
      setError("Admin name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Admin email is required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const settings = {
      siteName: siteName.trim(),
      adminName: adminName.trim(),
      email: email.trim(),
      emailNotifications,
      darkMode,
    };

    localStorage.setItem("dashboardSettings", JSON.stringify(settings));

    setSuccessMessage("Settings saved successfully!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your dashboard settings and preferences.
        </p>
      </div>

      {/* General Settings */}
      <div className="max-w-3xl rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          General Settings
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Site Name
            </label>

            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Admin Name
            </label>

            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-6 max-w-3xl rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          Preferences
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Email Notifications</h3>

              <p className="text-sm text-gray-500">
                Receive email notifications and updates.
              </p>
            </div>

            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">
                Dark Mode Preference
              </h3>

              <p className="text-sm text-gray-500">
                Save your preferred dashboard appearance.
              </p>
            </div>

            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Messages and Save Button */}
      <div className="mt-6 max-w-3xl space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {successMessage}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
