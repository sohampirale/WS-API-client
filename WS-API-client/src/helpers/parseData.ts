export default function parseData(str:string){
    try {
        const obj=JSON.parse(str)
        return obj;
    } catch (error) {
        return str;
    }
}