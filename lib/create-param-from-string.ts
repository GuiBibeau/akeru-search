/**
 * Converts a search prompt string into a URL-friendly parameter string.
 * - Converts to lowercase
 * - Trims whitespace
 * - Removes special characters except letters, numbers, spaces, and hyphens
 * - Replaces spaces with single hyphens
 *
 * @param searchPrompt - The original search string to convert
 * @returns A URL-friendly parameter string
 * @example
 * createParamFromString("Hello World!") // returns "hello-world"
 */
export function createParamFromString(searchPrompt: string): string {
  return searchPrompt
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Converts a URL parameter string back into a readable title-cased string.
 * - Replaces hyphens with spaces
 * - Capitalizes the first letter of each word
 *
 * @param param - The URL parameter string to convert
 * @returns A readable title-cased string
 * @example
 * createStringFromParam("hello-world") // returns "Hello World"
 */
export function createStringFromParam(param: string): string {
  return param
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
