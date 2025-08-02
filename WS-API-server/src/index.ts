import { WebSocketServer as WS } from "ws"
import { reqOptionsSchema, setRouteHandlerSchema } from "./schemas/index.js";
import WSError from "./lib/WS_Error.js";
import { checksStates, initialChecks, routes } from "./constants/index.js";
import randomFunctionNameGenerator from "./helpers/randomFunctionNameGenrator.js";
import WSResponse from "./lib/WS_Response.js";
import randomIdGenerator from "./helpers/randomIdGenerator.ts";
import { success } from "zod";

interface IChecks {
    [key: string]: 'PENDING' | 'PASSED' | 'FAILED';
}

interface IUser {
    data?: any;
    socket: WebSocketServer;
    checks?: IChecks;
}

interface IReqOptions {
    route: string,
    method: string,
    timeout?: number,
    data?: any
}

export class WebSocketServer {

    wss: WS;
    users: Map<string, IUser>
    middlewares: Map<string, any>
    options?: any;

    addNewClientToUsers(ws: any) {
        ws.socketId = randomIdGenerator()
        this.users.set(ws.socketId, {
            data: null,
            socket: ws,
            checks: initialChecks
        })

        // console.log(
        //     'client added to users map (without socket):',
        //     Array.from(this.users.entries()).map(([id, { data, checks }]) => ({
        //         id,
        //         data,
        //         checks
        //     }))
        // );
    }

    get(route: string, ...middlewares: any[]) {

        const handler = middlewares.pop()

        const parsed = setRouteHandlerSchema.safeParse({
            handler,
            middlewares
        })

        if (!parsed.success) {
            throw new WSError("Invalid data format provided", parsed.error)
        }

        const middlewareNames = []
        for (let i = 0; i < middlewares.length; i++) {
            let middlewareName = middlewares[i].name ?? randomFunctionNameGenerator();

            middlewareNames.push(middlewareName)

            if (!initialChecks[middlewareName]) {
                initialChecks[middlewareName] = 'PENDING'
            }

            if (!this.middlewares.has(middlewareName)) {
                this.middlewares.set(middlewareName, middlewares[i]);
            }
        }

        if (!routes[route]) {
            routes[route] = {}
        }

        routes[route].GET = {
            handler,
            middlewareNames
        }

        // console.log('routes now are : ', routes);
        // console.log('middlewares now are : ',this.middlewares);
        

    }

    post(route: string, ...middlewares: any[]) {
        const handler = middlewares.pop()
        const parsed = setRouteHandlerSchema.safeParse({
            handler,
            middlewares
        })

        if (!parsed.success) {
            throw new WSError("Invalid data format provided", parsed.error)
        }

        const middlewareNames = []
        for (let i = 0; i < middlewares.length; i++) {
            let middlewareName = middlewares[i].name ?? randomFunctionNameGenerator();
            middlewareNames.push(middlewareName)

            if (!initialChecks[middlewareName]) {
                initialChecks[middlewareName] = 'PENDING'
            }

            if (!this.middlewares.has(middlewareName)) {
                this.middlewares.set(middlewareName, middlewares[i]);
            }
        }
        if (!routes[route]) {
            routes[route] = {}
        }
        routes[route].POST = {
            handler,
            middlewareNames
        }

    }

    put(route: string, ...middlewares: any[]) {
        const handler = middlewares.pop()
        const parsed = setRouteHandlerSchema.safeParse({
            handler,
            middlewares
        })

        if (!parsed.success) {
            throw new WSError("Invalid data format provided", parsed.error)
        }

        const middlewareNames = []
        for (let i = 0; i < middlewares.length; i++) {
            let middlewareName = middlewares[i].name ?? randomFunctionNameGenerator();
            middlewareNames.push(middlewareName)

            if (!initialChecks[middlewareName]) {
                initialChecks[middlewareName] = 'PENDING'
            }

            if (!this.middlewares.has(middlewareName)) {
                this.middlewares.set(middlewareName, middlewares[i]);
            }
        }
        if (!routes[route]) {
            routes[route] = {}
        }

        routes[route].PUT = {
            handler,
            middlewareNames
        }

    }

    patch(route: string, ...middlewares: any[]) {
        const handler = middlewares.pop()
        const parsed = setRouteHandlerSchema.safeParse({
            handler,
            middlewares
        })

        if (!parsed.success) {
            throw new WSError("Invalid data format provided", parsed.error)
        }

        const middlewareNames = []
        for (let i = 0; i < middlewares.length; i++) {
            let middlewareName = middlewares[i].name ?? randomFunctionNameGenerator();
            middlewareNames.push(middlewareName)

            if (!initialChecks[middlewareName]) {
                initialChecks[middlewareName] = 'PENDING'
            }

            if (!this.middlewares.has(middlewareName)) {
                this.middlewares.set(middlewareName, middlewares[i]);
            }
        }
        if (!routes[route]) {
            routes[route] = {}
        }
        routes[route].PATCH = {
            handler,
            middlewareNames
        }

    }

    delete(route: string, ...middlewares: any[]) {
        const handler = middlewares.pop()
        const parsed = setRouteHandlerSchema.safeParse({
            handler,
            middlewares
        })

        if (!parsed.success) {
            throw new WSError("Invalid data format provided", parsed.error)
        }

        const middlewareNames = []
        for (let i = 0; i < middlewares.length; i++) {
            let middlewareName = middlewares[i].name ?? randomFunctionNameGenerator();
            middlewareNames.push(middlewareName)

            if (!initialChecks[middlewareName]) {
                initialChecks[middlewareName] = 'PENDING'
            }

            if (!this.middlewares.has(middlewareName)) {
                this.middlewares.set(middlewareName, middlewares[i]);
            }
        }
        if (!routes[route]) {
            routes[route] = {}
        }
        routes[route].DELETE = {
            handler,
            middlewareNames
        }

    }

    constructor(options: any) {
        this.options = options;
        this.users = new Map();
        this.middlewares = new Map();
    }

    listen(callbackFn: () => void) {
        this.wss = new WS(this.options);
        callbackFn()
        this.wss.on('connection', (ws: any) => {
            console.log('New client connected');
            this.addNewClientToUsers(ws)

            ws.on("message", async (data) => {
                try {
                    const str = data.toString();
                    const receivedReqOptions = JSON.parse(str);
                    const parsed = reqOptionsSchema.safeParse(receivedReqOptions)
                    if(!parsed.success){
                        const res=new WSResponse().success(false).status(400).json({
                            message:'Invalid request format provided',
                            requestedFormat:JSON.stringify({
                                route:"string",
                                method:"string(GET | POST | PUT | PATCH | DELETE)",
                                data:"optional"
                            })
                        })
                        return ws.send(JSON.stringify(res))
                    }
                    const reqOptions = parsed.data
           
                    const response = await this.handleRequest(ws.socketId, reqOptions)
                    // console.log('response received from onmessage is : ',response);
                    ws.send(JSON.stringify(response))
                    
                } catch (error) {
                    ws.send(JSON.stringify({
                        success:false,
                        message:"Invalid JSON provided"
                    }))
                }
            });

            ws.on("close", (code) => {
                console.log(`Disconnected (code: ${code})`);
                this.users.delete(ws.socketId)
                console.log("User removed from the users map");
            });
        })

    }

    async verifyMiddleware(req: any, middleware: any) {
        console.log('inside verifyMiddleware ');
        console.log("req : ",req);
        console.log('middleware : ',middleware);
        
        
        
        const res = new WSResponse();

        function next(err: any) {
            if (err) {
                console.log('retunring false from next()');
                return res.success(false)
            } else {
                console.log('retunring success from next()');
                return res.success(true);
            }
        }

        let response;
        try {
            if (middleware.constructor.name == 'Function') {
                response = middleware(req, res, next)
            } else {
                response = await middleware(req, res, next)
            }
        } catch (error) {
            console.log('Error while tesing the middleware : ', middleware);
            console.log('Error : ', error);
        }

        return response


    }

    async handleRequest(socketId: string, req: IReqOptions) {
        console.log('inside handleRequest users : ', this.users);

        const parsed = reqOptionsSchema.safeParse(req);
        if (!parsed.success) {
            return new WSResponse().success(false).json(
                {
                    message: 'Invalid request format provided',
                    error: parsed.error
                }
            )
        }

        const { route, method, data } = parsed.data;

        if (!routes[route]) {
            return new WSResponse().success(false).json(
                {
                    message: 'No endpoint found at requested route'
                }
            )
        } else if (!routes[route][method]) {
            return new WSResponse().success(false).json(
                {
                    message: `${method} is not accepted at route : ${route}`
                }
            )
        } 

        const user = this.users.get(socketId);
        const userChecks = user.checks;

        if (!user) {
            return new WSResponse().success(false).json(
                {
                    message: 'User not found in WS pool'
                }
            )
        }

        const { handler, middlewareNames } = routes[route][method];

        for (let i = 0; i < middlewareNames.length; i++) {
            const middlewareName = middlewareNames[i];
            const state = userChecks[middlewareName];
            if (state == checksStates.FAILED) {
                return new WSResponse().success(false).json({
                    message: "Check failed at the " + middlewareName
                })
            } else if (state == checksStates.PENDING) {
                const response = await this.verifyMiddleware(req,this.middlewares.get(middlewareName));
                console.log('response received from verifyMiddleware : ', response);

                if (!response) {
                    return new WSResponse().success(false).json({
                        message: 'Failed to verify'
                    })
                } else if (!response.success) {
                    userChecks[middlewareName] = checksStates.FAILED;
                    return response
                }

                userChecks[middlewareName] = checksStates.PASSED
            } else{
                console.log(middlewareName+' is already PASSED');
            }
        }

        const res = new WSResponse();

        if (handler.constructor.name == 'Function') {
            try {
                const response = handler(req, res)
                return response
            } catch (error) {
                return res.success(false).json({
                    error
                })
            }
        } else {
            try {
                const response = await handler(req, res)
                return response
            } catch (error) {
                return res.success(false).json({
                    error
                })
            }
        }
    }

}