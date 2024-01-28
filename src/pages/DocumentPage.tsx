import React, { useState } from 'react';
import DocumentUploader from '../components/DocumentUploader/DocumentUploader';
import FileMetadataForm from '../components/FileMetadata/FileMetadataForm';
import axios from 'axios';
import './DocumentPage.css';
import { useNavigate } from 'react-router-dom';

interface Metadata {
  name: string;
  location: string;
  author: string;
  date: string; // or Date if you're using a Date object
  source: string;
}

const DocumentPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleMetadataSubmit = async (metadata: Metadata) => {
    console.log('Metadata submitted:', metadata);

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Append each metadata field to the formData
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key as keyof Metadata]);
      });

      try {
        const response = await axios.post('http://localhost:5000/upload', formData);
        console.log(response.data);
        // Handle the response from the server, such as displaying a success message
      } catch (error) {
        console.error('Error uploading the document:', error);
        // Handle the error, such as displaying an error message
      }
    }
  };

  return (
    <div className="document-page-container">
      <button type="button" onClick={() => navigate("/")}>Back</button>
      <h2>Upload a Document</h2>
      <DocumentUploader onFileSelect={onFileSelect} />
      {selectedFile && <FileMetadataForm onSubmit={handleMetadataSubmit} />}
    </div>
  );
};

export default DocumentPage;
