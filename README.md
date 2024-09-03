# Concord Electron: Text Analysis and Concordance Tool

Concord Electron is an advanced desktop application designed for text analysis and concordance. It leverages Electron, React, and TypeScript to provide a powerful, cross-platform solution for processing, analyzing, and visualizing textual data. The application integrates seamlessly with a Flask backend API for robust text processing capabilities.

## Key Features

- Document upload and management
- Word frequency analysis and visualization
- Concordance and context viewing
- Word grouping and expression management
- Statistical analysis of text documents
- Data mining capabilities
- Cross-platform compatibility (Windows, macOS, Linux)
- Modern, responsive UI with Material-UI components
- Real-time data visualization using Recharts and MUI X-Charts
- Efficient file handling with react-dropzone
- Infinite scrolling for large datasets

## Tech Stack

### Frontend
- Electron
- React
- TypeScript
- Material-UI
- Recharts and MUI X-Charts
- React Router
- React Dropzone

### Backend
- Flask (Python)
- MySQL database
- NLTK (Natural Language Toolkit)
- spaCy

### Build and Development
- Vite
- Electron Builder

## Project Architecture

Concord Electron follows a modular architecture:

1. Electron Main Process: Handles native desktop functionalities and window management.
2. Electron Renderer Process: Runs the React application.
3. React Frontend: Built with functional components and hooks, managing state through React's Context API.
4. Preload Scripts: Enhance security by bridging Electron's main and renderer processes.
5. Flask Backend API: Provides endpoints for text processing, analysis, and database operations.

The application uses Vite for fast development and optimized production builds, with Electron Builder for packaging the desktop application.

## Key Components

1. Document Management (DocumentPage.tsx):
   Allows users to upload and manage text documents.

2. Word Display and Context (WordsDisplayPage.tsx):
   Displays words from documents and their contexts.

3. Word Grouping (WordGroup.tsx):
   Enables users to create and manage word groups.

4. Expression Management (WordExpression.tsx):
   Allows creation and management of word expressions.

5. Statistical Analysis (Statistics.tsx):
   Provides statistical insights into text documents.

6. Data Mining (DataMining.tsx):
   Offers advanced text analysis and data mining capabilities.

## Backend API

The Flask backend provides RESTful endpoints for:
- Document upload and retrieval
- Text tokenization and processing
- Word frequency analysis
- Concordance generation
- Statistical analysis of text
- Data mining operations

## Database

The application uses MySQL to store:
- Document metadata
- Processed text data
- Word groups and expressions
- Analysis results

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/concord_electron.git
   cd concord_electron
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Set up the backend:
   - Install Python dependencies: `pip install flask mysql-connector-python nltk spacy`
   - Download spaCy model: `python -m spacy download en_core_web_sm`
   - Set up MySQL database

4. Start the development server:
   ```
   npm run dev
   ```

5. To build for production:
   ```
   npm run build
   ```

## Usage

Launch the application to access the main interface. Use the navigation menu to:
- Upload and manage documents
- Analyze word frequencies and contexts
- Create and manage word groups and expressions
- View statistical analyses of texts
- Perform data mining operations

## Future Enhancements

- Implement user authentication and profile management
- Add support for multiple languages in text analysis
- Integrate machine learning models for advanced text classification
- Enhance data visualization with interactive, customizable charts
- Implement real-time collaboration features for team analysis

## Contributing

Contributions to Concord Electron are welcome. Please follow the contribution guidelines outlined in the project repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

For specific code references:

Main Electron configuration:

```1:60:electron/main.ts
import { app, BrowserWindow } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})
app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
```


React application entry point:

```1:55:src/App.tsx
import React,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import DocumentPage from './pages/DocumentPage';
import WordsDisplayPage from './pages/WordsDisplayPage';
import WordGroup from './pages/WordGroup';
import WordExpression from './pages/WordExpression';
import Statistics from './pages/Statistics'
import DataMining from './pages/DataMining';
// Import other pages and components as needed

function App() {
  const [documentList,setDocumentList] = useState<any[]>([]);

  const fetchDocuments = async ()=>{
    try{  
      const res = await fetch("http://localhost:5000/documents")
      const data = await res.json();
      setDocumentList([...data]);
    }catch(e){
      console.log("Failed to fetch documents",e)
    }
  }

  React.useEffect(()=>{
    fetchDocuments();
  },[])

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
            <Route path="/words-group" element={<WordGroup documents={documentList} />} />
            <Route path='/words-expressions' element={<WordExpression documents={documentList} />} />
            <Route path='/stats' element={<Statistics documents={documentList} />} />
            <Route path='/data-mining' element={<DataMining documents={documentList} />} />
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
```


Example of a key component (DataMining):

```5:106:src/pages/DataMining.tsx
export default function DataMining({ documents }: any) {
  const navigate = useNavigate();
  const [documentText, setDocumentText] = useState<string[]>([])
  const [selectedDoc, setSelectedDoc] = useState<any>(documents[0])
  const [miningData, setMiningData] = useState<any>({})
  const [keys, setKeys] = useState<any[]>([])


  async function getFileMining() {
    if(!selectedDoc?.name) return;
    try {
      const res = await fetch(`http://localhost:5000/data-mining?filename=${selectedDoc?.name}`)
      const data = await res.json()
      const response = formatResponse(data)
      setMiningData({ ...response?.res })
      setKeys([...response?.keys])
    } catch (e) {
      console.log("Error Occured Fetching groups: ", e);
    }
  }

  useEffect(() => {
    getFileMining();
  }, [selectedDoc])

  const formatResponse = (arr: any) => {

    const t = arr.map((item: any, i: number) => {
      return Object.values(item)[1]
    })
    const keys = new Set([...t])
    let res: any = {}
    for (const key of keys) {
      res[key] = []
    }

    arr.forEach((item: any, i: number) => {
      let temp = res[item?.type]
      temp.push(item?.text)
      res[item?.type] = temp
    })

    return { keys, res };
  }
  function f() {
    console.log("Min: ", miningData)
  }
  f()

  return (
    <div className='stat_main'>
      <div className='stat_header stat_header1'>
        <button className="word-item" style={{ backgroundColor: 'white', color: 'black', marginRight: '25%' }}
          onClick={() => navigate('/')}>{"<<  "} Back </button>
        <h2 style={{ marginRight: '25%' }}>Data Mining</h2>
      </div>
      <div className='stat_body'>
        <select onChange={(e: any) => {
          const str = e.target.value.replace(".txt", "")
          const obj = documents.find((item: any, index: number) => item?.name === str);
          setSelectedDoc(obj)
        }}>
          {
            documents?.map((doc: any, index: number) => {
              return (
                <option key={doc?.name}>{doc?.name + ".txt"}</option>
              )
            })
          }
        </select>


        <div className='chart chart1'>
          <h3>Result from Data mining algorithm</h3>
          <div className='data-mining'>
            <div className='tbl-headinds'>
              {
                keys?.map((item: string, i: number) => {
                  return (
                    <div key={item + i.toString()} style={{width: Math.ceil(100/keys?.length)+"%"}}>{item}</div>
                  )
                })
              }
              </div>
              <div className='tbl-columns-wrapper'>
                {
                  keys?.map((key: any, index: number) =>
                    <div className='tbl-columns' style={{width: Math.ceil(100/keys?.length)+"%"}}>
                      {
                        miningData[key]?.map((itm: any, i: number) =>
                          <div>{itm}</div>
                        )
                      }
                    </div>
                  )
                }
              </div>
           
          </div>
        </div>
      </div>
