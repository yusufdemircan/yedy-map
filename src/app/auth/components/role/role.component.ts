import { Component } from '@angular/core';
import {RoleModel} from "../../model/role.model";
import {ActivatedRoute} from "@angular/router";
import {RoleService} from "../../service/role.service";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {
    roleList: RoleModel[] = [];
    supplierId:number=-1;
    selectedRole:any=null;

    loading: boolean = false;
    constructor(
        private activatedRoute: ActivatedRoute,
        private roleService: RoleService) { }

    ngOnInit() {
        this.findRoles();
    }

    findRoles(){
        console.log(this.loading);
        this.loading =true;
        this.roleService.findRoles().subscribe(result=>{
            this.roleList=result;
        },error=>{

        },()=>{
            console.log(this.loading);
            this.loading =false;
        });
    }

    addNewRole() {
        this.roleList.unshift(new RoleModel(1));
    }

    changeRole(roleModel: RoleModel, field?:string) {
        roleModel.rev=2;
    }

    deleteRole(roleModel: RoleModel) {
        if(roleModel.id==null){
            this.roleList = this.roleList.filter(
                (item) => item !== roleModel
            );
        }else{
            roleModel.rev=3;
        }
    }

    saveRoles(){
        this.roleService.saveRoles({ roles: this.roleList.filter((item) => item.rev !== null)}).subscribe(result=>{

            this.findRoles();
        },error=>{

        });
    }
}
