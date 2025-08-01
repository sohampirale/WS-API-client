import {WebSocketServer as WS} from "ws"

export default class WebSocketServer{
    wss:WS;
    users:Map<string,any>

    constructor(options:any){
        this.wss=new WS(options);
        this.wss.on('connection',function(ws:any){
            console.log('New client connected');
            this.addNewClientToUsers(ws)
        })
    }

    addNewClientToUsers(ws:any){
        ws.id=randomIdGenerator()
        this.users.set(ws.id,{
            socket:ws
        })
    }

    
}