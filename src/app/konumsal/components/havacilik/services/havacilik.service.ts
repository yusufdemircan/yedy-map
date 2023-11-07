import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {endPoints} from "../havacilik-config/server-config";
import {environment} from "../../../config/konumsal-config";

@Injectable({
    providedIn: 'root'
})
export class HavacilikService {
    headers= new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization','Basic YWRtaW46YWRtaW4=')
        .set('Access-Control-Allow-Origin', '*')
        .set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
        .set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept');

    constructor(private http: HttpClient) {
    }

    getWaterCollectionPit() {
        return this.http.get<any>(environment.serverUrl + endPoints.havaAraci + '/suToplamaCukuru', {headers:this.headers});
    }

    getActiveAirVehicles(){
        return this.http.get<any>(environment.serverUrl + endPoints.havaAraci + '/aktifHavaAraci', {headers:this.headers});
    }
}
