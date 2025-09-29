import type { IQueryMetadata } from "@/http-client/query-metadata";
import type { DomainShift } from "../models/Shift";

export type ShiftRepository = {
    getShifts(query: IQueryMetadata): Promise<DomainShift[]>;
    getShift(uuid: string): Promise<DomainShift>;
    createShift(shift: DomainShift): Promise<DomainShift>;
    updateShift(shift: DomainShift): Promise<DomainShift>;
    deleteShift(uuid: string): Promise<void>;
}