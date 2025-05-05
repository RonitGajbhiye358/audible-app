import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../app/authSlice';
import api from '../../api/api';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    narrator: '',
    time: 0,
    release_date: '',
    language: '',
    stars: 0.0,
    price: 0.0,
    ratings: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const token = useSelector(selectCurrentToken);
  const [fileForBook, setFileForBook] = useState({}); // Track files per book

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/admin/all-audiobooks');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [token]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/audiobook/add', newBook,);
      const addedBook = response.data;
      setBooks([...books, addedBook]);
      setNewBook({
        title: '',
        author: '',
        narrator: '',
        time: 0,
        release_date: '',
        language: '',
        stars: 0.0,
        price: 0.0,
        ratings: 0
      });
      // If a file was selected, upload it after book creation
      if (selectedFile) {
        await handleUploadAudio(addedBook.bookId);
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleFileChange = (e, bookId = null) => {
    const file = e.target.files[0];
    if (bookId) {
      setFileForBook(prev => ({ ...prev, [bookId]: file }));
    } else {
      setSelectedFile(file);
    }
  };

  const handleUploadAudio = async (bookId) => {
    const fileToUpload = fileForBook[bookId] || selectedFile;
    if (!fileToUpload) return;
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('audioFile', fileToUpload);

      await api.post(`/admin/audiobook/upload-audio/${bookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });

      // Update the book's audio status in state
      setBooks(books.map(book => 
        book.bookId === bookId ? { ...book, audioData: true } : book
      )); 
      alert('Audio uploaded successfully!');
      // Clear the appropriate file state
      if (fileForBook[bookId]) {
        setFileForBook(prev => {
          const newState = { ...prev };
          delete newState[bookId];
          return newState;
        });
      } else {
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Failed to upload audio');
    } finally {
      setUploading(false);
    }
  };


  const handleDeleteBook = async (id) => {
    try {
      await api.delete(`/admin/audiobook/delete/${id}`);
      setBooks(books.filter(book => book.bookId !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleUpdateField = async (bookId, fieldName, newValue) => {
    try {
      const response = await api.put(`/admin/audiobook/update-price/${bookId}`, null, {
        params: { [fieldName]: newValue }
      });
      setBooks(books.map(book => 
        book.bookId === bookId ? { ...book, [fieldName]: response.data[fieldName] } : book
      ));
    } catch (error) {
      console.error(`Error updating book ${fieldName}:`, error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Books</h1>
      
      {/* Add Book Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
        <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title*</label>
            <input
              type="text"
              value={newBook.title}
              onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author*</label>
            <input
              type="text"
              value={newBook.author}
              onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Narrator*</label>
            <input
              type="text"
              value={newBook.narrator}
              onChange={(e) => setNewBook({...newBook, narrator: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)*</label>
            <input
              type="number"
              min="1"
              value={newBook.time}
              onChange={(e) => setNewBook({...newBook, time: parseInt(e.target.value)})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Release Date*</label>
            <input
              type="date"
              value={newBook.release_date}
              onChange={(e) => setNewBook({...newBook, release_date: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language*</label>
            <input
              type="text"
              value={newBook.language}
              onChange={(e) => setNewBook({...newBook, language: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={newBook.stars}
              onChange={(e) => setNewBook({...newBook, stars: parseFloat(e.target.value)})}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price*</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newBook.price}
              onChange={(e) => setNewBook({...newBook, price: parseFloat(e.target.value)})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ratings Count</label>
            <input
              type="number"
              min="0"
              value={newBook.ratings}
              onChange={(e) => setNewBook({...newBook, ratings: parseInt(e.target.value)})}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-1">Audio File</label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
          </div>

          <div className="md:col-span-3 flex items-center gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={uploading}
            >
              {uploading ? 'Processing...' : 'Add Book'}
            </button>
            
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Books List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4">Book ID</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Narrator</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Language</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Audio</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {books.map(book => (
              <tr key={book.bookId} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{book.bookId}</td>
                <td className="py-3 px-4">{book.title}</td>
                <td className="py-3 px-4">{book.author}</td>
                <td className="py-3 px-4">{book.narrator}</td>
                <td className="py-3 px-4">{book.time}</td>
                <td className="py-3 px-4">{book.language}</td>
                <td className="py-3 px-4">{book.stars}</td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={book.price}
                    onChange={(e) => handleUpdateField(book.bookId, 'price', parseFloat(e.target.value))}
                    className="w-20 border rounded px-2 py-1"
                  />
                </td>
                <td className="py-3 px-4">
                  {book.audioData ? (
                    <span className="text-green-500">✓ Uploaded</span>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        id={`audio-upload-${book.bookId}`}
                        accept="audio/*"
                        onChange={(e) => handleFileChange(e, book.bookId)}
                        className="hidden"
                      />
                      <label 
                        htmlFor={`audio-upload-${book.bookId}`}
                        className="text-blue-500 cursor-pointer hover:underline"
                      >
                        Upload
                      </label>
                      {fileForBook[book.bookId] && (
                        <button 
                          onClick={() => handleUploadAudio(book.bookId)}
                          className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  )}
                </td>
                
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDeleteBook(book.bookId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBooks;

