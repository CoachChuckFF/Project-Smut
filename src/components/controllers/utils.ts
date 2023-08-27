export function truncateMarkdownToWords(markdown: string, wordLimit: number): string {
    // Use regular expression to match words
    const words = markdown.match(/\b(\w+)\b/g);

    // If no words are found or the word count is less than or equal to the wordLimit, return original markdown
    if (!words || words.length <= wordLimit) {
        return markdown;
    }

    // Truncate the words array to the specified limit
    const truncatedWords = words.slice(0, wordLimit);

    // Find the index in the original string where the truncated version ends
    const endIndex = markdown.indexOf(truncatedWords[truncatedWords.length - 1]) + truncatedWords[truncatedWords.length - 1].length;

    return markdown.substring(0, endIndex) + '...';  // Return the truncated markdown with an ellipsis
}