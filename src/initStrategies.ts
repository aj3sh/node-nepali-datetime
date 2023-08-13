import { parse, parseFormat } from './parse'
import NepaliDate from './NepaliDate.types'

/* Nepali Date initialization strategies */

/**
 * Interface for a type that constructs an initialization strategy
 */
interface InitStrategyType {
    new (nepaliDate: NepaliDate, args: any[]): InitStrategy

    /**
     * Checks if the arguments match this strategy.
     *
     * @param args - The arguments to match with the strategy.
     * @returns {boolean} Returns true if matches.
     */
    matchesArgs: (args: any[]) => boolean
}

/**
 * Interface for an initialization strategy
 */
export interface InitStrategy {
    /**
     * Executes the strategies
     * @returns void
     */
    executeStrategy: () => void
}

class NoArgsInitStrategy implements InitStrategy {
    constructor(
        private nepaliDate: NepaliDate,
        private args: any[]
    ) {}

    executeStrategy() {
        this.nepaliDate.setDateObject(new Date())
    }

    static matchesArgs(args: any[]): boolean {
        return args.length === 0
    }
}

class DateInitStrategy implements InitStrategy {
    constructor(
        private nepaliDate: NepaliDate,
        private args: any[]
    ) {}

    executeStrategy() {
        this.nepaliDate.setDateObject(this.args[0] as Date)
    }

    static matchesArgs(args: any[]): boolean {
        return (
            args.length === 1 && typeof args[0] === 'object' && args[0] instanceof Date
        )
    }
}

class NepaliDateInitStrategy implements InitStrategy {
    constructor(
        private nepaliDate: NepaliDate,
        private args: any[]
    ) {}

    executeStrategy() {
        const nepaliDateArg = this.args[0] as NepaliDate
        const { year, month, day, hour, minute, second, ms } =
            this.extractDateComponents(nepaliDateArg)
        this.nepaliDate.set(year, month, day, hour, minute, second, ms)
    }

    private extractDateComponents(nepaliDateArg: NepaliDate) {
        return {
            year: nepaliDateArg.getYear(),
            month: nepaliDateArg.getMonth(),
            day: nepaliDateArg.getDate(),
            hour: nepaliDateArg.getHours(),
            minute: nepaliDateArg.getMinutes(),
            second: nepaliDateArg.getSeconds(),
            ms: nepaliDateArg.getMilliseconds(),
        }
    }

    static matchesArgs(args: any[]): boolean {
        return (
            args.length === 1 &&
            typeof args[0] === 'object' &&
            args[0]?.constructor.name === 'NepaliDate' && // checking if class name is 'NepaliDate'
            typeof args[0].set === 'function' // checking if object has 'NepaliDate' method
        )
    }
}

class NumberInitStrategy implements InitStrategy {
    constructor(
        private nepaliDate: NepaliDate,
        private args: any[]
    ) {}

    executeStrategy() {
        this.nepaliDate.setDateObject(new Date(this.args[0] as number))
    }

    static matchesArgs(args: any[]): boolean {
        return args.length === 1 && typeof args[0] === 'number'
    }
}

class DateStringInitStrategy implements InitStrategy {
    constructor(
        private nepaliDate: NepaliDate,
        private args: any[]
    ) {}

    executeStrategy() {
        const dateTimeString = this.args[0] as string
        const [year, month, day, hour, minute, second, ms] = parse(dateTimeString)
        this.nepaliDate.set(year, month, day, hour, minute, second, ms)
    }

    static matchesArgs(args: any[]): boolean {
        return args.length === 1 && typeof args[0] === 'string'
    }
}

class FormatStringInitStrategy implements InitStrategy {
    constructor(
        private nepaliDate: NepaliDate,
        private args: any[]
    ) {}

    executeStrategy() {
        const [dateTimeString, format] = this.args as [string, string]
        const [year, month, day, hour, minute, second, ms] = parseFormat(
            dateTimeString,
            format
        )
        this.nepaliDate.set(year, month, day, hour, minute, second, ms)
    }

    static matchesArgs(args: any[]): boolean {
        return (
            args.length === 2 &&
            typeof args[0] === 'string' &&
            typeof args[1] === 'string'
        )
    }
}

class DateComponentsInitStrategy implements InitStrategy {
    constructor(
        private nepaliDate: NepaliDate,
        private args: any[]
    ) {}

    executeStrategy() {
        this.nepaliDate.set(
            this.args[0] as number, // year
            this.args[1] as number, // month
            (this.args[2] as number) ?? 1, // day
            (this.args[3] as number) ?? 0, // hour
            (this.args[4] as number) ?? 0, // minute
            (this.args[5] as number) ?? 0, // second
            (this.args[6] as number) ?? 0 // ms
        )
    }

    static matchesArgs(args: any[]): boolean {
        if (args.length > 1 && args.length <= 7) {
            return args.every(arg => typeof arg === 'number')
        }
        return false
    }
}

/* STRATEGY FACTORY */

const STRATEGY_CLASSES: InitStrategyType[] = [
    NoArgsInitStrategy,
    DateInitStrategy,
    NepaliDateInitStrategy,
    NumberInitStrategy,
    DateStringInitStrategy,
    FormatStringInitStrategy,
    DateComponentsInitStrategy,
]

/**
 * Returns the strategy class that matches the given arguments.
 *
 * @param args The initialization arguments.
 * @returns The matching strategy class or null if none match.
 */
export const getStrategyClass = (args: any[]): InitStrategyType | null => {
    return STRATEGY_CLASSES.find(strategyClass => strategyClass.matchesArgs(args))
}
