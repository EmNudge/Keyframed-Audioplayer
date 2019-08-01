export function getTimecode(seconds) {
    const minutesNum = Math.floor(seconds / 60);
    const minutesStr = String(minutesNum).padStart(2, "0");
    const secondsNum = Math.floor(seconds - minutesNum * 60);
    const secondsStr = String(secondsNum).padStart(2, "0");
    return `${minutesStr}:${secondsStr}`;
}
