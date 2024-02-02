// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  console.log('Rendering HomePage component');
  return (
    <div>
      <h1>Document Concordance and Text Retrieval System</h1>
      <nav>
        <ul>
          <li><Link to="/upload">Upload Documents</Link></li>
          <li><Link to="/words-display">Display Words</Link></li>
          <li><Link to="/words-group">Manage Word Groups</Link></li>
          <li><Link to="/words-expressions">Manage Expressions</Link></li>
          <li><Link to="/stats">Display Statistics</Link></li>
        </ul>
      </nav>
      <main>
        <p>Content will be displayed here based on the selected menu option.</p>
      </main>
    </div>
  );
}

export default HomePage;
