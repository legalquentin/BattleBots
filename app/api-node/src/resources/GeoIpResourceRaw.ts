export interface GeoIpResourceModel {
    range?: Array<string>;
    country?: string;
    region?: string;
    eu?: string;
    timezeone?: string;
    city?: string;
    ll?: Array<number>;
    metro?: number;
    area?: number;
}

export interface GeoIpResourceRaw {
    data?: GeoIpResourceModel;
    ip?: string;
}
