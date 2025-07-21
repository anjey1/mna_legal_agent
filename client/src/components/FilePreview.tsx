import React from 'react';

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
    const style: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        margin: '5px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    };

    const buttonStyle: React.CSSProperties = {
        background: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '5px 10px',
        cursor: 'pointer'
    };

    return (
        <div style={style}>
            <span>{file.name}</span>
            <button
                onClick={onRemove}
                style={buttonStyle}
            >
                Remove
            </button>
        </div>
    );
}; 