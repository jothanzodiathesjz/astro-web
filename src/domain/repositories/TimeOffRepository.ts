import type { IQueryMetadata } from "@/http-client/query-metadata";
import type { DomainTimeOff } from "../models/TimeOff";

export type TimeOffRepository = {
    getList(query?: IQueryMetadata): Promise<DomainTimeOff[]>;
    create(timeOff: DomainTimeOff): Promise<DomainTimeOff>;
    update(timeOff: DomainTimeOff): Promise<DomainTimeOff>;
    delete(uuid: string): Promise<void>;
    get(uuid: string): Promise<DomainTimeOff>;
};
