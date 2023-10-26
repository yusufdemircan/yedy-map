import {Injectable} from '@angular/core';
import {CustomMap} from "../models/CustomMap";

@Injectable({
    providedIn: 'root'
})
export class MapService {
    constructor() {}

    getMap(){
        return new CustomMap();
    }
}
