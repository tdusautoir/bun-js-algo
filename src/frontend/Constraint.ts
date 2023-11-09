import { Variable } from './Variable'

export function isDifferent(a: Variable<any>, b: Variable<any>): boolean {
    return a.value !== b.value
}

export function isSame(a: Variable<any>, b: Variable<any>): boolean {
    return a.value === b.value
}

export function isSet(a: Variable<any>): boolean {
    return typeof a.value !== "undefined"
}

export function isUnset(a: Variable<any>): boolean {
    return typeof a.value === "undefined"
}