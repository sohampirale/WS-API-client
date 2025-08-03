export default class WSError extends Error{
    error?:any;
    
    constructor(message:string,error?:any){
        super(message)
        this.error=error;
    }
}