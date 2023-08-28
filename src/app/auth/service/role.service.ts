import {Injectable} from "@angular/core";
import {HttpClient, HttpParams, HttpEvent, HttpRequest} from "@angular/common/http";
import {environment} from '../../../environments/environment';
import {Router} from "@angular/router";
import {RoleModel} from "../model/role.model";
import {Observable} from "rxjs";

@Injectable({
    providedIn: "root",
})
export class RoleService {
    readonly serviceUrl = environment.serviceUrl + "role/";

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
    }
    findRoles(): Observable<any[]> {
        return this.http.get<any[]>(this.serviceUrl + "roles/");
    }
    saveRoles(items: any): Observable<any[]> {
        return this.http.post<any>(this.serviceUrl + "saveCharges", items);
    }
}
