import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DocumentUploader = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file); // Set the selected file
    setFileName(file.name); // Update the file name state
    onFileSelect(file); // Notify the parent component
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop,
  });

  return (
    <div className="container">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or use the button to select files</p>
        )}
        <button type="button"  className='word-items'  onClick={open}>Select Files</button>
        {selectedFile && (
          <div>
            <p>Selected file: {fileName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;
