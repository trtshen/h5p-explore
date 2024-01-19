"use client";
import React, { useState } from 'react';

export default function H5P() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    // Additional validation can be added here
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Replace with your API endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    // Handle the response from the server
    if (response.ok) {
      alert('File uploaded successfully');
    } else {
      alert('File upload failed');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload H5P File</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-md p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
