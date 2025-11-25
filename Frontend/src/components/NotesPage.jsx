import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostNotes from "./PostNotes";

export default function NotesPage({ url }) {
  const [letters, setLetters] = useState([]);
  const [openedId, setOpenedId] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${url}/notes`, {
          headers: { authorization: token },
        });
        const data = await res.json();
        if (data.success) setLetters(data.data);
        else setError("Failed to load notes. Something went wrong");
      } catch {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [url, token]);

  const toggleLike = (id) => {
    setLetters((prev) =>
      prev.map((l) => (l._id === id ? { ...l, liked: !l.liked } : l))
    );
  };

  const openedLetter = letters.find((l) => l._id === openedId);

  // Full timestamp formatter
  const formatFullDateTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#2b0632] to-[#3b1550] text-white px-4 py-10 relative overflow-y-auto">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-100 to-rose-500 bg-clip-text text-transparent">
          OpenNotes ☁
        </h1>
        <p className="text-white/80 mt-2">Share notes for a community , Here is all of your notes 📃</p>
        <div className="mt-4">
          <button
            onClick={() => {
              if (token) {
                localStorage.removeItem("token");
                window.location.reload("/");
              } else window.location.replace("/");
            }}
            className="px-5 py-2 rounded-full bg-white/20 border border-white/30 hover:bg-white/30 transition text-white font-medium"
          >
            {token ? "Logout ➟" : "Login"}
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <p className="text-center text-white/70">Loading notes...</p>
      ) : error ? (
        <p className="text-center text-rose-400">{error}</p>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {letters.map((letter) => (
            <motion.div
              key={letter._id}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 cursor-pointer relative"
            >
              <motion.div
                className={`absolute top-4 right-4 text-2xl cursor-pointer select-none ${
                  letter.liked ? "text-rose-500" : "text-white/60"
                }`}
                onClick={() => toggleLike(letter._id)}
                whileTap={{ scale: 1.3 }}
              >
                ♥
              </motion.div>
              <h2
                className="font-semibold text-pink-300 mb-2"
                onClick={() => setOpenedId(letter._id)}
              >
                {letter.toPerson}
              </h2>
              <p
                className="text-white/80 text-sm line-clamp-3 mb-2"
                onClick={() => setOpenedId(letter._id)}
              >
                {letter.message}
              </p>
              <p className="text-xs text-white/50 text-right">
                {formatFullDateTime(letter.Date)}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Note Button */}
      <motion.button
        onClick={() => setAddModal(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all font-medium"
      >
        + Add Note
      </motion.button>

      {/* Add Modal */}
      <AnimatePresence>
        {addModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-white/10 rounded-2xl p-6 text-white border border-white/30 backdrop-blur-sm"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <PostNotes setDisplay={() => setAddModal(false)} setLetters={setLetters} url={url} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {openedLetter && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg bg-white/10 rounded-2xl p-6 text-white border border-white/30 backdrop-blur-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-pink-300">
                  To: {openedLetter.toPerson}
                </h2>
                <motion.div
                  className={`text-2xl select-none cursor-pointer ${
                    openedLetter.liked ? "text-rose-500" : "text-white/60"
                  }`}
                  onClick={() => toggleLike(openedLetter._id)}
                  whileTap={{ scale: 1.3 }}
                >
                  ♥
                </motion.div>
              </div>
              <p className="text-white/50 mb-4 text-sm">
                {formatFullDateTime(openedLetter.Date)}
              </p>
              <div className="max-h-[60vh] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-pink-500/50 scrollbar-track-white/10">
                <p className="leading-relaxed whitespace-pre-wrap text-white/90">{openedLetter.message}</p>
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setOpenedId(null)}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg transition font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollbar */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(248,113,113,0.5); border-radius: 9999px; }
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: rgba(248,113,113,0.5) transparent; }
      `}</style>
    </div>
  );
}
