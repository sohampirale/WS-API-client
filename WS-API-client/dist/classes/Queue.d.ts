export default class Queue {
    private items;
    enqueue(requestFn: any): void;
    dequeue(): any | undefined;
    peek(): any | undefined;
    isEmpty(): boolean;
    size(): number;
}
