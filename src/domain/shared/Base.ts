export class BaseEntity {
    created_at: number;
    updated_at?: number;
    deleted_at?: number;
    created_by?: string;
    inserted_by?: string;
    updated_by?: string;
    deleted_by?: string;

    constructor(init: BaseEntity) {
        this.created_at = init.created_at;
        this.inserted_by = init.inserted_by;
        this.updated_at = init.updated_at;
        this.deleted_at = init.deleted_at;
        this.created_by = init.created_by;
        this.updated_by = init.updated_by;
        this.deleted_by = init.deleted_by;
    }
}