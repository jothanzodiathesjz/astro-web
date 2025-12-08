import { TOKENS } from "@/container/tokens";
import { ToastUI } from "@/core/ui/Toast.ui";
import { handleErrors } from "@/core/ui/UIError";
import { formatDate } from "@/core/utils/DateConverter";
import { DomainAttendance, DomainAttendanceSummary } from "@/domain/models/Attendance";
import type { DomainEmployeeSummary } from "@/domain/models/Employee";
import type { AttendanceRepository } from "@/domain/repositories/AttendanceRepository";
import type { Attendance } from "@/domain/types/AttendanceAttributes";
import { injected } from "brandi";
import { nextTick } from "vue";

type ImportPayload = { rawFiles: File[] };
type ConsumeVerifyStreamOptions = {
    inactivityMs?: number;
    onTimeout?: () => void;
};

type SseEnvelope = {
    event?: string;
    data?: string;
    id?: string;
    retry?: string;
};
export class AttendanceViewModel {
    attendanceList: DomainAttendance[] = [];

    repository: AttendanceRepository;
    selectedAttendance: DomainAttendance | null = null;
    search: string = "";
    cursor: string | undefined = undefined;
    date: Date | Date[] | undefined = new Date();
    alerts: ToastUI | null = null;
    tbd: DomainAttendance | null = null;
    deleting: boolean = false;

    isImporting = false;
    importMessages: string[] = [];
    activeImportController: AbortController | null = null;
    selectionsAtt: DomainAttendance[] = [];

    tbe: DomainAttendance | null = null;
    selectedSummary: { type: string; count: number } | null = null;
    log: DomainAttendance | null = null;

    summaryLoading = false;
    summaryLoadingMore = false;

    isLoading = false;
    isLoadingMore = false;
    skeletonCount = 10;
    showImportPanel = false;

    selectedAttendanceIds: Set<string> = new Set<string>();
    selectedAttendanceCache: Map<string, DomainAttendance> = new Map();
    multiEditQueue: DomainAttendance[] = [];
    multiEditActive = false;
    shouldAdvanceMultiEdit = false;
    totalsSummary: DomainAttendanceSummary = DomainAttendanceSummary.empty();

    verifyStreamConfig = {
        inactivityMs: 10_000,
        timeoutToast: {
            message:
                "Streaming dihentikan karena tidak ada data baru selama 10 detik",
            type: "warning" as const,
            duration: 4000,
        },
    };

    // Menyimpan dependency repository untuk seluruh operasi attendance.
    constructor(repository: AttendanceRepository) {
        this.repository = repository;
    }

    setSelectedSummary(type: string, count: number) {
        this.selectedSummary = {
            type: type,
            count: count
        };
    }

    get attendanceSummary() {
        const present = this.totalsSummary.present;
        const absent = this.totalsSummary.absent;
        const incomplete = present.incomplete;

        return [
            {
                summaryType: "Present Summary",
                icon: ["fa-solid", "fa-fingerprint"],
                total: present.total,
                data: [
                    { status: "On Time", count: present.onTime, statusLabel: "ON_TIME" },
                    { status: "Late Clock In", count: present.late, statusLabel: "LATE" },
                    { status: "Early Leave", count: present.earlyLeave, statusLabel: "EARLY_LEAVE" },
                    { status: "Overtime", count: present.overTime, statusLabel: "OVER_TIME" },
                ],
            },
            {
                summaryType: "Not Present Summary",
                icon: ["fa-solid", "fa-seedling"],
                total: absent.total + incomplete.noCheckIn + incomplete.noCheckOut,
                data: [
                    { status: "Absent", count: absent.total, statusLabel: "ABSENT" },
                    { status: "No Clock In", count: incomplete.noCheckIn, statusLabel: "NO_CHECK_IN" },
                    { status: "No Clock Out", count: incomplete.noCheckOut, statusLabel: "NO_CHECK_OUT" },
                ],
            },
            {
                summaryType: "Away Summary",
                icon: ["fa-solid", "fa-plane-departure"],
                total: absent.timeOff + absent.dayOff,
                data: [
                    { status: "Day Off", count: absent.dayOff, statusLabel: "DAY_OFF" },
                    { status: "Time Off", count: absent.timeOff, statusLabel: "TIME_OFF" },
                ],
            },
        ];
    }

    // Menambahkan atau menghapus attendance tertentu dari daftar pilihan.
    toggleAttendanceSelection(attendance: DomainAttendance, checked: boolean) {
        const nextSelection = new Set(this.selectedAttendanceIds);
        if (checked) {
            nextSelection.add(attendance.uuid);
            this.selectedAttendanceCache.set(attendance.uuid, attendance);
        } else {
            nextSelection.delete(attendance.uuid);
            this.selectedAttendanceCache.delete(attendance.uuid);
        }
        this.selectedAttendanceIds = nextSelection;
    }

    // Mengembalikan data attendance yang sedang dipilih dengan memanfaatkan cache.
    getSelectedAttendances(): DomainAttendance[] {
        if (this.selectedAttendanceIds.size === 0) {
            return [];
        }

        const selections: DomainAttendance[] = [];
        this.selectedAttendanceIds.forEach((uuid) => {
            const cached = this.selectedAttendanceCache.get(uuid);
            if (cached) {
                selections.push(cached);
                return;
            }
            const fromList = this.attendanceList.find(
                (attendance) => attendance.uuid === uuid,
            );
            if (fromList) {
                this.selectedAttendanceCache.set(uuid, fromList);
                selections.push(fromList);
            }
        });
        return selections;
    }

    // Mengatur ulang seluruh state yang berhubungan dengan multi edit.
    resetMultiEditState() {
        this.multiEditQueue = [];
        this.multiEditActive = false;
        this.shouldAdvanceMultiEdit = false;
    }

    // Memulai proses multi edit berdasarkan attendance yang dipilih.
    startMultiEdit() {
        if (this.multiEditActive) return;
        const selections = this.getSelectedAttendances();
        if (selections.length === 0) {
            return;
        }
        this.selectionsAtt = selections;
        const [first, ...rest] = selections;
        this.multiEditQueue = rest;
        this.multiEditActive = true;
        this.shouldAdvanceMultiEdit = false;
        this.tbe = first;
    }

    // Memperbarui attendance yang disimpan dan mengelola alur multi edit.
    handleAttendanceSave(updated: DomainAttendance) {
        const index = this.attendanceList.findIndex(
            (attendance) => attendance.uuid === updated.uuid,
        );
        if (index !== -1) {
            this.attendanceList.splice(index, 1, updated);
        }
        if (this.selectedAttendanceIds.has(updated.uuid)) {
            this.selectedAttendanceCache.set(updated.uuid, updated);
        }

        if (this.multiEditActive && this.multiEditQueue.length > 0) {
            this.shouldAdvanceMultiEdit = true;
            return;
        }

        this.shouldAdvanceMultiEdit = false;
    }

    // Menghapus seluruh pilihan attendance yang aktif.
    clearSelection() {
        if (this.selectedAttendanceIds.size === 0) return;
        this.selectedAttendanceIds = new Set<string>();
        this.selectedAttendanceCache.clear();
    }

    // Menutup editor attendance dan menyiapkan item multi edit berikutnya jika ada.
    handleAttendanceClose() {
        if (this.multiEditActive && this.shouldAdvanceMultiEdit) {
            this.shouldAdvanceMultiEdit = false;
            const [next, ...rest] = this.multiEditQueue;
            this.multiEditQueue = rest;
            if (next) {
                nextTick(() => {
                    this.tbe = next;
                });
                return;
            }
        }

        if (this.multiEditActive) {
            this.resetMultiEditState();
            this.clearSelection();
        }

        this.selectionsAtt = [];
    }

    // Menyimpan alert terakhir dan refresh daftar bila perlu.
    handleAttendanceAlert(alert: ToastUI) {
        this.alerts = alert;
        if (alert.type === "success") {
            this.getList();
        }
    }

    // Membuka modal editor untuk attendance tunggal.
    openAttendanceEditor(attendance: DomainAttendance) {
        this.resetMultiEditState();
        this.selectionsAtt = [attendance];
    }

    // Menghapus pilihan untuk attendance tertentu.
    deselectAttendance(uuid?: string) {
        if (!uuid || !this.selectedAttendanceIds.has(uuid)) return;
        const nextSelection = new Set(this.selectedAttendanceIds);
        nextSelection.delete(uuid);
        this.selectedAttendanceIds = nextSelection;
        this.selectedAttendanceCache.delete(uuid);
    }

    // --- Progressive reveal config ---
    rowDelayMs = 60; // jeda antar row (ms) -> atur selera (30-120ms)
    rowsPerTick = 1; // berapa row ditambahkan tiap tick
    revealTimer: number | null = null;
    revealGen = 0; // untuk membatalkan reveal lama bila ada fetch baru

    // Menghentikan interval penyingkapan baris agar tidak double render.
    cancelReveal() {
        if (this.revealTimer) {
            clearInterval(this.revealTimer);
            this.revealTimer = null;
        }
    }

    // Menghapus attendance yang dipilih dan membersihkan state terkait.
    async deleteAttendance() {
        if (!this.tbd) {
            return;
        }
        const targetUuid = this.tbd.uuid;
        try {
            this.deleting = true;
            await this.repository.delete(this.tbd.uuid);
            this.alerts = new ToastUI("Successfully deleted", "success", 1500);
            this.deselectAttendance(targetUuid);
            this.multiEditQueue = this.multiEditQueue.filter(
                (attendance) => attendance.uuid !== targetUuid,
            );
            this.attendanceList = this.attendanceList.filter(
                (attendance) => attendance.uuid !== targetUuid,
            );
            this.tbd = null;
        } catch (error) {
            const err = handleErrors(error);
            this.alerts = new ToastUI(err.message, "error", 1500);
        } finally {
            this.deleting = false;
        }
    }

    // Menyelaraskan cache selection saat data attendance baru diterima.
    syncSelectionCache(attendance: DomainAttendance) {
        if (this.selectedAttendanceIds.has(attendance.uuid)) {
            this.selectedAttendanceCache.set(attendance.uuid, attendance);
        }
    }

    // Menambahkan data attendance secara bertahap demi efek skeleton.
    revealRows(newItems: DomainAttendance[], opts: { reset?: boolean } = {}) {
        const { reset = false } = opts;
        this.revealGen++;
        const myGen = this.revealGen;

        this.cancelReveal();
        if (reset) this.attendanceList = [];

        let i = 0;
        this.revealTimer = window.setInterval(() => {
            // jika ada fetch baru, hentikan loop lama
            if (myGen !== this.revealGen) {
                this.cancelReveal();
                return;
            }

            for (let k = 0; k < this.rowsPerTick && i < newItems.length; k++) {
                const nextItem = newItems[i++];
                this.attendanceList.push(nextItem);
                this.syncSelectionCache(nextItem);
            }
            if (i >= newItems.length) this.cancelReveal();
        }, this.rowDelayMs);
    }

    // Menjamin permintaan membutuhkan waktu minimum agar UX loading konsisten.
    async minDelay<T>(promise: Promise<T>, ms = 2000): Promise<T> {
        return Promise.all([
            promise,
            new Promise((r) => setTimeout(r, ms)),
        ]).then(([result]) => result);
    }

    // Mengubah kode status menjadi teks judul yang mudah dibaca.
    formatStatus = (status: string | null | undefined): string => {
        if (!status) return "-";
        return status
            .toLowerCase()
            .split(/[_\s-]+/)
            .map(
                (segment) => segment.charAt(0).toUpperCase() + segment.slice(1),
            )
            .join(" ");
    };
    // Mengambil daftar attendance berdasarkan search/date lalu menampilkan bertahap.
    async getList(options: { preserveSelection?: boolean } = {}) {
        const { preserveSelection = false } = options;
        if (!this.date) return;
        this.isLoading = true;
        this.cancelReveal(); // batalkan reveal lama jika ada
        this.resetMultiEditState();
        if (!preserveSelection) {
            this.clearSelection();
        }

        try {
            this.date instanceof Date && this.date.setHours(0, 0, 0, 0);

            const fetcher = this.repository.getAttendanceList({
                search: this.search,
                cursor: undefined, // reset saat search/date berubah
                date:
                    this.date instanceof Date
                        ? formatDate(this.date)
                        : undefined,
            });

            const [result, nextCursor] = await this.minDelay(fetcher, 1000);
            this.cursor = nextCursor;
            await this.getTotals();

            // MATIKAN skeleton dulu, baru tampilkan row satu per satu
            this.isLoading = false;
            this.revealRows(result, { reset: true });
        } catch (e) {
            this.isLoading = false;
            this.attendanceList = [];
            throw e;
        }

    }

    // Memuat halaman attendance berikutnya memakai cursor pagination.
    async getListWithCursor() {
        if (!this.cursor || this.isLoadingMore) return;
        this.isLoadingMore = true;

        try {
            const fetcher = this.repository.getAttendanceList({
                cursor: this.cursor,
                date:
                    this.date instanceof Date
                        ? formatDate(this.date)
                        : undefined,
            });

            const [result, nextCursor] = await this.minDelay(fetcher, 1000);
            this.cursor = nextCursor;

            // Tambahkan juga secara bertahap (append)
            this.revealRows(result, { reset: false });
        } finally {
            this.isLoadingMore = false;
        }
    }

    dots = ".";
    dotsTimer: number | undefined;

    // Mengurai chunk SSE mentah menjadi envelope event standar.
    parseSseChunk(chunk: string): SseEnvelope | null {
        const trimmed = chunk.trim();
        if (!trimmed) return null;

        const envelope: SseEnvelope = {};
        trimmed.split("\n").forEach((line) => {
            if (!line || line.startsWith(":")) return;
            const colon = line.indexOf(":");
            const field = colon === -1 ? line : line.slice(0, colon);
            const valueRaw = colon === -1 ? "" : line.slice(colon + 1);
            const value = valueRaw.startsWith(" ")
                ? valueRaw.slice(1)
                : valueRaw;

            switch (field) {
                case "event":
                    envelope.event = value;
                    break;
                case "data":
                    envelope.data = envelope.data
                        ? `${envelope.data}\n${value}`
                        : value;
                    break;
                case "id":
                    envelope.id = value;
                    break;
                case "retry":
                    envelope.retry = value;
                    break;
            }
        });
        return envelope;
    }
    // Mencoba mengubah payload SSE ke bentuk objek/JSON yang bisa diolah.
    resolveStreamPayload(raw: string): unknown {
        let current: unknown = raw;

        for (let depth = 0; depth < 3; depth += 1) {
            if (typeof current !== "string") {
                break;
            }

            const trimmed = current.trim();
            if (!trimmed) {
                return trimmed;
            }

            try {
                const parsed = JSON.parse(trimmed);
                if (parsed === current) {
                    break;
                }
                current = parsed;
            } catch {
                break;
            }
        }

        return current;
    }
    // Membaca stream SSE verifikasi dan memicu callback untuk tiap event.
    async consumeVerifyStream(
        stream: ReadableStream<Uint8Array>,
        onEvent: (evt: SseEnvelope) => void,
        {
            inactivityMs = this.verifyStreamConfig.inactivityMs,
            onTimeout,
        }: ConsumeVerifyStreamOptions = {},
    ) {
        const reader = stream.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let inactivityTimer: number | null = null;

        const clearTimer = () => {
            if (inactivityTimer !== null) {
                clearTimeout(inactivityTimer);
                inactivityTimer = null;
            }
        };

        const armTimer = () => {
            clearTimer();
            if (inactivityMs && inactivityMs > 0) {
                inactivityTimer = window.setTimeout(() => {
                    clearTimer();
                    void reader.cancel("verify-stream-timeout");
                    onTimeout?.();
                }, inactivityMs);
            }
        };

        armTimer();

        while (true) {
            const { value, done } = await reader.read();
            clearTimer();

            if (done) {
                if (buffer.trim()) {
                    buffer = buffer.replace(/\r\n/g, "\n");
                    buffer.split("\n\n").forEach((chunk) => {
                        const evt = this.parseSseChunk(chunk);
                        evt && onEvent(evt);
                    });
                }
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            buffer = buffer.replace(/\r\n/g, "\n");

            let boundary: number;
            while ((boundary = buffer.indexOf("\n\n")) !== -1) {
                const chunk = buffer.slice(0, boundary);
                buffer = buffer.slice(boundary + 2);
                const evt = this.parseSseChunk(chunk);
                evt && onEvent(evt);
            }

            armTimer();
        }

        clearTimer();
    }

    // Mengunggah file import untuk diverifikasi sebelum diproses sistem.
    async onVerifyAttendanceImport({ rawFiles }: ImportPayload) {
        if (!rawFiles.length) return;
        const file = rawFiles[0];

        // batalkan proses sebelumnya bila user memilih file baru

        this.isImporting = true;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await this.repository.verifyAttendance(file);

            if (!response.ok || !response.body) {
                throw new Error(`Verify gagal (status ${response.status})`);
            }

            this.getAttendanceWithSse();
        } catch (error) {
            if ((error as DOMException).name === "AbortError") return;
            console.error("Verify attendance error", error);
            this.alerts = new ToastUI(
                "Gagal memverifikasi presensi",
                "error",
                3000,
            );
        } finally {
            this.activeImportController = null;
        }
    }

    // Mengonsumsi stream SSE hasil verifikasi untuk memperbarui UI dan pesan.
    async getAttendanceWithSse() {
        this.activeImportController?.abort();

        const controller = new AbortController();
        this.activeImportController = controller;
        this.importMessages = [];
        this.isImporting = true;
        try {
            const response = await this.repository.getAttendanceSse(
                controller.signal,
            );

            if (!response.ok || !response.body) {
                throw new Error(`Verify gagal (status ${response.status})`);
            }
            let streamTimedOut = false;
            await this.consumeVerifyStream(
                response.body,
                (evt) => {
                    if (!evt?.data) {
                        if (evt?.event === "end") {
                            this.alerts = new ToastUI(
                                "Verifikasi selesai",
                                "success",
                                2500,
                            );
                        }
                        return;
                    }

                    const payload = this.resolveStreamPayload(evt.data);

                    if (
                        payload &&
                        typeof payload === "object" &&
                        !Array.isArray(payload)
                    ) {
                        const record = payload as Record<string, unknown>;
                        const rawAttendance = record.data;

                        if (
                            rawAttendance &&
                            typeof rawAttendance === "object"
                        ) {
                            const fresh = new DomainAttendance(
                                rawAttendance as Attendance,
                            );
                            const index = this.attendanceList.findIndex(
                                (a) => a.uuid === fresh.uuid,
                            );

                            if (index === -1) {
                                this.attendanceList.unshift(fresh);
                            } else {
                                const current = this.attendanceList[index];
                                const merged = new DomainAttendance({
                                    ...current,
                                    ...fresh,
                                    actual_check_in:
                                        fresh.actual_check_in ??
                                        current.actual_check_in,
                                    actual_check_out:
                                        fresh.actual_check_out ??
                                        current.actual_check_out,
                                    status: fresh.status ?? current.status,
                                    updated_at:
                                        fresh.updated_at ?? current.updated_at,
                                    date: fresh.date.getTime() ?? current.date,
                                } as Attendance);

                                this.attendanceList.splice(index, 1, merged);
                            }
                        }

                        if (
                            record.message !== undefined &&
                            record.message !== null
                        ) {
                            const message = String(record.message).trim();
                            message && this.importMessages.push(message);
                        }
                    } else if (payload !== undefined && payload !== null) {
                        const fallbackMessage = String(payload).trim();
                        fallbackMessage &&
                            this.importMessages.push(fallbackMessage);
                    }

                    if (evt.event === "end") {
                        this.alerts = new ToastUI(
                            "Verifikasi selesai",
                            "success",
                            2500,
                        );
                    }
                },
                {
                    inactivityMs: this.verifyStreamConfig.inactivityMs,
                    onTimeout: () => {
                        if (streamTimedOut) return;
                        streamTimedOut = true;
                        this.alerts = new ToastUI(
                            this.verifyStreamConfig.timeoutToast.message,
                            this.verifyStreamConfig.timeoutToast.type,
                            this.verifyStreamConfig.timeoutToast.duration,
                        );
                        controller.abort();
                    },
                },
            );
        } catch (error) {
            if ((error as DOMException).name === "AbortError") return;
            console.error("Verify attendance error", error);
            this.alerts = new ToastUI(
                "Gagal memverifikasi presensi",
                "error",
                3000,
            );
            this.isImporting = false;
            this.activeImportController = null;
        } finally {
            this.isImporting = false;
            this.activeImportController = null;
            this.showImportPanel = false;
        }
    }

    async getTotals() {
        const response = await this.repository.getTotals({
            date:
                this.date instanceof Date
                    ? formatDate(this.date)
                    : undefined,
        });
        this.totalsSummary = response;
    }

    summaryEmployeeCursor: string | undefined;
    summaryEmployeeList: DomainEmployeeSummary[] = [];

    async getEmployeeSummary() {
        this.summaryLoading = true;
        this.summaryLoadingMore = false;
        this.summaryEmployeeList = [];
        this.summaryEmployeeCursor = undefined;
        try {
            const fetcher = this.repository.getEmployeeSummary({
                date:
                    this.date instanceof Date
                        ? formatDate(this.date)
                        : undefined,
                category: this.selectedSummary
                    ? this.selectedSummary.type
                    : undefined,
            });
            const [response, nextCursor] = await this.minDelay(fetcher, 800);
            this.summaryEmployeeList = response;
            this.summaryEmployeeCursor = nextCursor;
        } finally {
            this.summaryLoading = false;
        }
    }

    async getEmployeeSummaryWithCursor() {
        if (
            !this.summaryEmployeeCursor ||
            this.summaryLoading ||
            this.summaryLoadingMore
        )
            return;
        this.summaryLoadingMore = true;
        try {
            const fetcher = this.repository.getEmployeeSummary({
                cursor: this.summaryEmployeeCursor,
                date:
                    this.date instanceof Date
                        ? formatDate(this.date)
                        : undefined,
                category: this.selectedSummary
                    ? this.selectedSummary.type
                    : undefined,
            });
            const [response, nextCursor] = await this.minDelay(fetcher, 600);
            this.summaryEmployeeList = this.summaryEmployeeList.concat(response);
            this.summaryEmployeeCursor = nextCursor;
        } finally {
            this.summaryLoadingMore = false;
        }
    }
}


injected(AttendanceViewModel, TOKENS.attendanceRepository);
