export default function randomFunctionNameGenerator() {
    const randomPart = Math.random().toString(36).substring(2, 10); // random string
    return `randomFnName_${randomPart}`;
}
