export default class Config {
    salt = 10;
    secret = "azerty123";

    genSalt(){
        return (Math.random() % this.salt);
    }

    getSecret(){
        return (this.secret);
    }
};