import Queue from "./classes/Queue";
import { IReqOptions } from "./interfaces";
import { requestSchema } from "./schemas";
import WS_API_ERROR from "./utils/WS_API_ERROR";

const NativeWebSocket = globalThis.WebSocket;

interface IRequest {
    route: string,
    method: string,
    data?: any
}

export default class WebSocketClient {
    socket: WebSocket;
    requestOngoing: boolean;
    requestQueue: Queue;

    constructor(url: string) {
        const socket = new NativeWebSocket(url)
        this.socket = socket;
        this.requestOngoing = false;
        this.requestQueue = new Queue();
    }

    send(data: any) {
        this.socket.send(data)
    }

    async handleReqQueue() {
        console.log('inside handleReqQueue');

        if (this.requestQueue.isEmpty()) {
            this.requestOngoing = false;
            return;
        }

        const work = this.requestQueue.dequeue();

        work()
    }

    giveRequestFn(resolve, reject, options) {
        const requestFn=()=> {
            console.log('sending req from client to server with options : ', options);

            this.socket.send(JSON.stringify(options))
            this.socket.onmessage = (data: any) => {

                console.log('received response from backend for options  : ', options);
                // console.log('response received from backend inside onmessage of request() : ', data.data);
                this.handleReqQueue()
                try {
                    const obj = JSON.parse(data.data)
                    resolve(obj);
                } catch (error) {
                    reject(error)
                }
            }

            if(options.timeout){
                console.log('settign timeout as : ',options.timeout);
                
                setTimeout(() => {
                    this.handleReqQueue(); //TODO  dont knwo whehter needed rn
                    reject(new Error(`Timeout waiting for WS response for options : ${options}`))
                }, options.timeout);
            }
        }
        return requestFn;

    }

    async request(options: IRequest) {
        const parsed = requestSchema.safeParse(options)

        let resolve;
        let reject;

        function initializeResRej(resolveTemp, rejectTemp) {
            resolve = resolveTemp;
            reject = rejectTemp
        }

        const promise = new Promise(initializeResRej)

        const requestFn = this.giveRequestFn(resolve, reject, options)

        if (this.requestOngoing) {
            console.log('Request is ongoing you have to wait ');
            this.requestQueue.enqueue(requestFn)
            console.log('No of waiting requests : ', this.requestQueue.size());
        } else {
            this.requestOngoing = true;
            this.requestQueue.enqueue(requestFn)
            this.handleReqQueue();
        }

        return promise;

    }

    set onopen(fn: any) {
        this.socket.onopen = fn;
    }

    get onopen() {
        return this.onopen;
    }

    // set onmessage(fn:any){
    //     this.socket.onmessage=fn;
    // }

    // get onmessage(){
    //     return this.socket.onmessage;
    // }

}