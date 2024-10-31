/**
 * Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#2450976
 *
 * @param array
 */
export function shuffleArray<T>(array: Array<T>) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
