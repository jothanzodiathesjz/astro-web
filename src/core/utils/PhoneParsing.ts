import { type IPhoneUI, PhoneUI } from "../ui/Phone.ui";

/**
 * Mengonversi string nomor telepon mentah menjadi objek PhoneUI.
 * Fungsi ini mengidentifikasi kode negara dan nomor telepon dari berbagai format.
 *
 * @param {string} rawPhoneNumber - String nomor telepon mentah (contoh: "0821...", "+628...", atau "628...").
 * @returns {PhoneUI} Objek PhoneUI yang telah dimapping.
 */
export function mapToPhoneUI(rawPhoneNumber: string): PhoneUI {
    let number = rawPhoneNumber;
    let country_code = '62'; // Default kode negara tanpa '+'

    // Cek apakah nomor telepon dimulai dengan '+' (misal: +628...)
    if (rawPhoneNumber.startsWith('+')) {
        // Ambil kode negara (misal '62') dan hilangkan karakter '+'
        if (rawPhoneNumber.length >= 3) {
            country_code = rawPhoneNumber.substring(1, 3);
            number = rawPhoneNumber.substring(3); // Ambil sisanya sebagai nomor
        } else {
            console.warn(`Format nomor telepon tidak valid: ${rawPhoneNumber}`);
        }
    }
    // Cek apakah nomor telepon dimulai dengan '62' (misal: 628...)
    else if (rawPhoneNumber.startsWith('62')) {
        country_code = '62';
        number = rawPhoneNumber.substring(2); // Ambil sisanya setelah '62'
    }
    // Cek apakah nomor telepon dimulai dengan '0' (misal: 08...)
    else if (rawPhoneNumber.startsWith('0')) {
        country_code = '62';
        number = rawPhoneNumber.substring(1); // Ambil sisanya setelah '0'
    }

    // Buat objek IPhoneUI untuk constructor
    const phoneData: IPhoneUI = {
        number: number,
        country_code: country_code
    };

    return new PhoneUI(phoneData);
}
