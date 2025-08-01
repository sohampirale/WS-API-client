export default class WS_API_ERROR extends Error{
    error?:any;
    constructor(message:string,error?:any){
        super(message)
        if(error){
            this.error=error;
        }
    }
}