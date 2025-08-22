export interface IQueryMetadata {
    search?: string;
    sort_by?: string;
    sort?: "asc" | "desc";
    cursor?: string;
    date?: string;
    box_number?: string;
    product_code?: string;
    from?: string;
    to?: string;
    treatment?: string;
    customer?: string;
    status?: string;
}

export class QueryMetadata {
    constructor(
        query?: IQueryMetadata,
        private params: URLSearchParams = new URLSearchParams(),
    ) {

        if (query?.treatment) {
            this.params.set("treatment", query.treatment);
        }

        if (query?.customer) {
            this.params.set("customer", query.customer);
        }

        if (query?.product_code) {
            this.params.set("product_code", query.product_code);
        }

        if (query?.from) {
            this.params.set("from", query.from);
        }

        if (query?.to) {
            this.params.set("to", query.to);
        }
        if (query?.search) {
            this.params.set("search", query.search);
        }

        if (query?.sort) {
            this.params.set("sort", query.sort);
        }

        if (query?.sort_by) {
            this.params.set("sort_by", query.sort_by);
        }

        if (query?.cursor) {
            this.params.set("cursor", query.cursor);
        }

        if (query?.date) {
            this.params.set("date", query.date);
        }

        if (query?.box_number) {
            this.params.set("box_number", query.box_number);
        }

        if (query?.status) {
            this.params.set("status", query.status);
        }
    }

    toString(): string {
        if (this.params.toString() === "") return "";

        return "?" + this.params.toString();
    }
}
