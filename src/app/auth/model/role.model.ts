export class RoleModel {

    id: number | undefined;
    roleName: string | undefined;
    rev: number | undefined;

    constructor(rev?: number) {
        this.rev = rev;
    }
}
