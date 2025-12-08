import type { HttpRequest } from "@/http-client/httpRequest";
import { TOKENS } from "@/container/tokens";
import { DomainEmployeeTimeOff, DomainTimeOff, EmployeeTimeOffToData } from "@/domain/models/TimeOff";
import type { TimeOffRepository } from "@/domain/repositories/TimeOffRepository";
import type { IQueryMetadata } from "@/http-client/query-metadata";
import { injected } from "brandi";

export class TimeOffRepositoryImp implements TimeOffRepository {
    http: HttpRequest;

    constructor(http: HttpRequest) {
        this.http = http;
    }

    async getList(query?: IQueryMetadata): Promise<DomainTimeOff[]> {
        const response = await this.http.GET<DomainTimeOff[]>("time-off", {
            ...query,
        });
        return response.data.map((u) => new DomainTimeOff(u));
    }

    async create(timeOff: DomainTimeOff): Promise<DomainTimeOff> {
        const response = await this.http.POST<DomainTimeOff, DomainTimeOff>(
            "time-off",
            timeOff,
        );
        return response.data;
    }

    async update(timeOff: DomainTimeOff): Promise<DomainTimeOff> {
        const response = await this.http.PUT<DomainTimeOff, DomainTimeOff>(
            `time-off/${timeOff.uuid}`,
            timeOff,
        );
        return response.data;
    }

    async delete(uuid: string): Promise<void> {
        await this.http.DELETE(`time-off/${uuid}`);
    }

    async get(uuid: string): Promise<DomainTimeOff> {
        const response = await this.http.GET<DomainTimeOff>(`time-off/${uuid}`);
        return response.data;
    }

    async createEmployeeTimeOff(data: EmployeeTimeOffToData): Promise<void> {
        await this.http.POST<void, EmployeeTimeOffToData>("employee-timeoffs", data);
    }

    async getTimeOffRequestList(query?: IQueryMetadata): Promise<[DomainEmployeeTimeOff[], string | undefined]> {
        const response = await this.http.GET<DomainEmployeeTimeOff[]>("employee-timeoffs", {
            ...query,
        });

        if (!response.data) {
            return [[], undefined];
        }
        return [response.data.map((u) => new DomainEmployeeTimeOff(u)), response.next_cursor];
    }
}

injected(TimeOffRepositoryImp, TOKENS.httpRequest);
