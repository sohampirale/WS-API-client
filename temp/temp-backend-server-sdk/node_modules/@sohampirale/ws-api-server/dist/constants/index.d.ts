export declare const checksStates: {
    readonly PENDING: "PENDING";
    readonly PASSED: "PASSED";
    readonly FAILED: "FAILED";
};
export declare const initialChecks: {};
interface IRequestHandlers {
    handler: any;
    middlewareNames?: any[];
}
export declare const routes: {
    GET?: IRequestHandlers;
    POST?: IRequestHandlers;
    PATCH?: IRequestHandlers;
    PUT?: IRequestHandlers;
    DELETE?: IRequestHandlers;
};
export {};
