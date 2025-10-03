import type { IQueryMetadata } from "@/http-client/query-metadata";
import type { DomainEmployee } from "../models/Employee";

export type EmployeeRepository = {
    getALl: (
        query: IQueryMetadata,
    ) => Promise<[DomainEmployee[], string | undefined]>;
    create: (user: DomainEmployee) => Promise<DomainEmployee>;
    delete: (uuid: string) => Promise<void>;
    getOne: (uuid: string) => Promise<DomainEmployee>;
    update(employee: DomainEmployee): Promise<DomainEmployee>;
};
