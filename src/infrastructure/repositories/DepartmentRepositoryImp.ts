import type { HttpRequest } from "@/api/httpRequest";
import { TOKENS } from "@/container/tokens";
import type { DepartmentRepository } from "@/domain/repositories/DepartmentRepository";
import type { Department } from "@/domain/types/EmployeeAttributes";
import { injected } from "brandi";

export class DepartmentRepositoryImp implements DepartmentRepository {
    httpRequest: HttpRequest

    constructor(httpRequest: HttpRequest) {
        this.httpRequest = httpRequest;
    }

    async getDepartments(): Promise<Department[]> {
        const response = await this.httpRequest.GET<Department[]>("departments");
        return response.data;
    }

    async create(department: Department): Promise<Department> {
        const response = await this.httpRequest.POST<Department, Department>("departments", department);
        return response.data;
    }

    async delete(code: string): Promise<void> {
        await this.httpRequest.DELETE(`departments/${code}`);
    }
}

injected(
    DepartmentRepositoryImp,
    TOKENS.httpRequest
)