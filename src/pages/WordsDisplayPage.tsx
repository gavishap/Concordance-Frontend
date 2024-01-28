// WordsDisplayPage.tsx
import React, { useState } from 'react';
import WordsList from '../components/WordsList/WordsList';
import WordContextViewer from '../components/WordContextViewer/WordContextViewer';
import './WordsDisplayPage.css';

interface FilterStructure {
    documentId: string;
    doc_id: string;
    startingLetter: string;
    paragraph: string;
    sentence: string;
    lineNumber: string;
    lineRange: string;
}

const WordsDisplayPage = () => {
    const [selectedWord, setSelectedWord] = useState<string>('');
    const [data, setData] = useState<string[]>([]); // Change this to an array of Word objects [
    const [filters, setFilters] = useState<FilterStructure>({
        documentId: '',
        doc_id: '',
        startingLetter: '',
        paragraph: '',
        sentence: '',
        lineNumber: '',
        lineRange: ''
    });

    const handleWordSelect = (word: string) => {
        alert(`Word Select: ${word}`)
        setSelectedWord(word);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const fetchData = async () => {
        // try {
        try {
            const res = await fetch('http://localhost:5000/words?doc_id=1&startingLetter=a');
            const data = await res.json();

            setData([JSON.stringify(data)]);
        } catch (error: any) {
            console.error('Error fetching words:', error);
            setData([error?.message.toString()]);
        }
    }
    fetchData();

    return (
        <div className="words-display-page">
            <span>Data: {data.toString()}</span>
            <div className="filters">
                <input name="doc_id" placeholder="Filter by Document ID" value={filters.doc_id} onChange={handleFilterChange} />
                <input name="startingLetter" placeholder="Starting Letter" value={filters.startingLetter} onChange={handleFilterChange} />
                {/* Add more inputs for other filter criteria */}
                {/* ... */}
            </div>
            <WordsList onWordSelect={handleWordSelect} filters={filters} />
            {selectedWord && <WordContextViewer word={selectedWord} filters={filters} />}
        </div>
    );
};

export default WordsDisplayPage;
