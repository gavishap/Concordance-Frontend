// WordContextViewer.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WordContextViewer.css';

interface FilterStructure {
    documentId: string;
    startingLetter: string;
    paragraph: string;
    sentence: string;
    lineNumber: string;
    lineRange: string;
}

interface WordContextViewerProps {
    word: string;
    filters: FilterStructure;
}

const WordContextViewer = ({ word, filters }: WordContextViewerProps) => {
    const [context, setContext] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        if (word) {
            const fetchContext = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/word-context', {
                        params: { word, ...filters }
                    });
                    setContext(response.data.context);
                    setCurrentIndex(0); // Reset index on new word
                } catch (error) {
                    console.error('Error fetching word context:', error);
                }
            };
            fetchContext();
        }
    }, [word, filters]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, context.length - 1));
    };

    return (
        <div className="word-context-viewer">
            {context.length > 0 ? (
                <>
                    <button type="button" onClick={handlePrev} disabled={currentIndex === 0}>Previous</button>
                    <div className="context-display">
                        {context[currentIndex]}
                    </div>
                    <button type="button" onClick={handleNext} disabled={currentIndex === context.length - 1}>Next</button>
                </>
            ) : (
                <p>Select a word to view its context.</p>
            )}
        </div>
    );
};

export default WordContextViewer;
