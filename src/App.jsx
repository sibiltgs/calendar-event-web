
import axios from 'axios'
import './App.css'
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [eventDetails,setEventDetails] = useState({summary:"",description:"",startDateTime:new Date(),endDateTime:new Date()})
  async function setEvent(){
    console.log(eventDetails)
    const newObj = {
      ...eventDetails,
      startDateTime:new Date(eventDetails.startDateTime).toISOString(),
      endDateTime: new Date(eventDetails.endDateTime).toISOString()
    }
    const result = await axios.post("http://localhost:8080/setEvents",{...newObj})
    console.log(result.status)
    if(result.status === 200){
      toast.success('Event created!');
    }else{
      toast.error('Error Occured');
    }
  }
  function handleInputChange(key,value){
    setEventDetails({...eventDetails,[key]:value})
  }
  useEffect(()=>{
    async function auth(){
      let result = await axios.get("http://localhost:8080/auth/url");
      console.log(result)
      // window.location.href = result.data.authUrl;
      window.open(result.data.authUrl, "_blank", "noreferrer");
    }
    auth()
  },[])
  return (
    <>
      <h1>Set Calender Event</h1>
      <h3>Summary</h3>
      <input type="text" className='my-input' onChange={(e)=>handleInputChange("summary",e.target.value)}/>
      <h3>Description</h3>
      <textarea type="text" rows={5} className='my-textarea' onChange={(e)=>handleInputChange("description",e.target.value)}/>
      <div>
      <h3>Start Time</h3>
      <input type='datetime-local' onChange={(e)=>handleInputChange("startDateTime",e.target.value)}/>
      <h3>End Time</h3>
      <input type='datetime-local' onChange={(e)=>handleInputChange("endDateTime",e.target.value)}/>
      </div>
      <br />
      <br />
      <button onClick={setEvent}>Set Event</button>
      <Toaster />
    </>
  )
}

export default App
