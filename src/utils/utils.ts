
export function getTimecode(seconds: number) {
  const minutesNum = Math.floor(seconds / 60);
  const minutesStr = String(minutesNum).padStart(2, "0");
  const secondsNum = Math.floor(seconds - minutesNum * 60);
  const secondsStr = String(secondsNum).padStart(2, "0");

  return `${minutesStr}:${secondsStr}`;
}

export function getClass(...classes: any) {
  return classes.flatMap(className => {
    if (typeof className === "string") return [className];
    const classNamesArr = [];
    for (const prop in className) {
      if (className[prop]) classNamesArr.push(prop);
    }
    return classNamesArr;
  }).join(' ');
}

interface Range {
  min: number;
  max: number;
}

export function mapRange(val: number, range1: Range, range2: Range): number {
  const valueDelta = val - range1.min;
  const range1Delta = range1.max - range1.min;
  const percentage = valueDelta / range1Delta;

  const range2Delta = range2.max - range2.min;
  const mappedRange2Delta = percentage * range2Delta;
  return mappedRange2Delta + range2.min;
}