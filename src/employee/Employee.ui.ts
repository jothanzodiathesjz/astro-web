import { PhoneUI } from "@/core/ui/Phone.ui";
import { isValidEmail } from "@/core/utils/EmailValidator";
import { mapToPhoneUI } from "@/core/utils/PhoneParsing";
import type { DomainEmployee } from "@/domain/models/Employee";
import type { Department } from "@/domain/types/EmployeeAttributes";
import { nanoid } from "nanoid";

export type PersonalDetailUi = {
    firstName: string;
    lastName: string;
    nickName: string;
    birthDate: Date | Date[] | undefined;
    birthPlace: string;
    religion: string | null;
    gender: string;
    maritalStatus: string | null;
    bloodType: string | null;
};

export type AddressUI = {
    country: string;
    province: string;
    city: string;
    street: string;
    zipCode: string;
};

export type ContactUI = {
    email: string;
    phoneNumber: PhoneUI;
    emergencyName: string;
    emergencyRelation: string | null;
    emergencyPhoneNumber: PhoneUI;
};

export type EmployeeDataUI = {
    employeeId: string;
    fingerCode: string;
    department: Department | null;
    jobLevel: string | null;
    jobTitle: string;
    employmentType: string | null;
    startDate?: Date;
    endDate?: Date;
    resignDate?: Date;
    status: string | null;
};

export type BankDetailUI = {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
};

export type InsuranceDetailUI = {
    bpjsKetenagakerjaan: string;
    bpjsKesehatan: string;
};

export type PersonalDetailErrors = {
    firstName?: string;
    lastName?: string;
    nickName?: string;
    birthDate?: string;
    birthPlace?: string;
    gender?: string;
    maritalStatus?: string;
    bloodType?: string;
    religion?: string;
};

export type ContactDetailErrors = {
    email?: string;
    phoneNumber?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhoneNumber?: string;
};

export type EmployeeDataErrors = {
    employeeId?: string;
    fingerCode?: string;
    department?: string;
    jobLevel?: string;
    jobTitle?: string;
    employmentType?: string;
    startDate?: string;
    endDate?: string;
    resignDate?: string;
    status?: string;
};

export type BankDetailErrors = {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
};

export type InsuranceDetailErrors = {
    bpjsKetenagakerjaan?: string;
    bpjsKesehatan?: string;
};

export class EmployeeUI {
    uuid = "";
    personalDetail: PersonalDetailUi = {
        firstName: "",
        lastName: "",
        nickName: "",
        birthDate: undefined,
        birthPlace: "",
        religion: null,
        gender: "",
        maritalStatus: null,
        bloodType: null,
    } as PersonalDetailUi;
    address: AddressUI = {
        country: "Indonesia",
        province: "",
        city: "",
        street: "",
        zipCode: "",
    } as AddressUI;
    contactDetail: ContactUI = {
        email: "",
        phoneNumber: PhoneUI.empty(),
        emergencyName: "",
        emergencyRelation: null,
        emergencyPhoneNumber: PhoneUI.empty(),
    } as ContactUI;
    employmentDetail: EmployeeDataUI = {
        employeeId: "",
        fingerCode: "",
        department: null,
        jobLevel: null,
        jobTitle: "",
        employmentType: null,
        startDate: new Date(),
        endDate: undefined,
        resignDate: undefined,
        status: "ACTIVE",
    } as EmployeeDataUI;
    bankDetail: BankDetailUI = {
        accountName: "",
        accountNumber: "",
        bankName: "",
        ifscCode: "",
    } as BankDetailUI;
    insuranceDetail: InsuranceDetailUI = {
        bpjsKetenagakerjaan: "",
        bpjsKesehatan: "",
    } as InsuranceDetailUI;

    toDomain(isUpdate: boolean): DomainEmployee {
        return {
            uuid: isUpdate ? this.uuid : nanoid(),
            full_name:
                this.personalDetail.firstName +
                " " +
                this.personalDetail.lastName,
            nick_name: this.personalDetail.nickName,
            employee_id: this.employmentDetail.employeeId,
            fingerprint_id: this.employmentDetail.fingerCode,
            schedule: null,
            address: {
                country: this.address.country,
                province: this.address.province,
                city: this.address.city,
                street: this.address.street,
                zip_code: this.address.zipCode,
            },
            personal_detail: {
                birthday:
                    this.personalDetail.birthDate instanceof Date
                        ? this.personalDetail.birthDate
                              .toISOString()
                              .split("T")[0]
                        : "", // Menggunakan format ISO untuk konsistensi
                birth_place: this.personalDetail.birthPlace,
                religion: this.personalDetail.religion ?? "",
                gender: this.personalDetail.gender,
                marital_status: this.personalDetail.maritalStatus ?? "",
                blood_type: this.personalDetail.bloodType ?? "",
            },
            contact_detail: {
                email: this.contactDetail.email,
                phone_number: `${this.contactDetail.phoneNumber.country_code} ${this.contactDetail.phoneNumber.number}`,
                emergency_contact: {
                    name: this.contactDetail.emergencyName,
                    relation: this.contactDetail.emergencyRelation ?? "",
                    phone_number: `${this.contactDetail.emergencyPhoneNumber.country_code} ${this.contactDetail.emergencyPhoneNumber.number}`,
                },
            },
            employment: {
                department: this.employmentDetail.department ?? {
                    name: "",
                    code: "",
                },
                job_level: this.employmentDetail.jobLevel ?? "",
                job_title: this.employmentDetail.jobTitle,
                employment_type: this.employmentDetail.employmentType ?? "",
                start_date: this.employmentDetail.startDate?.getTime() ?? 0,
                end_date: this.employmentDetail.endDate?.getTime() ?? 0,
                resign_date: this.employmentDetail.resignDate?.getTime() ?? 0,
                status: this.employmentDetail.status ?? "",
            },
            bank_detail: {
                account_name: this.bankDetail.accountName,
                account_number: this.bankDetail.accountNumber,
                bank_name: this.bankDetail.bankName,
                ifsc_code: this.bankDetail.ifscCode,
            },
            insurance_details: {
                bpjs_ketenagakerjaan: this.insuranceDetail.bpjsKetenagakerjaan,
                bpjs_kesehatan: this.insuranceDetail.bpjsKesehatan,
            },
            created_at: 0,
        };
    }

    static fromDomain(data: DomainEmployee): EmployeeUI {
        const ui = new EmployeeUI();
        const [firstName, ...lastNameParts] = data.full_name.split(" ");
        const lastName = lastNameParts.join(" ");
        const phone = mapToPhoneUI(data.contact_detail.phone_number ?? "0");
        const emergencyPhone = mapToPhoneUI(
            data.contact_detail.emergency_contact.phone_number ?? "0",
        );

        ui.uuid = data.uuid;
        ui.personalDetail.firstName = firstName;
        ui.personalDetail.lastName = lastName;
        ui.personalDetail.nickName = data.nick_name;
        ui.personalDetail.birthDate = new Date(data.personal_detail.birthday);
        ui.personalDetail.birthPlace = data.personal_detail.birth_place;
        ui.personalDetail.religion = data.personal_detail.religion;
        ui.personalDetail.gender = data.personal_detail.gender;
        ui.personalDetail.maritalStatus = data.personal_detail.marital_status;
        ui.personalDetail.bloodType = data.personal_detail.blood_type;

        ui.address.country = data.address.country;
        ui.address.province = data.address.province;
        ui.address.city = data.address.city;
        ui.address.street = data.address.street;
        ui.address.zipCode = data.address.zip_code;

        ui.contactDetail.email = data.contact_detail.email;
        ui.contactDetail.phoneNumber.country_code = phone.country_code;
        ui.contactDetail.phoneNumber.number = phone.number;
        ui.contactDetail.emergencyName =
            data.contact_detail.emergency_contact.name;
        ui.contactDetail.emergencyRelation =
            data.contact_detail.emergency_contact.relation;
        ui.contactDetail.emergencyPhoneNumber.country_code =
            emergencyPhone.country_code;
        ui.contactDetail.emergencyPhoneNumber.number = emergencyPhone.number;

        ui.employmentDetail.department = data.employment.department;
        ui.employmentDetail.employeeId = data.employee_id;
        ui.employmentDetail.fingerCode = data.fingerprint_id;
        ui.employmentDetail.jobLevel = data.employment.job_level;
        ui.employmentDetail.jobTitle = data.employment.job_title;
        ui.employmentDetail.employmentType = data.employment.employment_type;
        ui.employmentDetail.startDate = new Date(data.employment.start_date);
        ui.employmentDetail.endDate = new Date(data.employment.end_date);
        ui.employmentDetail.resignDate = new Date(data.employment.resign_date);
        ui.employmentDetail.status = data.employment.status;

        ui.bankDetail.accountName = data.bank_detail.account_name;
        ui.bankDetail.accountNumber = data.bank_detail.account_number;
        ui.bankDetail.bankName = data.bank_detail.bank_name;
        ui.bankDetail.ifscCode = data.bank_detail.ifsc_code;

        ui.insuranceDetail.bpjsKetenagakerjaan =
            data.insurance_details.bpjs_ketenagakerjaan;
        ui.insuranceDetail.bpjsKesehatan =
            data.insurance_details.bpjs_kesehatan;

        return ui;
    }

    personalDataValidate() {
        const errors: PersonalDetailErrors = {};

        // 1. Validasi firstName
        if (
            !this.personalDetail.firstName ||
            this.personalDetail.firstName.trim() === ""
        ) {
            errors.firstName = "Nama depan tidak boleh kosong.";
        }

        // 2. Validasi lastName
        if (
            !this.personalDetail.lastName ||
            this.personalDetail.lastName.trim() === ""
        ) {
            errors.lastName = "Nama belakang tidak boleh kosong.";
        }

        if (
            !this.personalDetail.nickName ||
            this.personalDetail.nickName.trim() === ""
        ) {
            errors.nickName = "Nama panggilan tidak boleh kosong.";
        }

        // 3. Validasi birthDate
        if (this.personalDetail.birthDate === undefined) {
            errors.birthDate = "Tanggal lahir harus diisi.";
        } else if (
            Array.isArray(this.personalDetail.birthDate) ||
            !(this.personalDetail.birthDate instanceof Date) ||
            isNaN(this.personalDetail.birthDate.getTime())
        ) {
            errors.birthDate = "Tanggal lahir harus berupa tanggal yang valid.";
        }

        // 4. Validasi birthPlace
        if (
            !this.personalDetail.birthPlace ||
            this.personalDetail.birthPlace.trim() === ""
        ) {
            errors.birthPlace = "Tempat lahir tidak boleh kosong.";
        }

        // 5. Validasi gender
        if (
            !this.personalDetail.gender ||
            this.personalDetail.gender.trim() === ""
        ) {
            errors.gender = "Jenis kelamin tidak boleh kosong.";
        }

        if (
            !this.personalDetail.maritalStatus ||
            this.personalDetail.maritalStatus.trim() === ""
        ) {
            errors.maritalStatus = "Status perkawinan tidak boleh kosong.";
        }

        if (
            !this.personalDetail.bloodType ||
            this.personalDetail.bloodType.trim() === ""
        ) {
            errors.bloodType = "Golongan darah tidak boleh kosong.";
        }

        if (
            !this.personalDetail.religion ||
            this.personalDetail.religion.trim() === ""
        ) {
            errors.religion = "Agama tidak boleh kosong.";
        }

        // Jika tidak ada error, kembalikan null
        if (Object.keys(errors).length === 0) {
            return null;
        }

        return errors;
    }

    contactDetailValidate() {
        const errors: ContactDetailErrors = {};

        // 1. Validasi email
        if (
            !this.contactDetail.email ||
            this.contactDetail.email.trim() === ""
        ) {
            errors.email = "Email tidak boleh kosong.";
        }

        if (!isValidEmail(this.contactDetail.email)) {
            errors.email = "Format email tidak valid.";
        }

        // 2. Validasi phoneNumber
        if (
            !this.contactDetail.phoneNumber ||
            this.contactDetail.phoneNumber.number === ""
        ) {
            errors.phoneNumber = "Nomor telepon tidak boleh kosong.";
        }

        // 3. Validasi emergencyName
        if (
            !this.contactDetail.emergencyName ||
            this.contactDetail.emergencyName.trim() === ""
        ) {
            errors.emergencyName = "Nama kontak darurat tidak boleh kosong.";
        }

        // 4. Validasi emergencyPhoneNumber
        if (
            !this.contactDetail.emergencyPhoneNumber ||
            this.contactDetail.emergencyPhoneNumber.number === ""
        ) {
            errors.emergencyPhoneNumber =
                "Nomor telepon kontak darurat tidak boleh kosong.";
        }

        if (
            !this.contactDetail.emergencyRelation ||
            this.contactDetail.emergencyRelation.trim() === ""
        ) {
            errors.emergencyRelation =
                "Relasi kontak darurat tidak boleh kosong.";
        }

        // Jika tidak ada error, kembalikan null
        if (Object.keys(errors).length === 0) {
            return null;
        }

        return errors;
    }

    employeeValidate() {
        const errors: EmployeeDataErrors = {};

        if (
            !this.employmentDetail.employeeId ||
            this.employmentDetail.employeeId.trim() === ""
        ) {
            errors.employeeId = "ID karyawan tidak boleh kosong.";
        }

        if (
            !this.employmentDetail.fingerCode ||
            this.employmentDetail.fingerCode.trim() === ""
        ) {
            errors.fingerCode = "ID fingerprint tidak boleh kosong.";
        }

        if (!this.employmentDetail.department) {
            errors.department = "Departemen tidak boleh kosong.";
        }

        if (!this.employmentDetail.jobLevel) {
            errors.jobLevel = "Jabatan tidak boleh kosong.";
        }

        if (
            !this.employmentDetail.jobTitle ||
            this.employmentDetail.jobTitle.trim() === ""
        ) {
            errors.jobTitle = "Jabatan tidak boleh kosong.";
        }

        if (
            !this.employmentDetail.employmentType ||
            this.employmentDetail.employmentType.trim() === ""
        ) {
            errors.employmentType = "Jenis pekerjaan tidak boleh kosong.";
        }

        if (
            !this.employmentDetail.status ||
            this.employmentDetail.status.trim() === ""
        ) {
            errors.status = "Status pekerjaan tidak boleh kosong.";
        }

        // if (!this.employmentDetail.startDate) {
        //     console.log(this.employmentDetail.startDate)
        //     errors.startDate = "Tanggal mulai kerja tidak boleh kosong.";
        // }

        // if (!this.employmentDetail.endDate) {
        //     errors.endDate = "Tanggal selesai kerja tidak boleh kosong.";
        // }

        // if (!this.employmentDetail.resignDate) {
        //     errors.resignDate = "Tanggal resign tidak boleh kosong.";
        // }

        // Jika tidak ada error, kembalikan null
        if (Object.keys(errors).length === 0) {
            return null;
        }

        return errors;
    }

    bankDetailValidate() {
        const errors: BankDetailErrors = {};

        if (
            !this.bankDetail.bankName ||
            this.bankDetail.bankName.trim() === ""
        ) {
            errors.bankName = "Nama bank tidak boleh kosong.";
        }

        if (
            !this.bankDetail.accountName ||
            this.bankDetail.accountName.trim() === ""
        ) {
            errors.accountName = "Nama akun tidak boleh kosong.";
        }

        if (
            !this.bankDetail.accountNumber ||
            this.bankDetail.accountNumber.trim() === ""
        ) {
            errors.accountNumber = "Nomor akun tidak boleh kosong.";
        }

        if (
            !this.bankDetail.ifscCode ||
            this.bankDetail.ifscCode.trim() === ""
        ) {
            errors.ifscCode = "IFSC code tidak boleh kosong.";
        }

        // Jika tidak ada error, kembalikan null
        if (Object.keys(errors).length === 0) {
            return null;
        }

        return errors;
    }

    insuranceDetailValidate() {
        const errors: InsuranceDetailErrors = {};

        if (
            !this.insuranceDetail.bpjsKetenagakerjaan ||
            this.insuranceDetail.bpjsKetenagakerjaan.trim() === ""
        ) {
            errors.bpjsKetenagakerjaan =
                "BPJS Ketenagakerjaan tidak boleh kosong.";
        }

        if (
            !this.insuranceDetail.bpjsKesehatan ||
            this.insuranceDetail.bpjsKesehatan.trim() === ""
        ) {
            errors.bpjsKesehatan = "BPJS Kesehatan tidak boleh kosong.";
        }

        // Jika tidak ada error, kembalikan null
        if (Object.keys(errors).length === 0) {
            return null;
        }

        return errors;
    }
}
