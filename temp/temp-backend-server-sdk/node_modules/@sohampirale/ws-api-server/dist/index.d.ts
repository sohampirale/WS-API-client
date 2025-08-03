import { WebSocketServer as WS } from "ws";
interface IChecks {
    [key: string]: 'PENDING' | 'PASSED' | 'FAILED';
}
interface IUser {
    data?: any;
    socket: WebSocketServer;
    checks?: IChecks;
}
interface IReqOptions {
    route: string;
    method: string;
    timeout?: number;
    data?: any;
}
export declare class WebSocketServer {
    wss: WS;
    users: Map<string, IUser>;
    middlewares: Map<string, any>;
    options?: any;
    addNewClientToUsers(ws: any): void;
    get(route: string, ...middlewares: any[]): void;
    post(route: string, ...middlewares: any[]): void;
    put(route: string, ...middlewares: any[]): void;
    patch(route: string, ...middlewares: any[]): void;
    delete(route: string, ...middlewares: any[]): void;
    constructor(options: any);
    listen(callbackFn: () => void): void;
    verifyMiddleware(req: any, middleware: any): Promise<any>;
    handleRequest(socketId: string, req: IReqOptions): Promise<any>;
}
export {};
