export function trimWords(str: string, numWords: number) {
    // Regex is created once before iteration, to preserve its state between iterations.
    // It matches any number of whitespace characters or the end of the line
    const regex = /(\s+|$)/g;
    let match: RegExpExecArray | null;
    let num = 0;
    let cursor = 0;
    let result = "";

    while ((match = regex.exec(str)) !== null && num <= numWords) {
        const rightIndex = match.index + match[1].length;
        result += str.substr(cursor, rightIndex - cursor);
        cursor = rightIndex;
        num++;
    }

    if (cursor < str.length) {
        result += " ...";
    }

    return result;
}
