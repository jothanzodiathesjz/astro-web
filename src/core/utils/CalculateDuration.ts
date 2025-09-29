export function calculateDuration(schedule_in: string, schedule_out: string): string {
    const [inHours, inMinutes] = schedule_in.split(":").map(Number);
    const [outHours, outMinutes] = schedule_out.split(":").map(Number);

    // buat objek Date
    const start = new Date();
    start.setHours(inHours, inMinutes, 0, 0);

    const end = new Date();
    end.setHours(outHours, outMinutes, 0, 0);

    // hitung selisih dalam menit
    let diff = (end.getTime() - start.getTime()) / 1000 / 60;

    // kalau jadwal bisa lewat tengah malam (contoh in=22:00, out=02:00)
    if (diff < 0) {
        diff += 24 * 60; // tambah 24 jam
    }

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}h ${minutes}m`;
}