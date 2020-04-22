export default abstract class IConfig {
    protected salt: string;
    protected secret: string;

    abstract genSalt(): string;
    abstract getSecret(): string;
};
