export const checksStates={
    PENDING:"PENDING",
    PASSED:"PASSED",
    FAILED:"FAILED"
} as const;

export const initialChecks={

}

interface IRequestHandlers{
    handler:any,
    middlewareNames?:any[]
}

export const routes:{GET?:IRequestHandlers,POST?:IRequestHandlers,PATCH?:IRequestHandlers,PUT?:IRequestHandlers,DELETE?:IRequestHandlers}={

}