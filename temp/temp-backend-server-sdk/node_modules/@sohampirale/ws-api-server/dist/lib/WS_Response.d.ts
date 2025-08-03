export default class WSResponse {
    constructor();
    success(state: boolean): this;
    status(statusCode: number): this;
    json(obj: any): this;
}
/**
 * now if i do
 * const res = new WSResponse(whatever,"Something")
 * and then give this res obj as an argument ot another function for emxplae
 * function test(res){
 *  then in this funciton can i do res.status(200).json(new WSResponse()) this is what i want to ask because the WSResponse objt had dat afield in whic another of that obj is there
 * }
 */ 
