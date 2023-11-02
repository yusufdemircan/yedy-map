import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CustomMap} from "../../models/CustomMap";
import {mapSideBar, mapTopbar} from "../../consts/map-edit-tab-menu-item";
import {Overlay} from "ol";
import VectorLayer from "ol/layer/Vector";
import {MapService} from "../../services/map.service";
import {Draw} from "ol/interaction";
import VectorSource from "ol/source/Vector";
import {LineString} from "ol/geom";


interface Country {
    name: string,
    code: string
}

@Component({
    selector: 'konumsal-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit ,OnDestroy{
    @Input() map!: CustomMap;
    @Input() mapDivId!:string;
    isVisibleLayers: boolean = false;
    items!: any;
    groupedLayers!: any[];
    selectedLayer!: any[];
    container: any;
    content: any;
    closer: any;
    ogmLayer!:VectorLayer<any>;
    ogmLayer2!:VectorLayer<any>;
    evt:any;
    constructor(private mapService:MapService) {
    }

    ngOnInit(): void {

        const bolmeStyle = {
            'fill-color': 'rgba(255,0,0,0.03)',
            'stroke-color': '#e10c0c',
            'stroke-width': 2,
        }

        const seflikStyle= {
            'fill-color': 'rgba(0,78,255,0)',
            'stroke-color': '#5000ff',
            'stroke-width': 4,

        }

        this.ogmLayer=this.mapService.generateVectorLayer('https://orbiscbs.ogm.gov.tr/arcgis/rest/services/DISKURUM/BOLME/MapServer','0','bolme',14,bolmeStyle)
        this.ogmLayer2=this.mapService.generateVectorLayer('https://orbiscbs.ogm.gov.tr/arcgis/rest/services/DISKURUM/SEFLIK/MapServer','0','seflik',12,seflikStyle)

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
        let map = document.getElementById(this.mapDivId);

        if (button !== null && map !== null && span !== null){
            button.setAttribute("id",this.mapDivId+'-btn');
            span.setAttribute("id",this.mapDivId+'-span');
            button.onclick = this.openSideBar(map, span)
        }
        this.map.getMap().getLayers().forEach(f=>{
            if(f.getClassName()!=='ol-layer'){
                f.on('propertychange',evt=>{
                    let layer = evt.target as VectorLayer<any>;
                    if(!layer.getVisible()){
                        //TODO Proplarda bir değişiklik olma durumunda işlem yapılacaksa kullan
                    }

                })
            }
        })


    }

    openSideBar(map: HTMLElement, span: HTMLElement) {
        return () => {

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
        //TODO Harita üzerine çizilen geometryleri kullanmak için
        this.map.getMap().getInteractions().forEach(f=>{
            if(f instanceof Draw){
                let draw = f as any;
                let source = draw.source_ as VectorSource;
                source.getFeatures().forEach(f=>{
                    console.log(f.getGeometry())
                    let line = f.getGeometry() as LineString;
                    console.log(line.getCoordinates())
                })
            }
        })

        const req =null;
        this.map.getMap().getLayers().forEach(f=>{
            if(this.selectedLayer.includes(f.getClassName())){
                let layer = f as VectorLayer<any>;
                f.setVisible(true)
            }
            else if(f.getClassName()!=='ol-layer'){
                f.setVisible(false)
            }
        })
    }

    ngOnDestroy(): void {
        this.map.getMap().dispose()
    }

}
