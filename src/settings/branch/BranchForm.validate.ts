import type { DomainBranch } from "@/domain/models/Branch";

export function validateBranchForm(data: DomainBranch) {
    const err: Record<string, string> = {};

    let isValid = true;

    if (!data.name) {
        err.name = "Name is required";
        isValid = false;
    }

    if (!data.code) {
        err.code = "Code is required";
        isValid = false;
    }

    if (!data.address.country) {
        err.country = "Country is required";
        isValid = false;
    }

    if (!data.address.province) {
        err.province = "Province is required";
        isValid = false;
    }

    if (!data.address.city) {
        err.city = "City is required";
        isValid = false;
    }

    if (!data.address.street) {
        err.street = "Street is required";
        isValid = false;
    }

    if (!data.address.zip_code) {
        err.zip_code = "Zip Code is required";
        isValid = false;
    }

    if (!data.contact.email) {
        err.email = "Email is required";
        isValid = false;
    }

    if (!data.contact.phone_number) {
        err.number = "Phone Number is required";
        isValid = false;
    }

    if (!data.payroll_info.umr) {
        err.umr = "UMR is required";
        isValid = false;
    }

    if (!data.payroll_info.umr_city) {
        err.umr_city = "UMR City is required";
        isValid = false;
    }

    if (!data.payroll_info.umr_province) {
        err.umr_province = "UMR Province is required";
        isValid = false;
    }

    if (!data.payroll_info.bpjs_code) {
        err.bpjs_code = "BPJS Code is required";
        isValid = false;
    }

    if (!data.payroll_info.hq_code) {
        err.hq_code = "HQ Code is required";
        isValid = false;
    }

    if (!data.payroll_info.hq_initial) {
        err.hq_initial = "HQ Initial is required";
        isValid = false;
    }

    if (!data.payroll_info.jkk) {
        err.jkk = "JKK is required";
        isValid = false;
    }

    if (!data.payroll_info.klu_code) {
        err.klu_code = "KLU Code is required";
        isValid = false;
    }

    return { err, isValid };
}
