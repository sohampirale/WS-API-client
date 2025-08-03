import { WebSocketServer } from "@sohampirale/ws-api-server";
const wss=new WebSocketServer({port:3000})

function authMiddleware(req:any,res:any,next:any){
    console.log('inside authMiddleware');
    return next();
}

wss.get("/users",authMiddleware,function(req,res){
    console.log('Inside users GET handler');
   return res.success(true).json(
    {
        message:'DONE thank you !'
    }
   )
})

wss.listen(()=>{
    console.log('WSS running on port 3000');
})