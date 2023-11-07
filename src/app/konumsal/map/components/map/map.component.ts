import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CustomMap} from "../../models/CustomMap";
import {mapSideBar, mapTopbar} from "../../consts/map-edit-tab-menu-item";
import {Feature, Overlay} from "ol";
import VectorLayer from "ol/layer/Vector";
import {MapService} from "../../services/map.service";
import {Draw} from "ol/interaction";
import VectorSource from "ol/source/Vector";
import {LineString} from "ol/geom";
import {MenuItem} from "primeng/api";


interface Country {
    name: string,
    code: string
}

@Component({
    selector: 'konumsal-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() map!: CustomMap;
    @Input() mapDivId!: string;
    inputDisabled: boolean = false;
    isVisibleLayers: boolean = false;
    drawOptionBar: boolean = false;
    measureOptionBar: boolean = false;
    printOptionBar: boolean = false;
    items!: any;
    groupedLayers!: any[];
    selectedLayer!: any[];
    container: any;
    content: any;
    closer: any;
    ogmLayer!: VectorLayer<any>;
    ogmLayer2!: VectorLayer<any>;
    evt: any;
    mapBottomItem: MenuItem[] | undefined;
    drawValue: any;
    measureValue: any;
    printValue: any;
    dockValue: any;
    airVehicleInfoTemplateVisible: boolean = false;
    airVehicleInfoTemplate: any;
    mapOverlay: any;
    mapOverlayHeader: any;
    mapOverlayInfo: any;

    drawOptions: any[] = [
        {icon: 'pi pi-circle-on', justify: 'Left', label: 'Nokta', value: 'Point'},
        {icon: 'pi pi-minus', justify: 'Right', label: 'Çizgi', value: 'LineString'},
        {icon: 'pi pi-cloud', justify: 'Center', label: 'Polygon', value: 'Polygon'},
        {icon: 'pi pi-circle-off', justify: 'Justify', label: 'Daire', value: 'Circle'},
        {icon: 'pi pi-globe', justify: 'Right', label: 'Gezinti', value: 'None'}
    ];
    measureOptions: any[] = [
        {icon: 'pi pi-minus', justify: 'Right', label: 'Çizgi', value: 'line'},
        {icon: 'pi pi-circle-off', justify: 'Justify', label: 'Alan', value: 'area'},
    ];
    printOptions: any[] = [
        {icon: 'pi pi-file-pdf', justify: 'Right', label: 'PDF', value: 'PDF'},
        {icon: 'pi pi-image', justify: 'Justify', label: 'PNG', value: 'PNG'},
        {icon: 'pi pi-file-o', justify: 'Justify', label: 'KML', value: 'KML'},
    ];

    constructor(private mapService: MapService) {
    }

    ngOnInit(): void {
        this.mapBottomItem = [
            {
                label: 'Katmanlar',
                icon: '/assets/images/layers.png',
                command: () => {
                    this.changeOption()
                    this.map.select.setActive(true)
                    this.isVisibleLayers = !this.isVisibleLayers
                }
            },

            {
                label: 'Çizim',
                icon: '/assets/images/pencil.png',
                command: () => {
                    this.changeOption()
                    this.drawOptionBar = !this.drawOptionBar
                }
            },

            {
                label: 'Çizim',
                icon: '/assets/images/tape-measure.png',
                command: () => {
                    this.changeOption()
                    this.measureOptionBar = !this.measureOptionBar
                }
            },

            {
                label: 'Çıktı',
                icon: '/assets/images/print.png',
                command: () => {
                    this.changeOption()
                    this.printOptionBar = !this.printOptionBar
                }
            }
            ,

            {
                label: 'Kapat',
                icon: '/assets/images/multiply.png',
                command: () => {
                    this.changeOption()
                    this.mapOverlay.style.display = 'none'
                    this.map.select.setActive(true)
                }
            }
        ]

        const bolmeStyle = {
            'fill-color': 'rgba(255,0,0,0.03)',
            'stroke-color': '#e10c0c',
            'stroke-width': 2,
        }

        const seflikStyle = {
            'fill-color': 'rgba(0,78,255,0)',
            'stroke-color': '#5000ff',
            'stroke-width': 4,

        }

        this.ogmLayer = this.mapService.generateVectorLayer('https://orbiscbs.ogm.gov.tr/arcgis/rest/services/DISKURUM/BOLME/MapServer', '0', 'bolme', 14, bolmeStyle)
        this.ogmLayer2 = this.mapService.generateVectorLayer('https://orbiscbs.ogm.gov.tr/arcgis/rest/services/DISKURUM/SEFLIK/MapServer', '0', 'seflik', 12, seflikStyle)

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
        this.airVehicleInfoTemplate = document.getElementById('content-param')
        this.mapOverlay = document.getElementById("map-overlay")
        this.mapOverlayHeader = document.getElementById("overlay-header")
        this.mapOverlayInfo = document.getElementById("overlay-info")

        this.mapOverlay.style.display = 'none';
        this.map.getMap().addOverlay(overlay);
        const that = this;
        this.map.select.on('select', function (selected) {
            if (selected.selected.length > 0) {
                that.airVehicleInfoTemplate.innerHTML = ''
                let attr: any = selected.selected[0]
                if (attr.values_['features'] !== undefined)
                    attr = attr.values_['features'][0]
                that.airVehicleInfoTemplateVisible = true;
                that.mapOverlay.style.display = 'block';
                if (selected.target.getLayer(selected.selected[0]).getClassName() != 'airVehicles') {
                    that.mapOverlayHeader.innerHTML = '<div class="col-12"><div class="flex flex-column text-center">\n' +
                        '                                                        <div class="text-4xl font-bold">Su Toplama Çukuru</div>\n' +
                        '                                                    </div></div>';
                    that.mapOverlayInfo.innerHTML = '<div class="">' + attr.values_['turu'] + '</div>'

                } else {
                    that.mapOverlayHeader.innerHTML = '' +
                        '<div _ngcontent-wib-c23="">' +
                        '<div class="text-4xl font-bold">İST</div><' +
                        '/div>' +
                        '<p-image _ngcontent-wib-c23="" src="/assets/images/plane-orange.png" alt="Image" height="64" width="64" class="p-element ng-tns-c22-63 ng-star-inserted" ng-reflect-src="/assets/images/plane-orange.pn" ng-reflect-alt="Image" ng-reflect-height="64" ng-reflect-width="64">' +
                        '<span class="ng-tns-c22-63 p-image p-component" ng-reflect-ng-class="[object Object]">' +
                        '<img class="ng-tns-c22-63" src="/assets/images/plane-orange.png" alt="Image" width="64" height="64"></span>' +
                        '</p-image><div _ngcontent-wib-c23=""><div class="text-4xl font-bold">ANK</div></div>';
                    that.mapOverlayInfo.innerHTML = '';
                }

                for (let i in attr.values_) {
                    if (i.includes('id') || i.includes('geometry'))
                        continue
                    that.airVehicleInfoTemplate.innerHTML += '<div class="col-12"><div class="flex flex-column">\n' +
                        '                                                        <div class="text-2xl font-bold">' + i + '</div>\n' +
                        '                                                        <div class="">' + attr.values_[i] + '</div>\n' +
                        '                                                    </div></div>'
                }

                const coordinate = selected.mapBrowserEvent.coordinate;
                /*that.content.innerHTML = '<h4>' + 'Seçilen Alan' + '</h4>';
                that.content.innerHTML += '<div style="border:1px solid gray"></div>'
                for (let i in attr.values_) {
                    if (i !== 'geometry' && i !== 'CREATED_DATE' && i !== 'ALAN' && i !== 'UZUNLUK' && i !== 'LAST_EDITED_USER' && i !== 'LAST_EDITED_DATE' && i !== 'ACIKLAMA' && i !== 'GLOBAL_ID') {
                        that.content.innerHTML += '<p><code style="margin-bottom: 10px"><b>' + i + ' : ' + ' </b> ' + attr.values_[i] + '</code><br></p>'
                    }
                }
                overlay.setPosition(coordinate);*/
            } else {
                that.mapOverlay.style.display = 'none';
                that.airVehicleInfoTemplateVisible = false;
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

        if (button !== null && map !== null && span !== null) {
            button.setAttribute("id", this.mapDivId + '-btn');
            span.setAttribute("id", this.mapDivId + '-span');
            button.onclick = this.openSideBar(map, span)
        }
        this.map.getMap().getLayers().forEach(f => {
            if (f.getClassName() !== 'ol-layer') {
                f.on('propertychange', evt => {
                    let layer = evt.target as VectorLayer<any>;
                    if (!layer.getVisible()) {
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

    changeLayer(event: any) {
        //TODO Harita üzerine çizilen geometryleri kullanmak için
        this.map.getMap().getInteractions().forEach(f => {
            if (f instanceof Draw) {
                let draw = f as any;
                let source = draw.source_ as VectorSource;
                source.getFeatures().forEach(f => {
                    let line = f.getGeometry() as LineString;
                })
            }
        })

        const req = null;
        this.map.getMap().getLayers().forEach(f => {
            if (this.selectedLayer.includes(f.getClassName())) {
                let layer = f as VectorLayer<any>;
                console.log(f)
                f.setVisible(true)
            } else if (f.getClassName() !== 'ol-layer') {
                f.setVisible(false)
            }
        })
    }

    ngOnDestroy(): void {
        this.map.getMap().dispose()
    }

    changeOption() {
        this.defaultOpt()
        this.drawOptionBar = false
        this.measureOptionBar = false;
        this.printOptionBar = false;
        this.isVisibleLayers = false;
    }

    addInteraction() {
        this.map.addInteractionDraw(this.drawValue.value)
    }

    addMeasurement() {
        this.map.addMeasurementInteraction(this.measureValue, this.map.getMap());
    }

    defaultOpt() {
        this.map.select.setActive(false)
        this.drawValue = 'None'
        this.map.addInteractionDraw('None');
        this.measureValue = 'None';
        this.printValue = 'None'
    }

    exportMap() {
        this.map.printMap(this.map.getMap(), this.printValue.value)
    }

}
