import React, { useState, useEffect } from 'react'
import './Statistics.css'
import { useNavigate } from 'react-router-dom'

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
    </div>
  )
}
