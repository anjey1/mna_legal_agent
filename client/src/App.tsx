// Import components
import { FileDropzone } from './components/FileDropzone';
import { FilePreview } from './components/FilePreview';
import { ProcessingResultDisplay } from './components/ProcessingResultDisplay';
import { ClauseEnhancementPanel } from './components/ClauseEnhancementPanel';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ModeToggleButton } from './components/ModeToggleButton';

// Import hooks
import { useFileUpload } from './hooks/useFileUpload';
import { useClauseEnhancement } from './hooks/useClauseEnhancement';
import { useModeToggle } from './hooks/useModeToggle';

function App() {
  const {
    files,
    processingResult: fileProcessingResult,
    error: fileError,
    isUploading,
    isDragActive,
    onDrop,
    removeFile,
    handleUpload,
    resetFileUpload,
    setError: setFileError
  } = useFileUpload();

  const {
    clauseText,
    setClauseText,
    perspective,
    setPerspective,
    processingResult: clauseProcessingResult,
    error: clauseError,
    isEnhancing,
    handleEnhanceClause,
    resetClauseEnhancement,
    setError: setClauseError
  } = useClauseEnhancement();

  const { mode, toggleMode } = useModeToggle();

  const processingResult = mode === 'upload'
    ? fileProcessingResult
    : clauseProcessingResult;

  const error = mode === 'upload' ? fileError : clauseError;

  const resetMode = () => {
    if (mode === 'upload') {
      resetFileUpload();
    } else {
      resetClauseEnhancement();
    }
  };

  const Loader = () => (
    <div className="loader" style={{
      border: '5px solid #f3f3f3',
      borderRadius: '50%',
      borderTop: '5px solid #3498db',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite'
    }}></div>
  );

  return (
    <div style={{
      maxWidth: '90%',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <ModeToggleButton
        mode={mode}
        toggleMode={() => {
          toggleMode();
          resetMode();
        }}
      />

      {mode === 'upload' ? (
        <>
          {isUploading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <Loader />
            </div>
          ) : (
            <>
              <FileDropzone
                onDrop={onDrop}
                isDragActive={isDragActive}
              />

              <ErrorDisplay
                error={error}
                onClose={() => setFileError(null)}
              />

              {files.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Selected Files:</h3>
                  {files.map((file, index) => (
                    <FilePreview
                      key={index}
                      file={file}
                      onRemove={() => removeFile(file)}
                    />
                  ))}

                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      marginTop: '10px',
                      cursor: isUploading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Files'}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        isEnhancing ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Loader />
          </div>
        ) : (
          <ClauseEnhancementPanel
            clauseText={clauseText}
            setClauseText={setClauseText}
            perspective={perspective}
            setPerspective={setPerspective}
            error={error}
            isEnhancing={isEnhancing}
            onEnhanceClause={handleEnhanceClause}
            onErrorClose={() => setClauseError(null)}
          />
        )
      )}

      {processingResult && (
        <ProcessingResultDisplay result={processingResult} />
      )}
    </div>
  );
}

export default App;