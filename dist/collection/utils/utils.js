export function getTimecode(seconds) {
    const minutesNum = Math.floor(seconds / 60);
    const minutesStr = String(minutesNum).padStart(2, "0");
    const secondsNum = Math.floor(seconds - minutesNum * 60);
    const secondsStr = String(secondsNum).padStart(2, "0");
    return `${minutesStr}:${secondsStr}`;
}
export function getClass(...classes) {
    return classes.flatMap(className => {
        if (typeof className === "string")
            return [className];
        const classNamesArr = [];
        for (const prop in className) {
            if (className[prop])
                classNamesArr.push(prop);
        }
        return classNamesArr;
    }).join(' ');
}
export function mapRange(val, range1, range2) {
    if (range1.max - range1.min === 0)
        return;
    const valueDelta = val - range1.min;
    const range1Delta = range1.max - range1.min;
    const percentage = valueDelta / range1Delta;
    const range2Delta = range2.max - range2.min;
    const fixedPercentage = percentage === Infinity ? 0.5 : percentage;
    const mappedRange2Delta = fixedPercentage * range2Delta;
    return mappedRange2Delta + range2.min;
}
