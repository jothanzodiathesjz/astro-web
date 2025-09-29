export interface IDomainPhone {
    country_code?: string;
    number?: string;
}

export class DomainPhone implements IDomainPhone {
    country_code: string;
    number: string;

    constructor(phone?: IDomainPhone) {
        this.country_code = phone?.country_code || "62";
        this.number = phone?.number ?? "";
    }

    toString(): string | undefined {
        if (this.number === "") return undefined;
        return `+${this.country_code}${this.number}`;
    }
}
