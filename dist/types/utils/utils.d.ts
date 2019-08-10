export declare function getTimecode(seconds: number): string;
export declare function getClass(...classes: any): any;
interface Range {
    min: number;
    max: number;
}
export declare function mapRange(val: number, range1: Range, range2: Range): number;
export {};
