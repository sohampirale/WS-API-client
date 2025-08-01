export default class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(requestFn) {
        this.items.push(requestFn);
    }
    dequeue() {
        return this.items.shift();
    }
    peek() {
        return this.items[0];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
}
