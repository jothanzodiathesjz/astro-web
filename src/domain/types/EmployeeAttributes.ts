export type JobLevel = {
    uuid: string;
    name: string;
    status: boolean;
}

export type Organization = {
    uuid: string;
    name: string;
    status: boolean;
}

export type JobPosition = {
    uuid: string;
    name: string;
    level: JobLevel;
    organization: Organization;
    status: boolean;
}

export type BankDetail = {
    bankName: string;
    bankAccount: string;
    bankAccountHolder: string
    insuranceDetails: string;
    bpjsKetenagaKerjaan: string;
    bpjsKesehatan: string;
}

export type TaxDetail = {
    mobilePhone: string;
}

