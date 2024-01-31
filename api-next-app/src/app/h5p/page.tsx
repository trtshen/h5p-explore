"use client";
import React, { useState } from 'react';

export default function H5P() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event: any) => {
    if (!event?.target?.files) return;
    
    setSelectedFile(event.target.files[0]);
    // Additional validation can be added here
  };

  const handleSubmit = async (event: any) => {
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

  const accessToS3 = async () => {
    const response = await fetch('/api/file?filename=sizzling');
    const data = await response.text();
    console.log('data', data);
  };

  const accessToS3Folder = async () => {
    const response = await fetch('/api/folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder: 'sizzling' }),
    });
    const data = await response.json();
    console.log('app-data', data);
  }

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
        >
          Upload
        </button>
      </form>
      <button onClick={accessToS3}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >Access to S3</button>
      <button onClick={accessToS3Folder}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >Access to S3 Folder</button>
    </div>
  );
}
