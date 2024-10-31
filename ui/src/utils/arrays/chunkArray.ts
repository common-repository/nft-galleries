/**
 * Splits an array into chunks.
 *
 * @param subject The array to split.
 * @param chunkSize The size of each chunk.
 * @param pad If true, the last chunk will be padded with null values to ensure its size is equal to the chunkSize.
 */
export function chunkArray<T>(subject: Array<T>, chunkSize: number, pad: boolean = false): T[][] {
    if (subject.length < 2) {
        return [subject];
    }

    const chunks: T[][] = [];
    let chunk = 0;

    subject.forEach(item => {
        if (!Array.isArray(chunks[chunk])) {
            chunks[chunk] = [item];
        } else {
            chunks[chunk].push(item);
        }

        if (chunks[chunk].length >= chunkSize) {
            chunk++;
        }
    });

    if (pad) {
        const lastChunk = chunks.length - 1;
        const lastChunkSize = chunks[lastChunk].length;
        const numMissing = chunkSize - lastChunkSize;

        for (let i = 0; i < numMissing; ++i) {
            chunks[lastChunk].push(null);
        }
    }

    return chunks;
}
