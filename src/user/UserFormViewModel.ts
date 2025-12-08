import { DropdownLabel } from "@/core/components/models/DropdownLabel";
import { TOKENS } from "@/container/tokens";
import { DomainUser } from "@/domain/models/User";
import type { UserRepository } from "@/domain/repositories/UserRepository";
import type { Gender } from "@/domain/types/UserAttributes";
import { injected } from "brandi";
import { isValidEmail } from "@/core/utils/EmailValidator";
import { UIError } from "@/core/ui/UIError";
import { ToastUI } from "@/core/ui/Toast.ui";
import { useRouter } from "vue-router";

type UserFormValidationError = {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    gender?: string;
    employeeId?: string;
    role?: string;
    accessFeature?: string;
};

export class UserFormViewModel {
    repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    user: DomainUser = DomainUser.empty();
    errors: UIError | null = null;
    alerts: ToastUI | null = null;

    date: Date | Date[] = new Date();
    roles: string[] = ["SUPER_ADMIN", "ADMIN", "EMPLOYEE"];
    roleOptions: DropdownLabel<string>[] = this.roles.map((role) => ({
        label: this.toCapitalize(role),
        value: role,
        id: role,
    }));
    selectedRole: DropdownLabel<string> | null = null;
    password: string = "";
    confirmPassword: string = "";
    submiting: boolean = false;

    isUpdate: boolean = false;
    router = useRouter();

    accessFeatureOptions: string[] = [
        "DASHBOARD",
        "USER",
        "EMPLOYEE",
        "ATTENDANCE",
        "SCHEDULE",
        "SHIFT",
        "PAYROLL",
        "LEAVE",
        "REPORT",
        "SETTING",
        "LOGOUT",
    ];

    selectedAccessFeature = new Set<string>();

    selectedGender: Gender = "M";

    toCapitalize(value: string) {
        return value
            .toLowerCase()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    validateForm(): UserFormValidationError {
        const errors: UserFormValidationError = {};

        // Validasi untuk username, email, dan nama
        if (!this.user.username || this.user.username.trim() === "") {
            errors.username = "Username tidak boleh kosong.";
        }
        if (!this.user.email || this.user.email.trim() === "") {
            errors.email = "Email tidak boleh kosong.";
        }
        if (!isValidEmail(this.user.email)) {
            errors.email = "Format email tidak valid.";
        }
        if (!this.user.name || this.user.name.trim() === "") {
            errors.name = "Nama tidak boleh kosong.";
        }

        // --- Perbaikan Validasi Password ---
        // Logika yang lebih efisien untuk validasi password.

        // Hanya jalankan validasi password jika sedang membuat user baru (bukan update).
        // Atau jika password diisi saat update (untuk mengubah password).
        if (!this.isUpdate) {
            // Validasi password kosong
            if (!this.password || this.password.trim() === "") {
                errors.password = "Password tidak boleh kosong.";
            }

            // Validasi konfirmasi password kosong
            if (!this.confirmPassword || this.confirmPassword.trim() === "") {
                errors.confirmPassword =
                    "Konfirmasi password tidak boleh kosong.";
            }

            // Validasi kesamaan password hanya jika kedua field sudah terisi.
            if (
                this.password &&
                this.confirmPassword &&
                this.password !== this.confirmPassword
            ) {
                errors.confirmPassword =
                    "Password dan konfirmasi password harus sama.";
            }
        }
        // --- Akhir Perbaikan Validasi Password ---

        // Validasi untuk field lainnya
        if (!this.selectedRole) {
            errors.role = "Role tidak boleh kosong.";
        }
        if (!this.user.employee_id || this.user.employee_id.trim() === "") {
            errors.employeeId = "ID karyawan tidak boleh kosong.";
        }
        if (!this.selectedGender) {
            errors.gender = "Jenis kelamin tidak boleh kosong.";
        }
        if (this.selectedAccessFeature.size === 0) {
            errors.accessFeature = "Akses fitur tidak boleh kosong.";
        }

        return errors;
    }

    toggleSelectAll(isAllSelected: boolean) {
        if (isAllSelected) {
            this.selectedAccessFeature = new Set();
        } else {
            this.selectedAccessFeature = new Set(this.accessFeatureOptions);
        }
    }

    async save() {
        const validate = this.validateForm();
        console.log(validate);
        if (Object.keys(validate).length > 0) {
            this.errors = new UIError(
                "Lengkapi form terlebih dahulu.",
                validate,
            );
            return;
        }
        try {
            this.submiting = true;
            if (this.isUpdate) {
                const res = await this.repository.update(
                    this.user.toData(
                        this.password,
                        this.confirmPassword,
                        this.selectedGender,
                        this.date.toString(),
                        this.selectedRole!.value,
                        Array.from(this.selectedAccessFeature),
                    ),
                );
                this.user = res;
                this.alerts = new ToastUI(
                    "User berhasil diupdate.",
                    "success",
                    2000,
                );
            } else {
                await this.repository.create(
                    this.user.toData(
                        this.password,
                        this.confirmPassword,
                        this.selectedGender,
                        this.date.toString(),
                        this.selectedRole!.value,
                        Array.from(this.selectedAccessFeature),
                    ),
                );
                this.alerts = new ToastUI(
                    "User berhasil dibuat.",
                    "success",
                    2000,
                );
            }
            setTimeout(() => {
                this.router.push({ name: "Users" });
            }, 2500);
        } catch (error) {
            alert(error);
        } finally {
            this.submiting = false;
        }
    }

    async getUser() {
        this.user = await this.repository.getOne();
        this.selectedGender = this.user.gender as Gender;
        this.date = new Date(this.user.dob);
        this.selectedRole = new DropdownLabel<string>(this.user.role.name);
        this.selectedAccessFeature = new Set(this.user.role.access_codes);
    }
}

injected(UserFormViewModel, TOKENS.UserRepository);
