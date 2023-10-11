import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {CustomMap} from "../../models/CustomMap";
import {SelectItemGroup} from "primeng/api";
import {mapSideBar, mapTopbar} from "../../consts/map-edit-tab-menu-item";
import Map from "ol/Map";
import {Overlay} from "ol";
import {toStringHDMS} from "ol/coordinate";
import {toLonLat} from "ol/proj";
import {Polygon} from "ol/geom";


interface Country {
    name: string,
    code: string
}

@Component({
    selector: 'konumsal-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
    @Input() map!: CustomMap;
    isVisibleLayers: boolean = false;
    items!: any;
    groupedCities!: SelectItemGroup[];
    selectedCountries!: Country[];
    container: any;
    content: any;
    closer: any;

    constructor() {
    }

    ngOnInit(): void {
        this.groupedCities = mapSideBar;
        this.items = mapTopbar;

        //TODO Overlay eklemek için yorum satırını kaldırın
        this.container = document.getElementById('popup');
        this.content = document.getElementById('popup-content');
        this.closer = document.getElementById('popup-closer');
        const overlay = new Overlay({
            element: this.container,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });
        this.map.getMap().addOverlay(overlay);
        const that = this;
        this.map.select.on('select', function (selected) {
            if(selected.selected.length>0){
                let attr:any = selected.selected[0]
                console.log(attr.values_)
                const polygon = selected.selected[0].getGeometry() as Polygon;
                console.log(polygon.getCoordinates())
                const coordinate = selected.mapBrowserEvent.coordinate;
                const hdms = toLonLat(coordinate, 'EPSG:4326');
                that.content.innerHTML='<h4>Seçilen Alan</h4>';
                for(let i in attr.values_){
                    if(i!=='geometry'){
                        console.log(i)
                        console.log(attr.values_[i])
                        that.content.innerHTML += '<code style="margin-bottom: 10px"><b>' + i +' : '+' </b> '+ attr.values_[i] + '</code><br>'
                    }
                }
                overlay.setPosition(coordinate);
            }else {
                overlay.setPosition(undefined)
            }

        })

        this.closer.onclick = function () {
            overlay.setPosition(undefined);
            that.closer.blur();
            return false;
        };
    }

    ngAfterViewInit() {
        let button = document.getElementById("side-bar-map");
        let span = document.getElementById("sidebar-span");
        let map = document.getElementById("map");
        if (button !== null && map !== null && span !== null)
            button.onclick = this.openSideBar(button, map, span)
    }

    openSideBar(button: HTMLElement, map: HTMLElement, span: HTMLElement) {
        return () => {
            console.log(this.map.getMap().getViewport())
            this.isVisibleLayers = !this.isVisibleLayers;
            if (!this.isVisibleLayers) {
                map.className = "map"
                span.className = "p-button-icon pi pi-caret-right"
            } else {
                map.className = "map side"
                span.className = "p-button-icon pi pi-caret-left"
            }

        }
    }

}
