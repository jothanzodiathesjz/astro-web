import { TOKENS } from "@/container/tokens";
import type { EmployeeRepository } from "@/domain/repositories/EmployeeRepository";
import { injected } from "brandi";
import { EmployeeUI } from "./Employee.ui";
import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import type { DepartmentRepository } from "@/domain/repositories/DepartmentRepository";
import type { Department } from "@/domain/types/EmployeeAttributes";
import { handleErrors, UIError } from "@/core/ui/UIError";
import { useRoute, useRouter } from "vue-router";
import { ToastUI } from "@/core/ui/Toast.ui";
import { formatFeatureLabel } from "@/core/utils/Text";

export class EmployeeFormViewModel {
    repository: EmployeeRepository;
    departmentRepository: DepartmentRepository;
    employee: EmployeeUI = new EmployeeUI();
    route = useRoute();
    router = useRouter();

    erorrs: UIError | null = null;
    alerts: ToastUI | null = null;
    steps = 1;
    submiting = false;
    isUpdate = false;

    constructor(
        repository: EmployeeRepository,
        departmentRepository: DepartmentRepository,
    ) {
        this.repository = repository;
        this.departmentRepository = departmentRepository;
    }

    bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
        (bg) => new DropdownLabel<string>(bg),
    );
    religionOptions = [
        "Islam",
        "Kristen",
        "Katolik",
        "Hindu",
        "Buddha",
        "Konghucu",
    ].map((religion) => new DropdownLabel<string>(religion));
    maritalStatusOptions = ["Single", "Married", "Divorced"].map(
        (maritalStatus) => new DropdownLabel<string>(maritalStatus),
    );

    genderOptions = ["Male", "Female"].map(
        (gender) => new DropdownLabel<string>(gender),
    );
    departMentOptions: DropdownLabel<Department>[] = [];
    jobLevelOptions = ["DIREKSI", "STAFF", "HARIAN", "MANAJER"].map(
        (jobLevel) => {
            return {
                id: jobLevel,
                label: formatFeatureLabel(jobLevel),
                value: jobLevel
            } as DropdownLabel<string>
        },
    );
    jobTitleOptions = ["IT", "HR", "Sales", "Marketing", "Finance"].map(
        (jobTitle) => new DropdownLabel<string>(jobTitle),
    );
    employmentTypeOptions = ["PERMANENT", "CONTRACT", "HARLES"].map(
        (employmentType) => {
            return {
                id: employmentType,
                label: formatFeatureLabel(employmentType),
                value: employmentType
            } as DropdownLabel<string>
        },
    );
    statusOptions = ["ACTIVE", "RESIGNED", "TERMINATED", "CONTRACT END"].map(
        (status) => {
            return {
                id: status,
                label: formatFeatureLabel(status),
                value: status
            } as DropdownLabel<string>
        },
    );
    relationOptions = [
        "Ibu",
        "Ayah",
        "Suami",
        "Istri",
        "Anak",
        "Saudara",
        "Kerabat",
    ].map((relation) => new DropdownLabel<string>(relation));

    async getDepertmentList() {
        try {
            const data = await this.departmentRepository.getDepartments();
            this.departMentOptions = data.map(
                (department) =>
                    new DropdownLabel<Department>(department, "code", "name"),
            );
        } catch (error) {
            this.erorrs = handleErrors(error);
        }
    }

    async stepByValidate() {
        const personalDataValidate = this.employee.personalDataValidate();
        const contactValidate = this.employee.contactDetailValidate();
        const employeeValidate = this.employee.employeeValidate();
        const bankDetailValidate = this.employee.bankDetailValidate();

        if (personalDataValidate && this.steps === 1) {
            this.erorrs = new UIError("Form Harus diisi", personalDataValidate);
            console.log(this.erorrs);
            return;
        }

        if (contactValidate && this.steps === 3) {
            this.erorrs = new UIError("Form Harus diisi", contactValidate);
            console.log(this.erorrs);
            return;
        }

        if (employeeValidate && this.steps === 4) {
            this.erorrs = new UIError("Form Harus diisi", employeeValidate);
            console.log(this.erorrs);
            return;
        }

        if (bankDetailValidate && this.steps === 5) {
            this.erorrs = new UIError("Form Harus diisi", bankDetailValidate);
            console.log(this.erorrs);
            return;
        }

        this.steps = this.steps + 1;
    }

    async createEmployee() {
        const insuranceDetailValidate = this.employee.insuranceDetailValidate();
        if (insuranceDetailValidate && this.steps === 6) {
            this.erorrs = new UIError(
                "Form Harus diisi",
                insuranceDetailValidate,
            );
            return;
        }
        try {
            this.submiting = true;
            if (this.isUpdate) {
                await this.repository.update(
                    this.employee.toDomain(this.isUpdate),
                );
                this.alerts = new ToastUI(
                    "Successfully Updated Employee",
                    "success",
                    2000,
                );
                setTimeout(() => {
                    this.router.push({ name: "Employee" });
                }, 2300);
                return;
            }

            await this.repository.create(this.employee.toDomain(this.isUpdate));
            this.alerts = new ToastUI(
                "Successfully Created Employee",
                "success",
                2000,
            );

            setTimeout(() => {
                this.router.push({ name: "Employee" });
            }, 2300);
        } catch (error) {
            console.log(error);
            this.erorrs = handleErrors(error);
            this.submiting = false;
        }
    }

    async getEmployee(uuid: string) {
        try {
            const data = await this.repository.getOne(uuid);
            this.employee = EmployeeUI.fromDomain(data);
        } catch (error) {
            this.erorrs = handleErrors(error);
            this.alerts = new ToastUI(this.erorrs.message, "error", 2000);
        }
    }

    async initialize() {
        const uuid = this.route.params.uuid as string | undefined;
        if (uuid) {
            this.isUpdate = true;
            this.getEmployee(uuid);
        }
        await this.getDepertmentList();
    }
}

injected(
    EmployeeFormViewModel,
    TOKENS.EmployeeRepository,
    TOKENS.DepartmentRepository,
);
