import {Component, OnInit} from '@angular/core';
import {CustomMap} from "../models/CustomMap";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import {Feature} from "ol";
import {Polygon} from "ol/geom";
import EsriJSON from "ol/format/EsriJSON";
import {Fill, Stroke, Style} from "ol/style";
import {XYZ} from "ol/source";
import TileLayer from "ol/layer/Tile";
import {fromLonLat} from "ol/proj";
import View from "ol/View";
import {createXYZ} from "ol/tilegrid";
import TileGrid from "ol/tilegrid/TileGrid";
import {tile as tileStrategy} from 'ol/loadingstrategy.js';
import {Layer} from "ol/layer";
import {Attribution} from "ol/control";
@Component({
  selector: 'app-test-map',
  templateUrl: './test-map.component.html',
  styleUrls: ['./test-map.component.scss']
})
export class TestMapComponent implements OnInit{
    map!: CustomMap;

    ngOnInit(): void {
        this.map = new CustomMap();



        this.map.getMap().setView(
            new View({
                center: [31.96141091291871,40.738509417720984],
                zoom: 14,
                maxZoom: 18,
                projection: 'EPSG:4326',
            }),
        )

        const raster = new TileLayer({
            source: new XYZ({
                attributions:
                    'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                    'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                url:
                    'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                    'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            }),
        });
        //this.map.getMap().addLayer(raster)
        //this.map.getMap().addLayer(ogmLayer2)
        //this.map.getMap().addLayer(ogmLayer)

        const that=this;
       /* const displayFeatureInfo = function (pixel:any) {
            const feature = that.map.getMap().forEachFeatureAtPixel(pixel, function (feature:any) {
                return feature;
            });
            if (feature) {

            } else {
            }
        };
        this.map.getMap().on(['click', 'pointermove'], function (evt:any) {
            if (evt.dragging) {
                return;
            }
            displayFeatureInfo(evt.pixel);
        });*/

    }
}
