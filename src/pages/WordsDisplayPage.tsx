// WordsDisplayPage.tsx
import React, { useState } from 'react';
import WordsList from '../components/WordsList/WordsList';
import WordContextViewer from '../components/WordContextViewer/WordContextViewer';
import './WordsDisplayPage.css';
import { useNavigate } from 'react-router-dom';

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
    const [isWordVisible, setIsWordVisible] = useState<Boolean>(false);
    const navigate = useNavigate();
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
        setIsWordVisible(true)
        setSelectedWord(word);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsWordVisible(false)
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="words-display-page">
            <div className="filters">

                <input name="doc_id" placeholder="Filter by Document ID" value={filters.doc_id} onChange={handleFilterChange} />
                <input name="startingLetter" placeholder="Starting Letter" value={filters.startingLetter} onChange={handleFilterChange} />
                <input name="paragraph" placeholder="Paragraph" value={filters.paragraph} onChange={handleFilterChange} />
                <input name="sentence" placeholder="Sentence" value={filters.sentence} onChange={handleFilterChange} />
                <input name="lineNumber" placeholder="Line Number" value={filters.lineNumber} onChange={handleFilterChange} />
                <input name="lineRange" placeholder="Line Range" value={filters.lineRange} onChange={handleFilterChange} />

            </div>


            {isWordVisible ?
                <WordContextViewer word={selectedWord} filters={filters} />
                :
                <WordsList onWordSelect={handleWordSelect} filters={filters} />
            }

            <button type="button" onClick={() => navigate("/")} className='word-item'>{"<< "}Back</button>
        </div>


    );
};

export default WordsDisplayPage;
