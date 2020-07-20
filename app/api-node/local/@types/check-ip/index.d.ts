declare module "check-ip" {
    interface Address {
        originalIp: string;
        boiledIp: string;
        isValid: boolean;
        isBogon: boolean;
        isApipa: boolean;
        isMulticast: boolean;
        isRfc1918: boolean;
        isPublicIp: boolean;
    }

    function checkIp(str: string): Address
}
