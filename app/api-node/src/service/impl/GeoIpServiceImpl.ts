import { GeoIpService } from "../GeoIpService";
import { GeoIpEntity } from "../../database/entities/GeoIpEntity";
import { Singleton, Inject } from "typescript-ioc";
import { GeoIpRepository } from "../../database/repositories/GeoIpRepository";
import axios from "axios";
import IConfig from "../IConfig";
import { GeoIpResourceRaw } from "../../resources/GeoIpResourceRaw";
import { GeoIpResourceAsm } from "../../resources/asm/GeoIpResourceAsm";

@Singleton
export class GeoIpServiceImpl implements GeoIpService{

    @Inject
    repository: GeoIpRepository;

    @Inject
    config: IConfig;

    @Inject
    geoipresourceAsm: GeoIpResourceAsm;

    constructor(){
        
    }


    public async findByIp(ip: string): Promise<GeoIpEntity> {
        const geoip = await this.repository.findOne({
            where: {
                ip
            }
        });

        return (geoip);
    }

    public async delete(id: number) {
        return (await this.repository.delete(id));
    }

    public async getInfo(currentIp: string): Promise<GeoIpEntity> {
	    const response = await axios.get(`${this.config.getGeoIpService()}=${currentIp}`);
        if (response.status != 200){
            return null;
        }
        const geoipresourceRaw = response.data as GeoIpResourceRaw;
        const geoipresource = geoipresourceRaw.data;
	    const entity = this.geoipresourceAsm.toEntity(geoipresource);
	    entity.ip = currentIp;
	    const saved = await this.save(entity);
	    return (saved);
    }

    public async save(geoip: GeoIpEntity): Promise<GeoIpEntity> {
        try {
            const saved = await this.repository.save(geoip);

            return (saved);
        }
        catch (e){
            return (null);            
        }
    }
    public async update(geoip: GeoIpEntity): Promise<GeoIpEntity> {
        try {
            const finded = await this.repository.findOne(geoip.id);
            const saved = await this.repository.merge(finded, geoip);

            return (saved);
        }
        catch (e){
            return (null);            
        }
    }
    public list(): Promise<GeoIpEntity[]> {
        return (this.repository.createQueryBuilder("geoip").leftJoinAndSelect("geoip.user", "user").getMany());
    }

    public findOne(id: number): Promise<GeoIpEntity> {
        return (this.repository.findOne(id));
    }
}