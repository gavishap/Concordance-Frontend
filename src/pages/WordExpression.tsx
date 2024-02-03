import React,{useState,useEffect} from 'react'
import './WordGroup.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';


interface ToggleInterface{
    action: string;
    active: boolean;
}

export default function WordExpression({documents}:any) {
  const navigate = useNavigate();
  const [toggle,setToggle] = useState<ToggleInterface[]>([
    {
        action: 'GroupList',
        active: true
    },
    {
        action: 'AddGroup',
        active: false
    },
    {
        action: 'AddWord',
        active: false
    }
  ])
  const [groupsList,setGroupList] = useState<any>([])
  const [wordsList,setWordsList] = useState<any>([])
  const [documentText,setDocumentText] = useState<string[]>([])
  const [selectedDoc,setSelectedDoc] = useState<any>(documents[0])
  const [selectedText,setSelectedText] = useState<string[]>([])
  const [expressionInput,setExpressionInput] = useState<string>('')

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [page1, setPage1] = useState<number>(1);
  const [hasMore1, setHasMore1] = useState<boolean>(true);

  const [page2, setPage2] = useState<number>(1);
  const [hasMore2, setHasMore2] = useState<boolean>(true);

  const [isGroup,setIsGroup] = useState<boolean>(true);

  const [search,setSearch] = useState<string>('')
  const [filteredDocText,setFilteredDocText] = useState<string[]>([])

  

//   fetch list of words in group
  async function fetchWordsFromGroup(){
    setTimeout(()=>{
        setWordsList(['Dog','Pig','Goat'])
    },3000)
  }

  const onGroupSelect=(data:any)=>{
    let arr = [...groupsList].filter((item:any,ind:number)=> item?.name === data?.name)
    if(arr.length > 0)
        setWordsList([...arr[0]?.words?.split(" ")])
    setIsGroup(false)
  }

//   function to get all text from document
async function getDocumentData(filename: any) {
    try{
        const res = await fetch(`http://localhost:5000/documents?filename=${filename}`)
        const data = await res.json()
        setDocumentText([...data])
        }catch(e){
            console.log("Error Occured Fetching groups: ",e);
       }
}

async function saveNewExpression(){
    if(!expressionInput)
        return;
        fetch("http://localhost:5000/expression",{
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                expression: expressionInput,
                words_expression: selectedText.join(" ")
              })
        })
        .then(res => {
            if(res.status >= 200){
                setExpressionInput('')
                setSelectedText([])
                alert("Expression Added Successfully !!!")
            }
        })
        .then(data => console.log(data))
        .catch(err=> console.log(err))
}

async function fetchWordGroups(){
    try{
        const res = await fetch('http://localhost:5000/expression')
        const data = await res.json()
        console.log("Data: ",data)
        setGroupList([...data])
        }catch(e){
            console.log("Error Occured Fetching Expressions: ",e);
       }
}

useEffect(()=>{
    getDocumentData(selectedDoc?.name);
},[selectedDoc])


  useEffect(()=>{
    fetchWordGroups()
  },[])

  const updateToggle=(action:string)=>{
    let arr:ToggleInterface[] = [...toggle];
    arr.forEach((item: ToggleInterface,index:number)=>{
        if(item?.action === action){
            item.active = true
            if(item?.action==='GroupList'){
                fetchWordGroups();
            }
        }else{
            item.active = false;
        }
    })

    setToggle([...arr])
  }

  function filterDocWords(e:any){
    const str = e.target.value.toLowerCase();
    console.log('Search Value: ',str)
    setSearch(str)

    const t = documentText.filter((item:any,index:number)=> item.toLowerCase().includes(str))
    setFilteredDocText([...t])
  }



  return (
    <div className='main_group'>
        <div className='header_group'>
        <button className="word-item" onClick={()=> navigate('/')}>{"<<  "} Back </button>
            <h2 style={{marginRight: '20%'}}>Manage Word Expressions</h2>
        </div>
        <div className='body_group'>
            {/* display word groups */}
            {
                toggle.map((item: ToggleInterface,index:number)=>{
                    return(
                        <>
                            {item.action === 'GroupList' && item.active && <div className='groupList'>
                            {isGroup ? <InfiniteScroll
                                dataLength={groupsList.length}
                                next={() => setPage(prevPage => prevPage + 1)}
                                hasMore={hasMore}
                                loader={<h4>Loading ...</h4>}
                                endMessage={<p>No more words!</p>}
                                className="scrollable-words-list"
                            >
                                {groupsList.map((group:any) => (
                                    <button key={group?.name} type="button" onClick={() => onGroupSelect(group)} className="word-item">
                                        {group?.name}
                                    </button>
                                ))}
                            </InfiniteScroll> :
                            <> 
                            <InfiniteScroll
                            dataLength={wordsList.length}
                            next={() => setPage1(prevPage => prevPage + 1)}
                            hasMore={hasMore1}
                            loader={<h4>Loading ...</h4>}
                            endMessage={<p>No more words!</p>}
                            className="scrollable-words-list"
                        >
                            {wordsList.map((word:any) => (
                                <button key={word} type="button" className="word-item">
                                    {word}
                                </button>
                            ))}
                        </InfiniteScroll> 

                        <button  className="word-item" style={{backgroundColor:'darkred'}}
                        onClick={()=> setIsGroup(true)}
                        >{" <-- "}Back to Expressions</button>
                        </>

                            }
                            </div>
                            }

                            {item.action === 'AddGroup' && item.active && <div className='addGroup'>
                                <h3 style={{color: 'darkblue'}}>Words In Expression: {
                                    selectedText.map((item:string,index:number)=>{
                                        return(
                                            <span 
                                            style={{border: '2px solid orange', padding:'1%',borderRadius:'3px',margin:'1%'}}>
                                                {item}
                                            </span>
                                        )
                                    })
                                }</h3>

                                <div className='add-expression-input-wrapper'>
                                <div>
                                <label style={{fontWeight:'bold'}}>Select Document:</label><br />
                                <select onChange={(e)=>{
                                    const str = e.target.value.replace(".txt","")
                                    const obj = documents.find((item:any,index:number)=> item?.name === str);
                                    setSelectedDoc(obj)
                                }}>
                                    {
                                        documents?.map((doc:any,index:number)=>{
                                            return(
                                                <option>{doc?.name+".txt"}</option>
                                            )
                                        })
                                    }
                                </select>
                                </div>

                                <div>
                                <label style={{fontWeight:'bold'}}>Enter Expression Name:</label><br />
                                <input type='text'
                                onChange={(e)=> setExpressionInput(e.target.value)}
                                placeholder='Enter expression name ...'/>
                                </div>

                                <div>
                                    <label style={{fontWeight:'bold'}}>Search Word:</label><br />
                                    <input type='text'
                                    onChange={filterDocWords}
                                    value={search}
                                    placeholder='Search word ...'/>
                                </div>
                            </div>
                                
                                    { !search ? 
                                    <div className='doc-words'>
                                    {
                                    documentText.map((word:any,index:number) => (
                                            <button key={word+index.toString()}
                                            onClick={()=> setSelectedText((prev)=> [...prev,word])}
                                            type="button" className="word-item">
                                                {word}
                                            </button>
                                        ))
                                    }
                                        </div>
                                        :
                                        <div className='doc-words'>
                                            {
                                        filteredDocText.map((word:any,index:number) => (
                                            <button
                                            key={word+index.toString()}
                                            onClick={()=> setSelectedText((prev)=> [...prev,word])}
                                            type="button" className="word-item">
                                                {word}
                                            </button>
                                        ))
                                        }
                                        </div>
                                    }

                               
                        
                            <div className='button-wrapper'>
                                <button className="word-item" style={{backgroundColor:'green'}} 
                                    onClick={()=> saveNewExpression()}
                                    >Save Expression</button>

                                <button className="word-item" style={{backgroundColor:'darkred'}} 
                                    onClick={()=> setSelectedText([])}
                                    >Clear Words</button>

                                <button className="word-item" style={{backgroundColor:'orange'}} 
                                    onClick={()=> setSearch('')}
                                    >Clear Search</button>
                                </div>
                            </div>
                            }
                        </>
                    )
                })
            }
        </div>
        <div className='footer_group'>
            <button onClick={()=> updateToggle('GroupList')} className='btn1'>View Expressions</button>
            <button onClick={()=> updateToggle('AddGroup')}  className='btn2'>Add Expression</button>
        </div>
    </div>
  )
}
