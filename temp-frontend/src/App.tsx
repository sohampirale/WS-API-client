import { useEffect, useState } from 'react'
import './App.css'
import WebSocketClient from '@sohampirale/ws-api-client';

const url="wss://turbo-goggles-q7gqw75vq79vf4w6v-3000.app.github.dev"
let cnt=0;

function App() {

  const [socket,setSocket] = useState<WebSocketClient|null>(null)
  const [route,setRoute] = useState("")
  const [method,setMethod] = useState("")

  //
  const [noOfSimultaneonRequests,setNoOfSimultaneosRequests]=useState(0)

  useEffect(()=>{
    if(socket){
      console.log('Socket already connected');
      return
    }

    console.log('inside useEffect for : ',(++cnt),'th time');
    
    let tempSocket = new WebSocketClient(url)
    // tempSocket=tempSocket.getSocket()
    console.log('tempSocket : ',tempSocket);
    
    tempSocket.onopen=()=>{
      console.log('WS Connection successfull');
      setSocket(tempSocket)
    }

  },[])

  async function handleRequest(){
    if(!socket){
      console.log('Create WS conection first');
      return;
    }
    
    console.log('sending .request from frontend');
    
    const options1={
      route,
      method,
    }

    socket.request(options1).then((data)=>{
      console.log('data received of request1 : ',data);
      
    })
    
  }

  async function sendSimultaneonRequests(){
    if(!socket){
      console.log('WS not connected');
      return;
    }

    for(let i=0;i<noOfSimultaneonRequests;i++){
      try {
        socket.request({
          route,
          method:i+''
        }).then((data)=>{
          console.log('Data receievd at frontend from ',i,'th call');
        })

      } catch (error) {
          console.log('Error : ',error);
      }
    }
  }

  if(!socket){
    return (<>
      Socket not connected
    </>)
  }

  return (
    <>
     Socket connected
     <input type="text" value={route} onChange={(e)=>setRoute(e.target.value)} placeholder='Enter the endpoint route'/>
    <input type='text' value={method} onChange={(e)=>setMethod(e.target.value)} placeholder='Enter the method' />
    <button onClick={handleRequest}>Send request</button>
    <input type="number" value={noOfSimultaneonRequests} onChange={(e)=>setNoOfSimultaneosRequests(parseInt(e.target.value))}/>
    <button onClick={sendSimultaneonRequests}>Send simultaneos request</button>
    </>
  )
}

export default App
