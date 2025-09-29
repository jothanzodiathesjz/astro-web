import type { DomainSchedule } from "@/domain/models/Schedule";
import type { DomainShift } from "@/domain/models/Shift";
import type { Schedule } from "@/domain/types/ScheduleAttributes";

export const TZ = "Asia/Makassar";

// Membulatkan ke tengah malam lokal (agar diff hari akurat)
function atMidnightLocal(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

// Selisih hari (pembulatan ke bawah) antara dua tanggal (lokal)
function diffDaysLocal(from: Date, to: Date) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor(
        (atMidnightLocal(to).getTime() - atMidnightLocal(from).getTime()) /
        msPerDay,
    );
}

// Modulo yang selalu positif
function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

// Hitung index hari siklus (1..cycle_days) untuk sebuah tanggal
export function cycleDayForDate(date: Date, schedule: Schedule): number {
    const start = new Date(schedule.effective_date);
    const d = diffDaysLocal(start, date);
    return mod(d, schedule.cycle_days) + 1; // +1 => 1..cycle_days
}

// Ambil shift utk tanggal tertentu (bisa "OFF" bila tidak ditemukan)
export function shiftForDate(
    date: Date,
    schedule: Schedule,
): DomainShift | null {
    const day = cycleDayForDate(date, schedule);
    const found = schedule.day_schedules.find((ds) => ds.day === day);
    return found?.shift ?? null;
}

// Format tanggal ringkas (bhs Indonesia)
export function formatDateID(date: Date) {
    return date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
    });
}

// Bangun 7 hari mulai hari ini
export function buildWeekFromToday(schedule: Schedule) {
    const today = atMidnightLocal(new Date());
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const shift = shiftForDate(d, schedule);
        return {
            date: d,
            label: formatDateID(d),
            cycleDay: cycleDayForDate(d, schedule),
            shift, // null artinya OFF
        };
    });
}

export function startOfWeekMonday(anchor = new Date()): Date {
    const d = atMidnightLocal(anchor);
    const jsDay = d.getDay(); // 0=Sun, 1=Mon, ... 6=Sat
    // Offset ke Senin: jika Minggu (0), mundur 6 hari; selain itu mundur (jsDay - 1)
    const offset = jsDay === 0 ? -6 : 1 - jsDay;
    const start = new Date(d);
    start.setDate(d.getDate() + offset);
    return start; // Senin
}

export function buildCalendarWeekStartingMonday(
    schedule: DomainSchedule,
    anchor = new Date(),
) {
    const monday = startOfWeekMonday(anchor);
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const shift = shiftForDate(d, schedule);
        return {
            date: d,
            label: formatDateID(d), // contoh: Sen, 22 Sep
            cycleDay: cycleDayForDate(d, schedule),
            shift, // null => OFF
            isToday:
                atMidnightLocal(d).getTime() ===
                atMidnightLocal(new Date()).getTime(),
        };
    });
}
export type RangeItem = {
    date: Date;
    label: string;       // "Sen, 22 Sep"
    cycleDay: number;    // 1..cycle_days
    shift: any | null;   // tipe Shift kamu di sini
    isToday: boolean;
};
export function buildCalendarRangeWithSchedule(
    schedule: DomainSchedule,
    startTs: number,
    endTs: number,
): RangeItem[] {
    // Normalisasi & urutkan rentang
    const start = atMidnightLocal(new Date(Math.min(startTs, endTs)));
    const end = atMidnightLocal(new Date(Math.max(startTs, endTs)));

    const today = atMidnightLocal(new Date());
    const result: RangeItem[] = [];

    // Iterasi harian (inklusif)
    for (
        const cur = new Date(start);
        cur.getTime() <= end.getTime();
        cur.setDate(cur.getDate() + 1)
    ) {
        const d = new Date(cur); // clone
        const shift = shiftForDate(d, schedule);

        result.push({
            date: d,
            label: formatDateID(d),
            cycleDay: cycleDayForDate(d, schedule),
            shift, // null => OFF
            isToday: atMidnightLocal(d).getTime() === today.getTime(),
        });
    }

    return result;
}

export function calendarWeekStartingMondayGenerator(anchor = new Date()) {
    const monday = startOfWeekMonday(anchor);
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return {
            date: d,
            label: d.toLocaleDateString("id-ID", {
                weekday: "short",
                day: "2-digit",
                month: "short",
            }),
            isToday:
                atMidnightLocal(d).getTime() ===
                atMidnightLocal(new Date()).getTime(),
        };
    });
}

export function buildCalendarBiweeklyStartingMonday(anchor = new Date()) {
    const monday = startOfWeekMonday(anchor);
    return Array.from({ length: 14 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return {
            date: d,
            week: i < 7 ? 1 : 2, // minggu ke-1 atau ke-2
            label: d.toLocaleDateString("id-ID", {
                weekday: "short",
                day: "2-digit",
                month: "short",
            }),
            isToday:
                atMidnightLocal(d).getTime() ===
                atMidnightLocal(new Date()).getTime(),
        };
    });
}

function startOfMonth(anchor = new Date()): Date {
    const d = atMidnightLocal(anchor);
    d.setDate(1);
    return d;
}

export type CalendarDay = {
    date: Date;
    label: string; // e.g. "01", "15"
    weekdayLabel: string; // e.g. "Sen", "Sel"
    isToday: boolean;
    isCurrentMonth: boolean;
    weekIndex: number; // 0..5 (baris ke-)
};

/**
 * Bangun grid bulanan 6×7 (42 hari) yang SELALU mulai Senin,
 * mencakup semua hari di bulan anchor, plus spillover dari bulan
 * sebelumnya & sesudahnya untuk melengkapi minggu.
 *
 * @param anchor tanggal acuan (default: hari ini)
 * @returns CalendarDay[] panjang 42
 */
export function buildCalendarMonthlyStartingMonday(
    anchor = new Date(),
): CalendarDay[] {
    const today = atMidnightLocal(new Date());
    const monthStart = startOfMonth(anchor);
    //   const monthEnd = endOfMonth(anchor);

    // Mulai grid dari Senin pada minggu yang memuat tanggal 1
    const gridStart = startOfWeekMonday(monthStart);

    // 6 minggu × 7 hari = 42 sel kalender
    const days: CalendarDay[] = Array.from({ length: 42 }, (_, idx) => {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + idx);

        const isCurrentMonth =
            d.getMonth() === monthStart.getMonth() &&
            d.getFullYear() === monthStart.getFullYear();

        const weekIndex = Math.floor(idx / 7); // 0..5

        return {
            date: d,
            label: d.toLocaleDateString("id-ID", { day: "2-digit" }),
            weekdayLabel: d.toLocaleDateString("id-ID", { weekday: "short" }), // Sen, Sel, ...
            isToday: atMidnightLocal(d).getTime() === today.getTime(),
            isCurrentMonth,
            weekIndex,
        };
    });

    return days;
}

/**
 * Versi grouped (array 6 elemen, tiap elemen 7 hari).
 * Memudahkan render per baris minggu.
 */
export function buildCalendarMonthlyGroupedStartingMonday(
    anchor = new Date(),
): CalendarDay[][] {
    const flat = buildCalendarMonthlyStartingMonday(anchor);
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < 6; i++) {
        weeks.push(flat.slice(i * 7, i * 7 + 7));
    }
    return weeks;
}

/** Label bulan-tahun untuk header, mis: "September 2025" */
export function monthTitleID(anchor = new Date()): string {
    return anchor.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
    });
}

/** Label weekdays Sen → Min (fix: selalu mulai Senin) */
export function weekdayHeadersID(): string[] {
    // build dari Senin anchor tetap
    const monday = startOfWeekMonday(new Date(2025, 0, 6)); // 6 Jan 2025 = Senin
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d.toLocaleDateString("id-ID", { weekday: "short" }); // "Sen", "Sel", ...
    });
}

export function isToday(dateStr: string): boolean {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // "YYYY-MM-DD"
    return dateStr === todayStr;
}

export type RangeDay = {
    date: Date;
    label: string; // "01", "15", ...
    weekdayLabel: string; // "Sen", "Sel", ...
    isToday: boolean;
};

/**
 * Membuat array tanggal (RangeDay) dari rentang start–end (timestamps ms).
 */
export function dateRange(startTs: number, endTs: number): RangeDay[] {
    const result: RangeDay[] = [];
    const start = new Date(startTs);
    const end = new Date(endTs);

    // normalisasi ke tengah malam
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const cur = new Date(start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (cur.getTime() <= end.getTime()) {
        result.push({
            date: new Date(cur),
            label: cur.toLocaleDateString("id-ID", { day: "2-digit" }),
            weekdayLabel: cur.toLocaleDateString("id-ID", { weekday: "short" }), // Sen, Sel, Rab
            isToday: cur.getTime() === today.getTime(),
        });

        cur.setDate(cur.getDate() + 1); // maju 1 hari
    }

    return result;
}

/**
 * Build range tanggal (inklusif) dari startTs hingga endTs.
 * Hasil: { date, label: "01", weekdayLabel: "Sen", isToday }
 */
export function buildCalenderRangeDate(startTs: number, endTs: number): RangeDay[] {
    const result: RangeDay[] = [];

    // Normalisasi & urutkan rentang
    const start = atMidnightLocal(new Date(Math.min(startTs, endTs)));
    const end = atMidnightLocal(new Date(Math.max(startTs, endTs)));

    const today = atMidnightLocal(new Date());

    for (
        const cur = new Date(start);
        cur.getTime() <= end.getTime();
        cur.setDate(cur.getDate() + 1)
    ) {
        const d = new Date(cur); // clone
        result.push({
            date: d,
            label: d.toLocaleDateString("id-ID", { day: "2-digit" }),
            weekdayLabel: d.toLocaleDateString("id-ID", { weekday: "short" }),
            isToday: atMidnightLocal(d).getTime() === today.getTime(),
        });
    }

    return result;
}