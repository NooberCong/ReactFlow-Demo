interface Activity {
    name: string,
    isVisited: boolean,
    isCurrent: boolean
}

interface Transition {
    from: string,
    to: string
}

interface ProcessInstanceDetails {
    activities: Activity[],
    transitions: Transition[]
}

interface APIResult<T> {
    result: T
}

export type {Activity, Transition, ProcessInstanceDetails, APIResult}