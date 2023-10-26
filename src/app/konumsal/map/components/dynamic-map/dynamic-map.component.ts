import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomMap} from "../../models/CustomMap";
import Map from "ol/Map";

@Component({
    selector: 'app-dynamic-map',
    templateUrl: './dynamic-map.component.html',
    styleUrls: ['./dynamic-map.component.scss']
})
export class DynamicMapComponent implements OnInit ,OnDestroy{

    map!: CustomMap;

    constructor() {

    }

    ngOnInit(): void {
        this.map = new CustomMap();
    }

    ngOnDestroy(): void {
    }

}
