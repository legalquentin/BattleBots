import { ConnectedUserService } from "../ConnectedUserService";
import { Inject } from "typescript-ioc";
import { ConnectedUserRepository } from "../../database/repositories/ConnectedUserRepository";
import { UserRepository } from "../../database/repositories/UserRepository";
import { ConnectedUserEntity } from "../../database/entities/ConnectedUserEntity";
import IConfig from "../IConfig";
import { UserResourceAsm } from "../../resources/asm/UserResourceAsm";
import HttpResponseModel from "../../resources/HttpResponseModel";
import IUserResource from "../../resources/IUserResource";
import { GeoIpService } from "../GeoIpService";
import { GeoIpUserRepository } from "../../database/repositories/GeoIpUserRepository";
import { GeoIpUserEntity } from "../../database/entities/GeoipUserEntity";
import { ConnectedUserGeoipRepository } from "../../database/repositories/ConnectedUserGeoipRepository";
import { ConnectedUserGeoipEntity } from "../../database/entities/ConnectedUserGeoipEntity";
import { ConnectedUserResource } from "../../resources/ConnectedUserResource";
import { ConnectedUserResourceAsm } from "../../resources/asm/ConnectedUserResourceAsm";

export class ConnectedUserServiceImpl extends ConnectedUserService {

    @Inject
    connectedUserRepository: ConnectedUserRepository;

    @Inject
    userRepository: UserRepository;

    @Inject
    config: IConfig;

    @Inject
    userResourceAsm: UserResourceAsm;

    @Inject
    geoIpService: GeoIpService;

    @Inject
    geoipUserRepository: GeoIpUserRepository;

    @Inject
    geoIpConnectedUserRepository: ConnectedUserGeoipRepository;

    @Inject
    connectedUserAsm: ConnectedUserResourceAsm;

    constructor(){
        super();
    }

    async linkPosition(userId: number, ipAddress: string) {
        const user = await this.userRepository.findOne(userId);
        if (ipAddress == this.config.getLocalAddress()){
            const response : HttpResponseModel<IUserResource> = {
                httpCode: 400,
                message: "request from localhost"
            };

            return (response);
        }
        const geoip = await this.geoIpService.findByIp(ipAddress);
        const connectedUserLatest = await this.connectedUserRepository.getLatested(user.id);
        let flagGeoIpUser = false;

        let geoipUsers = await this.geoipUserRepository.findByUser(user.id);
        if (!geoipUsers){
            geoipUsers = [];
        }
        for (let geoipUser of geoipUsers){
            if (geoip.ip == geoipUser.geoip.ip){
                flagGeoIpUser = true;
            }
        }
        if (!flagGeoIpUser){
            const geoIpUser = new GeoIpUserEntity();

            geoIpUser.geoip = geoip;
            geoIpUser.user = user;
            await this.geoipUserRepository.save(geoIpUser);
        }
        if (connectedUserLatest && (connectedUserLatest.endConnected.getTime() > (new Date().getTime()))){
            let geoipConnectedUsers = await this.geoIpConnectedUserRepository.findByConnectedUser(connectedUserLatest.id);
            let conn = false;
            if (!geoipConnectedUsers){
                geoipConnectedUsers = [];
            }
            for (let geoipConnectedUser of geoipConnectedUsers){
                if (geoipConnectedUser.geoip.ip == geoip.ip){
                    conn = true;
                }
            }
            if (!conn){
                const geoipConn = new ConnectedUserGeoipEntity();

                geoipConn.geoip = geoip;
                geoipConn.connectedUser = connectedUserLatest;
                await this.geoIpConnectedUserRepository.save(geoipConn);
            }
        }
        const response: HttpResponseModel<IUserResource> = {
            httpCode: 200,
            message: "position updated"
        };

        return (response);
    }

    async login(userId: number) {
        const connectedUserLatest = await this.connectedUserRepository.getLatested(userId);

        if (connectedUserLatest != null && 
            (connectedUserLatest.endConnected.getTime() > new Date().getTime())){
                const step = parseInt(this.config.getExpirationTime(), 10) * 1000; 
                const endTime = connectedUserLatest.endConnected.getTime() + step;

                connectedUserLatest.endConnected = new Date(endTime);
                await this.connectedUserRepository.update(connectedUserLatest.id, connectedUserLatest);
                return (connectedUserLatest);
        }
        else {
            const user = await this.userRepository.findOne(userId);
            const connectedUser = new ConnectedUserEntity();
            
            connectedUser.startConnected = new Date();
            connectedUser.user = user;
            const startTime = connectedUser.startConnected.getTime();
            const step = parseInt(this.config.getExpirationTime(), 10) * 1000;
            const endTime = startTime + step;
            connectedUser.endConnected = new Date(endTime);
            return await this.connectedUserRepository.save(connectedUser);
        }
    }

    async logout(userId: number) {
        const connectedUser = await this.connectedUserRepository.getLatested(userId);
  
        if (!connectedUser){
            return (false);
        }
        connectedUser.endConnected = new Date();
        await this.connectedUserRepository.update(connectedUser.id, connectedUser);
        return (true);
    }

    async getConnected(){
        const connected = await this.connectedUserRepository.getConnected();
        const users = connected.map(conn => conn.user);
        const resources = await this.userResourceAsm.toResources(users);
        const response: HttpResponseModel<Array<IUserResource>> = {
            httpCode: 200,
            data: resources,
            message: "get connected users"
        };

        return (response);
    }

    async getDisconnected(){
        const disconnected = await this.connectedUserRepository.getDisconnected();
        const users = disconnected.map(conn => conn.user);
        const resources = await this.userResourceAsm.toResources(users);
        const response: HttpResponseModel<Array<IUserResource>> = {
            httpCode: 200,
            data: resources,
            message: "get diconnected users"
        };

        return (response);
    }

    async getAll(){
        const users_connected = await this.connectedUserRepository.getAll();
        const users = users_connected.map(uc => uc.user);
        const resources = await this.userResourceAsm.toResources(users);
        const response: HttpResponseModel<Array<IUserResource>> = {
            httpCode: 200,
            data: resources,
            message: "get all users"
        };

        return (response);
    }
    
    async refreshLogin(userId: number) {
        const connectedUser = await this.connectedUserRepository.getLatested(userId);
        const endTime = connectedUser.endConnected.getTime();
        const step = parseInt(this.config.getExpirationTime(), 10) * 1000;
        connectedUser.endConnected = new Date(endTime + step);
        await this.connectedUserRepository.update(connectedUser.id, connectedUser);
        return (true)
    }

    async getLatest(userId: number) {
        try {
            const conn = await this.connectedUserRepository.getLatested(userId);
            const response: HttpResponseModel<ConnectedUserResource> = {
                data: await this.connectedUserAsm.toResource(conn),
                httpCode: 200,
                message: "get latest"
            };

            return (response);
        }
        catch (e){
            const response: HttpResponseModel<ConnectedUserResource> = {
                httpCode: 400,
                message: "bad request"
            };

            return (response);
        }
    }
}