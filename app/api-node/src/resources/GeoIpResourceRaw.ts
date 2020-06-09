export interface GeoIpResourceModel {
    range?: Array<string>;
    country?: string;
    region?: string;
    eu?: string;
    timezone?: string;
    city?: string;
    ll?: Array<number>;
    metro?: number;
    area?: number;
}

export interface GeoIpResourceRaw {
    data?: GeoIpResourceModel;
    ip?: string;
}
