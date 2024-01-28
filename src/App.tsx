import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import DocumentPage from './pages/DocumentPage';
import WordsDisplayPage from './pages/WordsDisplayPage';
// Import other pages and components as needed

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          {/* Add your header or navigation bar here */}
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<DocumentPage />} />
            <Route path="/words-display" element={<WordsDisplayPage />} />
          </Routes>
        </main>
        <footer>
          {/* Footer content */}
        </footer>
      </div>
    </Router>
  );
}

export default App;
