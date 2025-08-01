export default class WS_API_ERROR extends Error {
    error?: any;
    constructor(message: string, error?: any);
}
