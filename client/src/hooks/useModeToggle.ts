import { useState } from 'react';

export function useModeToggle() {
    const [mode, setMode] = useState<'upload' | 'enhance'>('upload');

    const toggleMode = () => {
        setMode(prevMode => prevMode === 'upload' ? 'enhance' : 'upload');
    };

    return {
        mode,
        toggleMode
    };
} 