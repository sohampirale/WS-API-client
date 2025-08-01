export default class WS_API_ERROR extends Error {
    constructor(message, error) {
        super(message);
        if (error) {
            this.error = error;
        }
    }
}
