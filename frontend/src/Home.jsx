import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Add form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Edit form state
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(data);
    } catch (err) {
      setError("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add note
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/notes",
        { title: newTitle, description: newDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAddModal(false);
      setNewTitle("");
      setNewDescription("");
      fetchNotes();
    } catch (err) {
      setError("Failed to create note");
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      setError("Failed to delete note");
    }
  };

  // Open edit modal
  const openEditModal = (note) => {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditDescription(note.description);
    setShowEditModal(true);
  };

  // Update note
  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/notes/${editId}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowEditModal(false);
      fetchNotes();
    } catch (err) {
      setError("Failed to update note");
    }
  };

  // FILTER NOTES BASED ON SEARCH
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative container mx-auto px-4 py-8 min-h-screen bg-gray-100">

      {/* ERROR MESSAGE */}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* SEARCH BAR */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full p-3 border rounded-lg shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* NOTES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
              <p className="text-gray-700 mb-4">{note.description}</p>

              <p className="text-sm text-gray-400">
                {new Date(note.updatedAt).toLocaleString()}
              </p>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => openEditModal(note)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(note._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No notes found</p>
        )}
      </div>

      {/* FLOATING ADD BUTTON */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl text-3xl flex items-center justify-center hover:bg-blue-700"
      >
        +
      </button>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Note</h2>

            <form onSubmit={handleAddNote} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
              />

              <textarea
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded h-24"
              />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Note</h2>

            <form onSubmit={handleUpdateNote} className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
              />

              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded h-24"
              />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
