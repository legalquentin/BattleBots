export default interface RawDataMessage {
    dv: number|string;
    dt: number;
}

export enum MessagesTypesEnum {
    ALERT_LIMIT = 10,
    ENERGY = 1,
    THERMAL = 2,
    LIFE = 3,
    END_OF_GAME = -1,
}

export enum NotifTypesEnum {
    ERROR = 10,
    INFO = 11,
    SUCCESS = 12,
    WARN = 13
}

