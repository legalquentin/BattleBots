export default abstract class IConfig {
    salt = 10;
    secret = "azerty123";

    abstract genSalt();
    abstract getSecret();
};
