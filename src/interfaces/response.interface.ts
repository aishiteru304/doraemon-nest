export interface ResponseFormat<T = undefined> {
    statusCode: number;
    message: string;
    data?: T;
}
