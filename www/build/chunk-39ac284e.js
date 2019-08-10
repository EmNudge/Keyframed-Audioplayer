function getTimecode(seconds) {
    const minutesNum = Math.floor(seconds / 60);
    const minutesStr = String(minutesNum).padStart(2, "0");
    const secondsNum = Math.floor(seconds - minutesNum * 60);
    const secondsStr = String(secondsNum).padStart(2, "0");
    return `${minutesStr}:${secondsStr}`;
}
function getClass(...classes) {
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
function mapRange(val, range1, range2) {
    const valueDelta = val - range1.min;
    const range1Delta = range1.max - range1.min;
    const percentage = valueDelta / range1Delta;
    const range2Delta = range2.max - range2.min;
    const mappedRange2Delta = percentage * range2Delta;
    return mappedRange2Delta + range2.min;
}

export { getTimecode as g, mapRange as m };
