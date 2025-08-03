export default class WSError extends Error {
    constructor(message, error) {
        super(message);
        this.error = error;
    }
}
