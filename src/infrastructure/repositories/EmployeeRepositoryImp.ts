import type { HttpRequest } from "@/http-client/httpRequest";
import { TOKENS } from "@/container/tokens";
import { DomainEmployee } from "@/domain/models/Employee";
import type { EmployeeRepository } from "@/domain/repositories/EmployeeRepository";
import type { Employee } from "@/domain/types/EmployeeAttributes";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { injected } from "brandi";

export class EmployeeRepositoryImp implements EmployeeRepository {
    http: HttpRequest;
    constructor(http: HttpRequest) {
        this.http = http;
    }

    async getALl(
        query: IQueryMetadata,
    ): Promise<[DomainEmployee[], string | undefined]> {
        const response = await this.http.GET<Employee[]>("employees", {
            ...query,
        });
        return [
            response.data !== null
                ? response.data.map((u) => new DomainEmployee(u))
                : [],
            response.next_cursor,
        ];
    }

    async create(user: DomainEmployee): Promise<DomainEmployee> {
        const response = await this.http.POST<DomainEmployee, DomainEmployee>(
            "employees",
            user,
        );
        return response.data;
    }

    async delete(uuid: string): Promise<void> {
        await this.http.DELETE(`employees/${uuid}`);
    }

    async getOne(uuid: string): Promise<DomainEmployee> {
        const response = await this.http.GET<DomainEmployee>(
            `employees/${uuid}`,
        );
        return response.data;
    }

    async update(employee: DomainEmployee): Promise<DomainEmployee> {
        const response = await this.http.PUT<DomainEmployee, DomainEmployee>(
            `employees/${employee.uuid}`,
            employee,
        );
        return response.data;
    }
}

injected(EmployeeRepositoryImp, TOKENS.httpRequest);
