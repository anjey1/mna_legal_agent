import { useState, useCallback } from 'react';
import axios from 'axios';
import type { ProcessingResult } from '../types';

export function useFileUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDragActive, setIsDragActive] = useState<boolean>(false);

    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const validFiles = acceptedFiles.filter(file =>
            allowedTypes.includes(file.type)
        );

        if (validFiles.length !== acceptedFiles.length) {
            setError('Only PDF and DOCX files are allowed');
        }

        setFiles(prev => [...prev, ...validFiles]);
        setIsDragActive(false);
    }, []);

    const removeFile = (fileToRemove: File) => {
        setFiles(prev => prev.filter(file => file !== fileToRemove));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select files to upload');
            return;
        }

        setIsUploading(true);
        setError(null);
        setProcessingResult(null);

        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await axios.post<ProcessingResult>('http://localhost:3000/api/documents/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setProcessingResult(response.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'An error occurred during upload');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsUploading(false);
        }
    };

    const resetFileUpload = () => {
        setFiles([]);
        setProcessingResult(null);
        setError(null);
    };

    return {
        files,
        processingResult,
        error,
        isUploading,
        isDragActive,
        onDrop,
        removeFile,
        handleUpload,
        resetFileUpload,
        setError
    };
} 