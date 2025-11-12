import { HttpRequest } from "@/http-client/httpRequest";
import { TOKENS } from "@/container/tokens";
import type { DomainBranch } from "@/domain/models/Branch";
import type { DomainCompany } from "@/domain/models/Company";
import type { CompanyRepository } from "@/domain/repositories/CompanyRepository";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { injected } from "brandi";

export class CompanyRepositoryImp implements CompanyRepository {
    http: HttpRequest;
    constructor(http: HttpRequest) {
        this.http = http;
    }

    async create(company: DomainCompany): Promise<DomainCompany> {
        const response = await this.http.POST<DomainCompany, DomainCompany>(
            "companies",
            company,
        );
        return response.data;
    }

    async getOne(uuid: string): Promise<DomainCompany> {
        const response = await this.http.GET<DomainCompany>(
            `companies/${uuid}`,
        );
        return response.data;
    }

    async getAll(query?: IQueryMetadata): Promise<DomainCompany[]> {
        const response = await this.http.GET<DomainCompany[]>("companies", {
            ...query,
        });
        return response.data;
    }

    async update(company: DomainCompany): Promise<DomainCompany> {
        const response = await this.http.PUT<DomainCompany, DomainCompany>(
            `companies/${company.uuid}`,
            company,
        );
        return response.data;
    }

    async delete(uuid: string): Promise<void> {
        await this.http.DELETE(`companies/${uuid}`);
    }

    async getBranches(uuid: string): Promise<DomainBranch[]> {
        const response = await this.http.GET<DomainBranch[]>(
            `companies/${uuid}/branches`,
        );
        return response.data;
    }
}

injected(CompanyRepositoryImp, TOKENS.httpRequest);
