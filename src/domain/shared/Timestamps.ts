export class Timestamps {
    created_at: number;
    updated_at?: number;
    deleted_at?: number;
    constructor(init: Timestamps) {
        this.created_at = init.created_at;
        this.updated_at = init.updated_at;
        this.deleted_at = init.deleted_at;
    }
}