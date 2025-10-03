import type { IQueryMetadata } from "@/http-client/query-metadata";
import type { DomainBranch } from "../models/Branch";
import type { Branch } from "../types/BranchAttributes";

export type BranchRepository = {
    create(branch: Branch, companyUuid: string): Promise<DomainBranch>;
    update(branch: DomainBranch): Promise<DomainBranch>;
    delete(branch: DomainBranch): Promise<DomainBranch>;
    getOne(uuid: string, companyUuid: string): Promise<DomainBranch>;
    getAll(query?: IQueryMetadata): Promise<DomainBranch[]>;
};
