var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Queue from "./classes/Queue";
import { requestSchema } from "./schemas";
const NativeWebSocket = globalThis.WebSocket;
export default class WebSocketClient {
    constructor(url) {
        const socket = new NativeWebSocket(url);
        this.socket = socket;
        this.requestOngoing = false;
        this.requestQueue = new Queue();
    }
    send(data) {
        this.socket.send(data);
    }
    handleReqQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('inside handleReqQueue');
            if (this.requestQueue.isEmpty()) {
                this.requestOngoing = false;
                return;
            }
            const work = this.requestQueue.dequeue();
            work();
        });
    }
    giveRequestFn(resolve, reject, options) {
        const requestFn = () => {
            console.log('sending req from client to server with options : ', options);
            this.socket.send(JSON.stringify(options));
            this.socket.onmessage = (data) => {
                console.log('received response from backend for options  : ', options);
                // console.log('response received from backend inside onmessage of request() : ', data.data);
                this.handleReqQueue();
                try {
                    const obj = JSON.parse(data.data);
                    resolve(obj);
                }
                catch (error) {
                    reject(error);
                }
            };
            if (options.timeout) {
                console.log('settign timeout as : ', options.timeout);
                setTimeout(() => {
                    this.handleReqQueue(); //TODO  dont knwo whehter needed rn
                    reject(new Error(`Timeout waiting for WS response for options : ${options}`));
                }, options.timeout);
            }
        };
        return requestFn;
    }
    request(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsed = requestSchema.safeParse(options);
            let resolve;
            let reject;
            function initializeResRej(resolveTemp, rejectTemp) {
                resolve = resolveTemp;
                reject = rejectTemp;
            }
            const promise = new Promise(initializeResRej);
            const requestFn = this.giveRequestFn(resolve, reject, options);
            if (this.requestOngoing) {
                console.log('Request is ongoing you have to wait ');
                this.requestQueue.enqueue(requestFn);
                console.log('No of waiting requests : ', this.requestQueue.size());
            }
            else {
                this.requestOngoing = true;
                this.requestQueue.enqueue(requestFn);
                this.handleReqQueue();
            }
            return promise;
        });
    }
    set onopen(fn) {
        this.socket.onopen = fn;
    }
    get onopen() {
        return this.onopen;
    }
}
