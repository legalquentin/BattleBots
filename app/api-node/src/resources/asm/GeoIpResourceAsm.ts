import { GeoIpResourceModel } from "../GeoIpResourceRaw";
import { GeoIpEntity } from "../../database/entities/GeoIpEntity";
import { Singleton } from "typescript-ioc";

@Singleton
export class GeoIpResourceAsm {
    toEntity(resource: GeoIpResourceModel){
        const geoip = new GeoIpEntity();
        
        geoip.city = resource.city;
        geoip.country = resource.country;
        geoip.latitude = resource.ll[0];
        geoip.longitude = resource.ll[1];
        geoip.timezone = resource.timezeone;
        return (geoip);
    }
}