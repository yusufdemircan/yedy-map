import {Component, OnInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import {OSM} from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Draw} from "ol/interaction";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    public selectedDrop: any = 'None';
    public map!: Map
    public draw!: Draw
    public raster = new TileLayer({
        source: new OSM(),
    });
    public source = new VectorSource({wrapX: true});
    public vector = new VectorLayer({
        source: this.source,
    });

    ngOnInit(): void {
        this.map = new Map({
            layers: [this.raster, this.vector],
            target: 'map',
            view: new View({
                center: [34.83210051682406, 39.95222973768039],
                zoom: 6,
                maxZoom: 18,
                projection: 'EPSG:4326'
            }),
        });
        this.addInteraction();
    }

    addInteraction() {
        if (this.selectedDrop !== 'None' && this.selectedDrop!==null) {
            this.draw = new Draw({
                source: this.source,
                type: this.selectedDrop
            });
            this.map.addInteraction(this.draw);
        }
    }

    changeDrop() {
        this.map.removeInteraction(this.draw);
        this.addInteraction();
    }

    undoLastDraw(){
        console.log("remove")
        this.draw.removeLastPoint()
    }
}
