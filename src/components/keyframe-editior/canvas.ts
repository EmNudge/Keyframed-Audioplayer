export function initialize(ctx: any, looped = 0) {
    for (const [index] of Array(10).entries()) {
        ctx.beginPath();
        ctx.arc(10 * index + looped, 10 * index, 10, 0, 2 * Math.PI);
        ctx.stroke();
    }

    requestAnimationFrame(() => initialize(ctx, looped + 1))
}