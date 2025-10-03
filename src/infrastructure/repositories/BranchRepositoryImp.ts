import type { HttpRequest } from "@/api/httpRequest";
import { TOKENS } from "@/container/tokens";
import type { DomainBranch } from "@/domain/models/Branch";
import type { BranchRepository } from "@/domain/repositories/BranchRepository";
import type { Branch } from "@/domain/types/BranchAttributes";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { injected } from "brandi";

export class BranchRepositoryImp implements BranchRepository {
    http: HttpRequest;

    constructor(http: HttpRequest) {
        this.http = http;
    }

    async getAll(query?: IQueryMetadata): Promise<DomainBranch[]> {
        const response = await this.http.GET<DomainBranch[]>(
            "companies/branches",
            { ...query },
        );
        return response.data;
    }

    async getOne(uuid: string): Promise<DomainBranch> {
        const response = await this.http.GET<DomainBranch>(
            `companies/${uuid}/branches`,
        );
        return response.data;
    }

    async create(branch: Branch, companyUuid: string): Promise<DomainBranch> {
        const response = await this.http.POST<DomainBranch, Branch>(
            `companies/${companyUuid}/branches`,
            branch,
        );
        return response.data;
    }

    async update(branch: DomainBranch): Promise<DomainBranch> {
        const response = await this.http.PUT<DomainBranch, DomainBranch>(
            `branches/${branch.uuid}`,
            branch,
        );
        return response.data;
    }

    async delete(branch: DomainBranch): Promise<DomainBranch> {
        const response = await this.http.DELETE<DomainBranch>(
            `companies/${branch.uuid}/branches`,
        );
        return response.data;
    }
}

injected(BranchRepositoryImp, TOKENS.httpRequest);
