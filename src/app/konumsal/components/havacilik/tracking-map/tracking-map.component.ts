import {Component, OnInit} from '@angular/core';
import {CustomMap} from "../../../map/models/CustomMap";

@Component({
  selector: 'app-tracking-map',
  templateUrl: './tracking-map.component.html',
  styleUrls: ['./tracking-map.component.scss']
})
export class TrackingMapComponent implements OnInit{
    map!:CustomMap;

    ngOnInit(): void {
        this.map = new CustomMap();
    }

}
