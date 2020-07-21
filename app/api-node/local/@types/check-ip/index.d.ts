export interface Address {
        originalIp: string;
        boiledIp: string;
        isValid: boolean;
        isBogon: boolean;
        isApipa: boolean;
        isMulticast: boolean;
        isRfc1918: boolean;
        isPublicIp: boolean;
}

export function checkIp(str: string): Address;
