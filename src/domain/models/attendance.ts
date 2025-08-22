// src/domain/models/attendance.ts
export class Attendance {
    public readonly id: string;
    public readonly userId: string;
    public readonly userName: string;
    public readonly checkInTime: Date | null;
    public readonly checkOutTime: Date | null;
    public readonly status: 'PRESENT' | 'ABSENT';

    constructor(props: {
        id: string;
        userId: string;
        userName: string;
        checkInTime: string | Date | null;
        checkOutTime: string | Date | null;
        status: 'PRESENT' | 'ABSENT';
    }) {
        this.id = props.id;
        this.userId = props.userId;
        this.userName = props.userName;
        this.checkInTime = props.checkInTime ? new Date(props.checkInTime) : null;
        this.checkOutTime = props.checkOutTime ? new Date(props.checkOutTime) : null;
        this.status = props.status;
    }
}