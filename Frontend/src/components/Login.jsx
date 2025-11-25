import React, { useEffect, useState } from "react";

export default function Login({ url }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!password.trim()) {
      setMessage("Please enter the secret key ✨");
      return;
    }

    setLoading(true);
    setMessage("Connecting to server this may take some time ⏳ ");

    try {
      const res = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Login successful!, Welcome  <3");
        localStorage.setItem("token", data.token || "");
        setTimeout(() => (window.location.href = "/"), 500);
      } else {
        setMessage(`That's a wrong key, please try again`);
      }
    } catch {
      setMessage("⚠️ Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#2b0632] to-[#3b1550] px-4">
      {/* Login Card */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">OpenNotes 📂</h1>
        <p className="text-center text-white/70 mb-6 text-sm">Share notes for  community with auth ⚙</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value.toLowerCase())}
            placeholder="Enter secret key..."
            className="w-full rounded-full px-5 py-3 bg-white/8 border border-white/20 placeholder-white/60 text-white focus:ring-2 focus:ring-pink-500 transition"
            disabled={loading}
          />

          {/* Hint Button */}
  
          {message && (
            <div
              className={`text-center text-sm ${
                message.startsWith("✅")
                  ? "text-green-300"
                  : message.startsWith("⏳")
                  ? "text-yellow-300"
                  : "text-rose-300"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg hover:shadow-2xl transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Connecting…" : "Login"}
          </button>
        </form>

        <p className="text-xs text-white/60 text-center mt-4">
          Tip: Ask your group member or maybe admin ? ✨
        </p>
      </div>

      {/* Info Button */}

    
    </div>
  );
}
