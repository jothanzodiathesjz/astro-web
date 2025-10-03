import { DomainPhone } from "@/domain/shared/Phone";

export interface IPhoneUI {
    number?: string;
    country_code: string;
}

export class PhoneUI implements IPhoneUI {
    number: string;
    country_code: string;

    constructor(phone: IPhoneUI) {
        this.number = phone.number || "";
        this.country_code = phone.country_code;
    }

    toDomain(): DomainPhone | undefined {
        if (this.number.length === 0) return undefined;
        return new DomainPhone({
            number: this.number,
            country_code: this.country_code,
        });
    }

    toPhoneNumberString(): string | undefined {
        if (this.number.length === 0) return undefined;
        return `+${this.country_code}${this.number}`.trim();
    }

    static fromDomain(phone?: DomainPhone): PhoneUI {
        if (phone == undefined) {
            return PhoneUI.empty();
        }
        return new PhoneUI({
            number: phone.number,
            country_code: phone.country_code,
        });
    }

    static empty(): PhoneUI {
        return new this({
            number: "",
            country_code: "62",
        });
    }
}
