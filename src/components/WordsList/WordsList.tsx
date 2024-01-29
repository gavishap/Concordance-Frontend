import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import './WordsList.css';

interface FilterStructure {
    documentId: string;
    doc_id: string;
    startingLetter: string;
    paragraph: string;
    sentence: string;
    lineNumber: string;
    lineRange: string;
}

interface WordsListProps {
    onWordSelect: (word: string) => void;
    filters: FilterStructure;
}


const WordsList = ({ onWordSelect, filters }: WordsListProps) => {
    const [words, setWords] = useState<string[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

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
        const fetchWords = async () => {
            if (formatFilters()?.includes('=')) {
                try {
                    const res = await fetch(`http://localhost:5000/words${formatFilters()}`);
                    const data = await res.json();
                    // data from database
                    console.log("Data: ",data)

                    setWords([...data]);
                } catch (error) {
                    alert('Error occured when fetching Words try again !!!')
                }
            } 
        };
        fetchWords();
        // rest of your code
    }, [formatFilters]);


    return (
        <div className="words-list-container">
            <InfiniteScroll
                dataLength={words.length}
                next={() => setPage(prevPage => prevPage + 1)}
                hasMore={hasMore}
                loader={<h4>Loading ...</h4>}
                endMessage={<p>No more words!</p>}
                className="scrollable-words-list"
            >
                {words.map((word) => (
                    <button key={word} type="button" onClick={() => onWordSelect(word)} className="word-item">
                        {word}
                    </button>
                ))}
            </InfiniteScroll> 
        </div>
    );
};

export default WordsList;