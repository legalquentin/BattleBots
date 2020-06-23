import { GeoIpResourceModel } from "../GeoIpResourceRaw";
import { GeoIpEntity } from "../../database/entities/GeoIpEntity";
import { Singleton } from "typescript-ioc";
import { IGeoIpResource } from "../IGeoIpResource";

@Singleton
export class GeoIpResourceAsm {


    toEntity(resource: GeoIpResourceModel){
        const geoip = new GeoIpEntity();
        
        geoip.city = resource.city;
        geoip.country = resource.country;
        geoip.latitude = resource.ll[0];
        geoip.longitude = resource.ll[1];
        geoip.timezone = resource.timezone;
        return (geoip);
    }

    async toResource(geoip: GeoIpEntity){
        const resource = new IGeoIpResource();

        resource.city = geoip.city;
        resource.country = geoip.country;
        resource.ip = geoip.ip;
        resource.latitude = geoip.latitude;
        resource.longitude = geoip.longitude;
        resource.timezone = geoip.timezone;
        return (resource);
    }

    async toResources(list: Array<GeoIpEntity>){
        const resources = [];

        for (let geoip of list){
            resources.push(await this.toResource(geoip));
        }
        return (resources);
    }
}