import dotenv from "dotenv"
dotenv.config();
import { WebSocketServer } from 'ws'
import { allFeedbacks } from './constants';
import { Feedback, Topic } from './models';
import connectMongoDB from "./helpers/connectMongoDB";
connectMongoDB();

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws:any) {
  console.log('new client connected');
  
  ws.on('message',async function message(data:any) {
    //TODO : remopve this absttarction int he WS-API-server SDK
    try {
      const obj = JSON.parse(data)
      console.log('obj received at backend : ',obj);

      if(obj.route=='/feedbacks'){
        const allFeedbacks = await Feedback.find({}).select("-_id -topicId -createdAt -updatedAt -owner -feedbackPublic  -thumbnail_` url")
        ws.send(JSON.stringify(allFeedbacks))
        return;

      } else if(obj.route=='/topics'){
        const topics = await Topic.find({}).select("-_id -updatedAt -createdAt")
        ws.send(JSON.stringify(topics))
        return;
      }

      ws.send(JSON.stringify(allFeedbacks)) 
      // ws.send(allFeedbacks) 
    } catch (error) {
      console.log('Message receievd at server : ',data.toString());
      ws.send(`Receveived msg at backend : ${data.toString()}`)
    }
  });

  ws.send('You are coonnected with server with WS!!');
});