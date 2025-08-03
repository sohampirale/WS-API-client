"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ws_1 = require("ws");
const constants_1 = require("./constants");
const models_1 = require("./models");
const connectMongoDB_1 = __importDefault(require("./helpers/connectMongoDB"));
(0, connectMongoDB_1.default)();
const wss = new ws_1.WebSocketServer({ port: 3000 });
wss.on('connection', function connection(ws) {
    console.log('new client connected');
    ws.on('message', function message(data) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO : remopve this absttarction int he WS-API-server SDK
            try {
                const obj = JSON.parse(data);
                console.log('obj received at backend : ', obj);
                if (obj.route == '/feedbacks') {
                    const allFeedbacks = yield models_1.Feedback.find({}).select("-_id -topicId -createdAt -updatedAt -owner -feedbackPublic  -thumbnail_`url");
                    ws.send(JSON.stringify(allFeedbacks));
                    return;
                }
                else if (obj.route == '/topics') {
                    const topics = yield models_1.Topic.find({}).select("-_id -updatedAt -createdAt");
                    ws.send(JSON.stringify(topics));
                    return;
                }
                ws.send(JSON.stringify(constants_1.allFeedbacks));
                // ws.send(allFeedbacks) 
            }
            catch (error) {
                console.log('Message receievd at server : ', data.toString());
                ws.send(`Receveived msg at backend : ${data.toString()}`);
            }
        });
    });
    ws.send('You are coonnected with server with WS!!');
});
