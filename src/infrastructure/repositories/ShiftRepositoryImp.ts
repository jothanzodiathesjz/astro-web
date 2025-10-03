import type { HttpRequest } from "@/api/httpRequest";
import { TOKENS } from "@/container/tokens";
import type { DomainShift } from "@/domain/models/Shift";
import type { ShiftRepository } from "@/domain/repositories/ShiftRepository";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { injected } from "brandi";

export class ShiftRepositoryImp implements ShiftRepository {
    http: HttpRequest;

    constructor(http: HttpRequest) {
        this.http = http;
    }

    async getShifts(query: IQueryMetadata): Promise<DomainShift[]> {
        const response = await this.http.GET<DomainShift[]>("/shifts", {
            ...query,
        });
        return response.data;
    }

    async getShift(uuid: string): Promise<DomainShift> {
        const response = await this.http.GET<DomainShift>(`/shifts/${uuid}`);
        return response.data;
    }

    async createShift(shift: DomainShift): Promise<DomainShift> {
        const response = await this.http.POST<DomainShift, DomainShift>(
            "/shifts",
            shift,
        );
        return response.data;
    }

    async updateShift(shift: DomainShift): Promise<DomainShift> {
        const response = await this.http.PUT<DomainShift, DomainShift>(
            `/shifts/${shift.uuid}`,
            shift,
        );
        return response.data;
    }

    async deleteShift(uuid: string): Promise<void> {
        await this.http.DELETE(`/shifts/${uuid}`);
    }
}

injected(ShiftRepositoryImp, TOKENS.httpRequest);
