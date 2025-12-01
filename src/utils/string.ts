/**
 * Utility functions for string manipulation
 */

/**
 * Unescapes common HTML/JSON escaped characters in item names
 * @param str - The string to unescape (can be undefined)
 * @returns The unescaped string or empty string if undefined
 */
export const unescapeItemName = (str: string | undefined): string => {
    if (!str) return str || '';

    return str
        .replace(/\\"/g, '"')  // Unescape double quotes
        .replace(/\\'/g, "'")  // Unescape single quotes
        .replace(/\\\\/g, '\\') // Unescape backslashes
        .replace(/\\n/g, '\n')  // Unescape newlines
        .replace(/\\t/g, '\t')  // Unescape tabs
        .replace(/\\r/g, '\r'); // Unescape carriage returns
};