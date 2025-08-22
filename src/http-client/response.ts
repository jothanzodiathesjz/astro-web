export interface Response<T = any> {
    success: boolean;
    code: number;
    message: string;
    data: T; // can be undefined on some responses
    next_cursor?: string;
}
