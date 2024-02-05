import React,{useState,useEffect} from 'react'
import './WordGroup.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';


interface ToggleInterface{
    action: string;
    active: boolean;
}

interface InputData{
    id: number;
    text: string;
}

export default function WordGroup({document}:any) {
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
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [wordInput,setWordInput] = useState<InputData>({
    id: -1,
    text: ''
  });
  const [groupInput,setGroupInput] = useState<InputData>({
    id: -1,
    text: ''
  });

  const [page1, setPage1] = useState<number>(1);
  const [hasMore1, setHasMore1] = useState<boolean>(true);

  const [isGroup,setIsGroup] = useState<boolean>(true);

  const updateToggle=(action:string)=>{
    let arr:ToggleInterface[] = [...toggle];
    arr.forEach((item: ToggleInterface,index:number)=>{
        if(item?.action === action){
            item.active = true
            if(action === 'GroupList'){
                fetchWordGroups();
            }
        }else{
            item.active = false;
        }
    })

    setToggle([...arr])
  }

//   fetch list of words in group
  async function fetchWordsFromGroup(data:any){
    const obj = data;
    try{
        const res = await fetch(`http://localhost:5000/group/words?group_id=${obj?.id}`)
        const data = await res.json()
        console.log("Data: ",data)
        setWordsList([...data])
        }catch(e){
            console.log("Error Occured Fetching Words From List: ",e);
        }
  }

  const onGroupSelect=(data:any)=>{
    fetchWordsFromGroup(data)
    setIsGroup(false)
  }

//   function to get all groups
async function fetchWordGroups(){
    try{
    const res = await fetch('http://localhost:5000/group')
    const data = await res.json()
    setGroupList([...data])
    }catch(e){
        console.log("Error Occured Fetching groups: ",e);
    }
}

//   fetch all word groups
  useEffect(()=>{
    fetchWordGroups()
  },[])

  async function saveToDB(action:string){
        if(action==='word' && wordInput.id > 0 && wordInput.text.length){
            fetch("http://localhost:5000/group/add-word",{
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    group_id: wordInput.id,
                    word: wordInput.text
                  })
            })
            .then(res => {
                if(res.status >= 200){
                    alert("Word Added To Group Successfully !!!")
                    setWordInput({id: -1,text:''})
                }
            })
            .then(data => console.log(data))
            .catch(err=> console.log(err))
        }else if(action === 'group' && groupInput.text.length > 0){
            fetch("http://localhost:5000/group",{
                headers:{
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    name: groupInput.text
                })
            })
            .then(res => {
                if(res.status >= 200){
                    alert("Added New Group Successfully !!!")
                    setGroupInput({id: -1,text:''})
                }
            })
            .then(data => console.log(data))
            .catch(err=> console.log(err))
        }
  }

  return (
    <div className='main_group'>
        <div className='header_group'>
            <button className="word-item" onClick={()=> navigate('/')}>{"<<  "} Back </button>
            <h2 style={{marginRight: '20%'}}>Manage Word Groups</h2>
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
                                    <button key={group?.id} type="button" onClick={() => onGroupSelect(group)} className="word-item">
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
                                <button key={word?.word_id} type="button" className="word-item">
                                    {word?.words}
                                </button>
                            ))}
                        </InfiniteScroll> 

                        <button  className="word-item" style={{backgroundColor:'darkred'}}
                        onClick={()=> setIsGroup(true)}
                        >{" <-- "}Back to word groups</button>
                        </>

                            }
                            </div>
                            }

                            {item.action === 'AddGroup' && item.active && <div className='addGroup'>
                                <h3>Add Group</h3>
                                <input type='text' 
                                onChange={(e)=> setGroupInput((prev:InputData)=> {
                                    return {...prev,text: e.target.value}
                                })}
                                placeholder='Enter group name ...' />
                                <button className="word-item"
                                onClick={()=> saveToDB('group')}
                                 style={{backgroundColor:'green'}} 
                                >Save Group</button>
                            </div>
                            }

                            {item.action === 'AddWord' && item.active && <div className='addGroup'>
                                <h3>Add Word</h3>
                                <select onChange={(e)=> 
                                    {
                                        const obj = groupsList.find((item:any,index:number)=> item?.name === e.target.value)
                                        setWordInput((prev: InputData)=> {
                                        return {...prev,id: obj?.id}
                                    })
                                 }
                                }>
                                    <option disabled>Select group</option>
                                    {
                                        groupsList?.map((item:any,index:any)=>{
                                            return(
                                                <option key={item?.name + index.toString()}>{item?.name}</option>
                                            )
                                        })
                                    }
                                </select>
                                <input type='text' 
                                 onChange={(e)=> setWordInput((prev:InputData)=> {
                                    return {...prev,text: e.target.value}
                                })}
                                 placeholder='Enter word ...'/>
                                <button className="word-item"
                                onClick={()=> saveToDB('word')}
                                 style={{backgroundColor:'green'}} 
                                >Save Word To Group</button>
                            </div>
                            }
                        </>
                    )
                })
            }
        </div>
        <div className='footer_group'>
            <button onClick={()=> updateToggle('GroupList')} className='btn1'>View Word groups</button>
            <button onClick={()=> updateToggle('AddGroup')}  className='btn2'>Add a word group</button>
            <button onClick={()=> updateToggle('AddWord')}  className='btn3'>Add a word to a group</button>
        </div>
    </div>
  )
}
