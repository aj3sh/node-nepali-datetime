export default interface NepaliDate {
    setDateObject: (date: Date) => void
    set: (
        year: number,
        month: number,
        date: number,
        hour: number,
        minute: number,
        second: number,
        ms: number
    ) => void
    getYear: () => number
    getMonth: () => number
    getDate: () => number
    getDay: () => number
    getHours: () => number
    getMinutes: () => number
    getSeconds: () => number
    getMilliseconds: () => number
}
