/**
 * Mengambil objek Date dan mengembalikan string tanggal dalam format YYYY-MM-DD.
 *
 * @param date Objek Date yang akan diformat.
 * @returns String tanggal yang diformat (e.g., "2025-11-01").
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    // getMonth() mengembalikan 0 untuk Januari, jadi kita tambahkan 1.
    // Kemudian tambahkan padding '0' di depan.
    const month = String(date.getMonth() + 1).padStart(2, '0');
    // getDate() mengembalikan tanggal 1-31.
    // Kemudian tambahkan padding '0' di depan.
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}