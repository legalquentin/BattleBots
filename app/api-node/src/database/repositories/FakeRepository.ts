import { Repository } from "typeorm";

export class FakeRepository extends Repository<any> {

    constructor(){
        super();
    }

    saveOrUpdate(fake: any){
        return (fake);
    }

    async getLatested(fake: any){
        return (fake);
    }
}