import {MenuModel} from "./menu.model";

export interface UserModel {
    id:number;
    username: string;
    email: string;
    name:string;
    roles:string[];
    menus:MenuModel[];

}
