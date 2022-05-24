export type Filter = (
    target: any,
    args: any[],
    kwargs: Record<string, any>,
) => any | Promise<any>;
