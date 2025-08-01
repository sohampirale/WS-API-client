import { IReqOptions } from "../interfaces";

interface itemOfQueue extends  IReqOptions{
    // options:IReqOptions;
    request:any;
}

export default class Queue{
  private items: any[] = [];

  enqueue(requestFn:any): void {
    this.items.push(requestFn);
  }

  dequeue():  any | undefined {
    return this.items.shift();
  }

  peek(): any | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

}
