export type ToastAttributes = {
    message: string;
    type?: "success" | "error" | "warning" | "info";
    duration?: number;
};

export class ToastUI {
    constructor(
        public readonly message: string,
        public readonly type: "success" | "error" | "warning" | "info" = "info",
        public readonly duration: number = 3000,
    ) {
        this.message = message;
        this.type = type;
        this.duration = duration;
    }
}
