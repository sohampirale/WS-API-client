export default function parseData(str) {
    try {
        const obj = JSON.parse(str);
        return obj;
    }
    catch (error) {
        return str;
    }
}
