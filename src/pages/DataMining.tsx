import React, { useState, useEffect } from 'react'
import './Statistics.css'
import { useNavigate } from 'react-router-dom'
import { BarChart } from '@mui/x-charts/BarChart';

export default function DataMining({ documents }: any) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [documentText, setDocumentText] = useState<string[]>([])
  const [selectedDoc,setSelectedDoc] = useState<any>(documents[0])
  const [chartKeys,setChartKeys] = useState<string[]>([''])
  const [chartVals,setChartVals] = useState<number[]>([0])

  //   function to get all text from document
  async function getDocumentData(filename: any) {
    try {
      const res = await fetch(`http://localhost:5000/documents?filename=${filename}`)
      const data = await res.json()
      setDocumentText([...data])
    } catch (e) {
      console.log("Error Occured Fetching groups: ", e);
    }
  }

  async function getFileStats(){
    try {
      const res = await fetch(`http://localhost:5000/statistics?filename=${selectedDoc?.name}`)
      const data = await res.json()
      const values:number[] = Object.values(data);
      const keys:string[] = Object.keys(data)

      setChartVals([...values])
      setChartKeys([...keys])
    } catch (e) {
      console.log("Error Occured Fetching groups: ", e);
    }
  }

  useEffect(()=>{
      getDocumentData(selectedDoc?.name);
      getFileStats();
  },[selectedDoc])
  

  
  return (
    <div className='stat_main'>
      <div className='stat_header'>
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


        <div className='chart'>

          <BarChart
            xAxis={[{ scaleType: 'band', data: [...chartKeys] }]}
            series={[{ data: [...chartVals] }]}
            width={500}
            height={300}
          />
        </div>
      </div>
    </div>
  )
}
