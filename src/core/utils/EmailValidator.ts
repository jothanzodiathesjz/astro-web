export function isValidEmail(email: string) {
    // Regex untuk memeriksa format email.
    // Pola ini cukup kuat untuk sebagian besar kasus.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Mengembalikan true jika email cocok dengan pola,
    // dan false jika tidak.
    return emailRegex.test(email);
}