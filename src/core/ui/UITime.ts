
export class UITime {

    constructor(public hours: number,
        public minutes: number,
        public seconds?: number) {

    }

    static from(value: { hours: number; minutes: number; seconds?: number }): UITime {
        return new UITime(value.hours, value.minutes, value.seconds);
    }

    static default(): UITime { return new UITime(0, 0); }
    static now(): UITime {
        const now = new Date();
        return new UITime(now.getHours(), now.getMinutes(), now.getSeconds());
    }

    toString(): string {
        const hours = this.hours < 10 ? `0${this.hours}` : this.hours.toString();
        const minutes = this.minutes < 10 ? `0${this.minutes}` : this.minutes.toString();
        const seconds = this.seconds ? this.seconds < 10 ? `0${this.seconds}` : this.seconds.toString() : "00";
        return `${hours}:${minutes}:${seconds}`;
    }

    toSeconds(): number {
        return this.hours * 3600 + this.minutes * 60 + (this.seconds || 0);
    }

    toHoursMinutesString(): string {
        const hours = this.hours < 10 ? `0${this.hours}` : this.hours.toString();
        const minutes = this.minutes < 10 ? `0${this.minutes}` : this.minutes.toString();
        return `${hours}:${minutes}`;
    }

    toTimestamp(): number {
        const date = new Date();
        date.setHours(this.hours);
        date.setMinutes(this.minutes);
        date.setSeconds(this.seconds || 0);
        return date.getTime();
    }

    static fromSeconds(seconds: number): UITime {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return new UITime(hours, minutes, remainingSeconds);
    }

    static fromTimestamp(timestamp: number): UITime {
        const date = new Date(timestamp);
        return new UITime(date.getHours(), date.getMinutes(), date.getSeconds());
    }

    static fromHoursMinutesString(hoursMinutes: string): UITime {
        const [hours, minutes] = hoursMinutes.split(":");
        return new UITime(parseInt(hours), parseInt(minutes));
    }

    static fromTimestampString(timestamp: string): UITime {
        const date = new Date(timestamp);
        return new UITime(date.getHours(), date.getMinutes(), date.getSeconds());
    }


}