import React from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
    onDrop: (files: File[]) => void;
    isDragActive?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onDrop, isDragActive = false }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        multiple: true
    });

    return (
        <div
            {...getRootProps()}
            style={{
                border: '2px dashed #cccccc',
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? '#f0f0f0' : 'white'
            }}
        >
            <h1>Analyze Documents</h1>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag 'n' drop PDF and DOCX files here, or click to select files</p>
            )}
        </div>
    );
}; 