import React,{useState,useEffect} from 'react'
import './Statistics.css'
import { useNavigate } from 'react-router-dom'
import { BarChart } from '@mui/x-charts/BarChart';
// import {
//   BarChart,
//   Bar,
// } from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function Statistics() {
  const navigate = useNavigate();
  const [chartKey,setChartKey] = useState<string[]>([
    'uv','pv','amt'
  ])
  const [activeIndex,setActiveIndex] = useState<number>(0)

  return (
    <div className='stat_main'>
      <div className='stat_header'>
          <button className="word-item" style={{backgroundColor:'white',color:'black',marginRight:'25%'}}
           onClick={()=> navigate('/')}>{"<<  "} Back </button>
            <h2 style={{marginRight: '25%'}}>Display Statistics</h2>
      </div>
      <div className='stat_body'>
        <select>
          <option disabled>Select document</option>
          <option>Doc 1</option>
          <option>Doc 2</option>
          <option>Doc 3</option>
        </select>
        

        <div className='chart'>

    <BarChart
          xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
          series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
          width={500}
          height={300}
        />
        </div>
      </div>
    </div>
  )
}
