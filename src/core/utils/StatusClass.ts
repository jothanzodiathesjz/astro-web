export const statusClassMap: Record<string, string> = {
    pending:
        "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-200",
    present:
        "border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-200",
    late: "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-600 dark:bg-orange-900/30 dark:text-orange-200",
    leave: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-200",
    absent: "border-red-300 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-900/30 dark:text-red-200",
    holiday:
        "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-600 dark:bg-purple-900/30 dark:text-purple-200",
    default:
        "border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-800/60 dark:text-gray-300",
};

export const getStatusClass = (status: string | null | undefined): string => {
    const key = status?.toLowerCase() ?? "";
    return statusClassMap[key] ?? statusClassMap.default;
};

export const formatStatus = (status: string | null | undefined): string => {
    if (!status) return "-";
    return status
        .toLowerCase()
        .split(/[_\s-]+/)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
};
