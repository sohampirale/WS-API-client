export default function stringifyJSON(obj) {
    try {
        const stringifiedJSON = JSON.stringify(obj);
        return stringifiedJSON;
    }
    catch (error) {
        return "";
    }
}
