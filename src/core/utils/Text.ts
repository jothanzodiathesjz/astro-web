export function capitalizeWords(text: string): string {
    return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


export function capitalize(text: string): string {
    if (!text) return "";
    const trimmed = text.toLowerCase().trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}


export function formatFeatureLabel(option: string) {
    return option
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}