import React, { useState } from "react";

export default function PostNotes({ setDisplay , url}) {
  const [author, setAuthor] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token")
  console.log(url)

const addNote = async () => {
  setError("");
  setSuccess("");

  if (!author.trim() || !message.trim()) {
    setError("Both fields are required ✍️");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${url}/post`, {
      method: "POST",
      headers: { authorization:token,
        "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        toPerson: author,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setSuccess(data.message || "Your note has been submitted 💌");
      setAuthor("");
      setMessage("");
      window.location.reload("/")
    } else {
      setError(data.message || "Something went wrong. Please try again 😢");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    setError("Server error. Please try again 😢");
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h1 className="text-2xl font-bold text-pink-600 mb-2 text-center">
        Anything You Have To Say
      </h1>
      <p className="text-sm text-pink-500 text-center mb-4">
        well, we have got alot to say
      </p>

      <form className="space-y-4">
        <div>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="To"
            className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
          />
        </div>
        <div>
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something..."
            className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm resize-none"
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}

        <div className="flex gap-3 items-center">
          <button
            type="button"
            onClick={addNote}
            disabled={loading}
            className={`flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-full transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Submitting..." : "✉️ Submit"}
          </button>
          <button
            type="button"
            onClick={() => setDisplay("none")}
            className="flex-1 border border-pink-300 py-2 rounded-full text-pink-600 hover:bg-pink-50 transition-all"
          >
            ❌ Close
          </button>
        </div>
      </form>
    </div>
  );
}
