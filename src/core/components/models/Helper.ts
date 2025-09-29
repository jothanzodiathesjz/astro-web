export interface Helper {
    status: "error" | "warning" | "success";
    messages: string[] | string;
}
