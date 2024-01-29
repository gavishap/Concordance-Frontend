// WordContextViewer.tsx
import React, { useState, useEffect,useCallback } from 'react';
import './WordContextViewer.css';

interface FilterStructure {
    documentId: string;
    doc_id: string;
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

interface WordContextResponse{
    doc_name: string;
    document: string;
    position: string;
    word: string;
}

const WordContextViewer = ({ word, filters }: WordContextViewerProps) => {
    const [context, setContext] = useState<WordContextResponse[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const formatFilters = useCallback(() => {
        let str = '?';
        for (const key in filters) {
            if (filters[key as keyof FilterStructure] !== '') {
                str += `${key}=${filters[key as keyof FilterStructure]}&`
            }
        }
        return str.substring(0, str.length - 1);
    }, [filters]);

    useEffect(() => {
        const fetchWordsContext = async () => {
            if (formatFilters()?.includes('=')) {
                try {
                    const res = await fetch(`http://localhost:5000/word-context?word=${word}&${formatFilters()}`);
                    const data = await res.json();
                    // data from database
                    console.log("Data: ",data)

                    setContext([...data])
                    setCurrentIndex(0)
                } catch (error) {
                    alert('Error occured when fetching Word Context !!!')
                }
            } 
        };
        fetchWordsContext();
        // rest of your code
    }, [formatFilters]);

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
                        {context[currentIndex]?.word}
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
