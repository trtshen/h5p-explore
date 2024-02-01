"use client"
import React, { useState } from 'react';

export default function H5P() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleFileChange = (event) => {
    if (!event?.target?.files) return;

    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setIsLoading(true); // Start loading
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully');
      } else {
        alert('File upload failed');
      }
    } catch (error) {
      alert('Error during upload');
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col space-y-4">
      <h1 className="text-2xl font-bold mb-4">Upload H5P File</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-md p-2 border rounded"
        />
        <button
          type="submit"
          className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          disabled={isLoading} // Disable the button when loading
        >
          {isLoading ? 'Uploading...' : 'Upload'} {/* Change button text based on loading status */}
        </button>
      </form>

      {isLoading && <div>Loading...</div>} {/* Loading indicator */}
    </div>
  );
}
