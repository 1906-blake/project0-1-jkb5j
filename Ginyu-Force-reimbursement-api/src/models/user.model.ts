import Role from './role.model';

export default class User {
    constructor(
       public userId: number,
       public username: string,
       public password: string,
       public firstName: string,
       public lastName: string,
       public email: string,
       public role: Role
    ) { }
}