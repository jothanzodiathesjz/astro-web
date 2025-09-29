import type { IQueryMetadata } from "@/http-client/query-metadata"
import type { DomainCompany } from "../models/Company"
import type { DomainBranch } from "../models/Branch"

export type CompanyRepository = {
    getOne(uuid: string): Promise<DomainCompany>
    getAll(query?: IQueryMetadata): Promise<DomainCompany[]>
    create(company: DomainCompany): Promise<DomainCompany>
    update(company: DomainCompany): Promise<DomainCompany>
    delete(uuid: string): Promise<void>;
    getBranches(uuid: string): Promise<DomainBranch[]>
}