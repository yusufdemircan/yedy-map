import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {CustomMap} from "../../models/CustomMap";
import {SelectItemGroup} from "primeng/api";
import {mapSideBar, mapTopbar} from "../../consts/map-edit-tab-menu-item";
import Map from "ol/Map";
import {Overlay} from "ol";
import {toStringHDMS} from "ol/coordinate";
import {toLonLat} from "ol/proj";
import {Polygon} from "ol/geom";
import VectorSource from "ol/source/Vector";
import EsriJSON from "ol/format/EsriJSON";
import {tile as tileStrategy} from "ol/loadingstrategy";
import {createXYZ} from "ol/tilegrid";
import VectorLayer from "ol/layer/Vector";


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
    @Input() mapDivId!:string;
    isVisibleLayers: boolean = false;
    items!: any;
    groupedLayers!: any[];
    selectedLayer!: any[];
    container: any;
    content: any;
    closer: any;
    ogmSource!:VectorSource;
    ogmLayer!:VectorLayer<any>;
    ogmSource2!:VectorSource;
    ogmLayer2!:VectorLayer<any>;
    constructor() {
    }

    ngOnInit(): void {
        const layer = '0';
        this.ogmSource = new VectorSource({
            format:new EsriJSON(),
            url:function (extent, resolution, projection) {
                const srid = projection
                    .getCode()
                    .split(/:(?=\d+$)/)
                    .pop();

                return 'https://orbiscbs.ogm.gov.tr/arcgis/rest/services/DISKURUM/BOLME/MapServer/' +
                    layer +
                    '/query/?f=json&' +
                    'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent(
                        '{"xmin":' +
                        extent[0] +
                        ',"ymin":' +
                        extent[1] +
                        ',"xmax":' +
                        extent[2] +
                        ',"ymax":' +
                        extent[3] +
                        ',"spatialReference":{"wkid":' +
                        srid +
                        '}}'
                    ) +
                    '&geometryType=esriGeometryEnvelope&inSR=' +
                    srid +
                    '&outFields=*' +
                    '&outSR=' +
                    srid;
            },
            strategy:tileStrategy(createXYZ(
                {
                    tileSize:128
                }
            ))
            ,
            attributions:'bolme'

        })

        this.ogmLayer = new VectorLayer({
            source:this.ogmSource,
            style: {
                'fill-color': 'rgba(255,0,0,0.03)',
                'stroke-color': '#e10c0c',
                'stroke-width': 2,
            },
            opacity:0.5,
            className:'bolme',
            visible:false
        })

        this.ogmSource2 = new VectorSource({
            format:new EsriJSON(),
            url:function (extent, resolution, projection) {
                const srid = projection
                    .getCode()
                    .split(/:(?=\d+$)/)
                    .pop();

                return 'https://orbiscbs.ogm.gov.tr/arcgis/rest/services/DISKURUM/SEFLIK/MapServer/' +
                    layer +
                    '/query/?f=json&' +
                    'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
                    encodeURIComponent(
                        '{"xmin":' +
                        extent[0] +
                        ',"ymin":' +
                        extent[1] +
                        ',"xmax":' +
                        extent[2] +
                        ',"ymax":' +
                        extent[3] +
                        ',"spatialReference":{"wkid":' +
                        srid +
                        '}}'
                    ) +
                    '&geometryType=esriGeometryEnvelope&inSR=' +
                    srid +
                    '&outFields=*' +
                    '&outSR=' +
                    srid;
            },
            strategy:tileStrategy(createXYZ(
                {
                    tileSize:128
                }
            ))
            ,
            attributions:'seflik'

        })

        this.ogmLayer2 = new VectorLayer({
            source:this.ogmSource2,
            style: {
                'fill-color': 'rgba(0,78,255,0)',
                'stroke-color': '#5000ff',
                'stroke-width': 4,

            },
            opacity:0.5,
            className:'seflik',
            visible:false
        })

        this.map.getMap().addLayer(this.ogmLayer2)
        this.map.getMap().addLayer(this.ogmLayer)

        this.groupedLayers = mapSideBar;
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
                const coordinate = selected.mapBrowserEvent.coordinate;
                that.content.innerHTML='<h4>'+'Seçilen Alan'+'</h4>';
                that.content.innerHTML+='<div style="border:1px solid gray"></div>'
                for(let i in attr.values_){
                    if(i!=='geometry' && i!=='CREATED_DATE' && i!=='ALAN' && i!=='UZUNLUK' && i!=='LAST_EDITED_USER' && i!=='LAST_EDITED_DATE' && i!=='ACIKLAMA' && i!=='GLOBAL_ID'){
                        that.content.innerHTML += '<p><code style="margin-bottom: 10px"><b>' + i +' : '+' </b> '+ attr.values_[i] + '</code><br></p>'
                    }
                }
                console.log(that.content.innerHTML)
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

    changeLayer(event:any){
        this.map.getMap().getLayers().forEach(f=>{
            console.log(f)
            if(this.selectedLayer.includes(f.getClassName())){
                f.setVisible(true)
            }
            else if(f.getClassName()!=='ol-layer'){
                f.setVisible(false)
            }
        })
    }

}
