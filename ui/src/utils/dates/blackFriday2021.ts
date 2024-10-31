export function isBlackFriday2021() {
    const now = new Date()

    if (now.getFullYear() !== 2021 || now.getMonth() !== 10) {
        return false
    }

    const date = now.getDate()

    return date >= 22 && date <= 29
}
