export interface IReqOptions{
    route:string,
    method:string,
    timeout?:number,
    data?:any
}

// export interface IQueue<IReqOptions> {
//   enqueue(item: IReqOptions): void;
//   dequeue(): IReqOptions | undefined;
//   peek(): IReqOptions | undefined;
//   isEmpty(): boolean;
//   size(): number;
// }
