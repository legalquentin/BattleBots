import { GeoIpEntity } from "../database/entities/GeoIpEntity";

export abstract class GeoIpService {
    public abstract save(geoip: GeoIpEntity): Promise<GeoIpEntity>;
    public abstract update(geoip: GeoIpEntity): Promise<GeoIpEntity>;
    public abstract list(): Promise<Array<GeoIpEntity>>;
    public abstract findOne(id: number): Promise<GeoIpEntity>;
    public abstract delete(id: number);
    public abstract getInfo(currentIp: string): Promise<GeoIpEntity>;
    public abstract findByIp(ip : string): Promise<GeoIpEntity>;
}
