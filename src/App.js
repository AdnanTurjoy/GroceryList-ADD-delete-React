import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage =()=>{
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }
  else{
    return []
  }
}

function App() {
  const [name,setName] =useState('');
  const [list,setList] =useState(getLocalStorage());
  const [isEnding,setIsEnding] = useState(false);
  const [editId,setEditId] = useState(null);
  const [alert,setAlert] = useState({
    show:false, msg:'', type:''
  })
  const handleSubmit=(e)=>{
    e.preventDefault()
    if(!name){
      // display alert
      setAlert({show:true ,msg :'please enter value' ,type:'danger'})
    }
    else if(name && isEnding){
      //deal with edit
      setList(list.map((item)=>{
        if(item.id===editId)
        return {...item,title:name}
        return item
      }))
      setName('');
      setEditId(null);
      setIsEnding(false);
      showAlert(true,'succes','value changed')
    }
    else{
      showAlert(true,'success','item added to the list')
      // show alert
      const newItem ={
        id: new Date().getTime().toString(), title:name};
        setList([...list,newItem]);
        setName('');
      }
    }
  const showAlert = (show =false,type="",msg="")=>{
    setAlert({show,type,msg})
  }
  const clearList=()=>{
    showAlert(true,'danger','empty list')
    setList([]);
  }
  const removeItem=(id)=>{
    showAlert(true,'danger','item remove');
    setList(list.filter((item)=>item.id !==id))
  }
  const editItem =(id)=>{
    const specificItem =list.find((item)=>item.id==id);
    setIsEnding(true);
    setEditId(id);
    setName(specificItem.title);
  }
  useEffect(()=>{
    localStorage.setItem('list',JSON.stringify(list))
  },[list])
  return ( <section className="section-center">
    <form className="grocery-form" onSubmit={handleSubmit}>
       {alert.show && <Alert { ...alert} 
       removeAlert={showAlert} list={list} />}
       <h3>Grocery List</h3>
      <div className="form-control">
        <input type='text' className="grocery" placeholder='e. egg' 
        value={name} onChange={(e)=>setName(e.target.value)} / >
          <button className="submit-btn" type="submit">
            {isEnding ? 'Edit' : 'submit'}
          </button>
      </div>
    </form>
    {list.length >0 && ( <div className="grocery-container">
     <List items={list} removeItem={removeItem} editItem={editItem}/>
     <button className="clear-btn"onClick={clearList} >clear items</button>
   </div>)}
  
  </section> );
}

export default App
