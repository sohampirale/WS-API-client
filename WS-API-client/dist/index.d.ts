import Queue from "./classes/Queue";
interface IRequest {
    route: string;
    method: string;
    data?: any;
}
export default class WebSocketClient {
    socket: WebSocket;
    requestOngoing: boolean;
    requestQueue: Queue;
    constructor(url: string);
    send(data: any): void;
    handleReqQueue(): Promise<void>;
    giveRequestFn(resolve: any, reject: any, options: any): () => void;
    request(options: IRequest): Promise<unknown>;
    set onopen(fn: any);
    get onopen(): any;
}
export {};
