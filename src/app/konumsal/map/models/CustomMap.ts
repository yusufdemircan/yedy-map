import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import View from "ol/View";
import {defaults, Draw, Modify, Select, Translate} from "ol/interaction";
import {Control, FullScreen, MousePosition, ScaleLine, Zoom, ZoomSlider} from "ol/control";
import * as jspdf from "jspdf";
import {Feature, Overlay} from "ol";
import {LineString, Polygon} from "ol/geom";
import {getLength} from "ol/sphere";
import {getArea} from "ol/extent";
import {Fill, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import {unByKey} from "ol/Observable";
import {transform} from "ol/proj";
export class CustomMap {
    mapDivId:string='map';
    public map!: Map;
    select = new Select({
        style:new Style({
            fill:new Fill({
                color:'rgb(0,111,241)'
            }),

        })
    });

    translate = new Translate({
        features: this.select.getFeatures(),
    });
    public raster = new TileLayer({
        source: new OSM(),
    });
    public style = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2,
        }),
        image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
        }),
    });
    public source: any;
    public vector: any;
    public draw!: Draw;
    public modify!: Modify;
    sketch!: Feature | null;
    helpTooltipElement!: HTMLElement;
    helpTooltip!: Overlay;
    measureTooltipElement!: any;
    measureTooltip!: Overlay;
    public continuePolygonMsg = 'Alan çizmek için tıklayınız.';
    public continueLineMsg = 'Çizgi çizmek için tıklayınız.'

    constructor() {
        this.generateMap()
    }


    generateMap(){
        const scaleLine = new ScaleLine({bar: true, text: true, minWidth: 125});
        this.source = new VectorSource({wrapX: true});
        this.vector = new VectorLayer({
            source: this.source,
            style: {
                'fill-color': 'rgba(255, 255, 255, 0.2)',
                'stroke-color': '#002ebb',
                'stroke-width': 2,
                'circle-radius': 7,
                'circle-fill-color': '#5929c7',
            },
        });
        this.modify = new Modify({source: this.source});
        const that=this;
        this.map = new Map({
            interactions:defaults().extend([this.select]),
            layers: [this.raster, this.vector],
            target: that.mapDivId,
            view: new View({
                center: [34.83210051682406, 39.95222973768039],
                zoom: 6,
                maxZoom: 18,
                projection: 'EPSG:4326'
            }),
            controls: [
                new Zoom(),
                scaleLine,
                new ZoomSlider(),
                new FullScreen({source: 'fullscreen'}),
                new MousePosition(),
                new SideMenuBarMap({})
            ]
        });


        /*const that = this;
        this.map.getViewport().addEventListener('mouseout', function () {
            that.helpTooltipElement.classList.add('hidden');
        });*/
    }

    getMap() {
        return this.map;
    }

    addInteractionDraw(selectedDrop: any) {
        this.map.removeInteraction(this.draw)
        if (selectedDrop !== 'None' && selectedDrop !== null) {
            this.draw = new Draw({
                source: this.source,
                type: selectedDrop
            });
            this.map.addInteraction(this.draw);
        }
    }

    activatedEditing(isActive: boolean) {
        isActive ? this.map.addInteraction(this.modify) : this.map.removeInteraction(this.modify);
    }

    printMap(map: Map, type: string) {
        this.map = map;
        const that = this;
        const mapCanvas = document.createElement('canvas');
        const size = that.map.getSize();
        if (size) {
            mapCanvas.width = size[0];
            mapCanvas.height = size[1];
        }
        const mapContext = mapCanvas.getContext('2d');
        Array.prototype.forEach.call(
            that.map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
            function (canvas) {
                if (canvas.width > 0) {
                    const opacity =
                        canvas.parentNode.style.opacity || canvas.style.opacity;
                    if (mapContext)
                        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                    let matrix;
                    const transform = canvas.style.transform;
                    if (transform) {
                        // Get the transform parameters from the style's transform matrix
                        matrix = transform
                            .match(/^matrix\(([^\(]*)\)$/)[1]
                            .split(',')
                            .map(Number);
                    } else {
                        matrix = [
                            parseFloat(canvas.style.width) / canvas.width,
                            0,
                            0,
                            parseFloat(canvas.style.height) / canvas.height,
                            0,
                            0,
                        ];
                    }
                    CanvasRenderingContext2D.prototype.setTransform.apply(
                        mapContext,
                        matrix
                    );
                    const backgroundColor = canvas.parentNode.style.backgroundColor;
                    if (backgroundColor) {
                        if (mapContext) {
                            mapContext.fillStyle = backgroundColor;
                            mapContext.fillRect(0, 0, canvas.width, canvas.height);
                        }
                    }
                    if (mapContext)
                        mapContext.drawImage(canvas, 0, 0);
                }
            }
        );
        if (mapContext) {
            mapContext.globalAlpha = 1;
            mapContext.setTransform(1, 0, 0, 1, 0, 0);
        }

        if (type === 'PDF') {
            const pdf = new jspdf.jsPDF('landscape', undefined, 'A4');
            pdf.addImage(
                mapCanvas.toDataURL('image/jpeg'),
                'JPEG',
                0,
                0,
                297,
                210
            );
            pdf.save('map.pdf')
        } else if (type === 'PNG') {
            const link = document.getElementById('image-download')
            if (link !== null) {
                link.setAttribute('href', mapCanvas.toDataURL())
                link.click()
            }

        }
        that.map.renderSync();
    }


    pointerMoveHandler(evt: any) {
        if (evt.dragging) {
            return;
        }
        let helpMsg = 'Click to start drawing';

        if (this.sketch) {
            const geom = this.sketch!.getGeometry();
            if (geom instanceof Polygon) {
                helpMsg = this.continuePolygonMsg;
            } else if (geom instanceof LineString) {
                helpMsg = this.continueLineMsg;
            }
        }
        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(evt.coordinate);

        this.helpTooltipElement.classList.remove('hidden');
    }

    formatLength(line: LineString) {
        const length = getLength(line,{projection:'EPSG:4326'});
        let output;
        if (length > 100) {
            output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else {
            output = Math.round(length * 100) / 100 + ' ' + 'm';
        }
        return output;
    }

    formatArea(polygon: Polygon) {
        const area = getArea(transform(polygon.getExtent(),"EPSG:4326","EPSG:4326"));
        let output;
        if (area > 0.0001) {
            output = Math.round(((area) * 10000) *100) / 100 + ' ' + 'km<sup>2</sup>';
        } else {
            output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
        }
        return output;
    }

    addMeasurementInteraction(typeSelect: string,map:Map) {
        map.removeInteraction(this.draw)
        this.createMeasureTooltip(map);
        this.createHelpTooltip(map);

        const that = this;
        const type = typeSelect == 'area' ? 'Polygon' : 'LineString';

        this.draw = new Draw({
            source: this.source,
            type: type,
            style: function (feature: any) {
                const geomType = feature.getGeometry().getType();
                return that.style;
            },
        });

        map.addInteraction(this.draw);


        let listener: any;

        this.draw.on('drawstart', function (evt: any) {
            that.sketch = evt.feature;

            let tooltipCoord = evt.coordinate;

            listener = that.sketch!.getGeometry()!.on('change', function (evt) {
                const geom = evt.target;
                let output;
                if (geom instanceof Polygon) {
                    output = that.formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    output = that.formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                that.measureTooltipElement.innerHTML = output;
                that.measureTooltip.setPosition(tooltipCoord);
            });
        });

        this.draw.on('drawend', function () {
            that.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            that.measureTooltip.setOffset([0, -7]);
            that.sketch = null;
            that.measureTooltipElement = undefined;
            that.createMeasureTooltip(map);
            unByKey(listener);
        });
    }

    createHelpTooltip(map:Map) {
        if (this.helpTooltipElement!==undefined) {
            this.helpTooltipElement.parentNode!.removeChild(this.helpTooltipElement);
        }
        this.helpTooltipElement = document.createElement('div');
        this.helpTooltipElement.className = 'ol-tooltip hidden';
        this.helpTooltip = new Overlay({
            element: this.helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        this.map.addOverlay(this.helpTooltip);
    }

    createMeasureTooltip(map:Map) {
        if (this.measureTooltipElement!==undefined) {
            this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
        }
        this.measureTooltipElement = document.createElement('div');
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        this.measureTooltip = new Overlay({
            element: this.measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
        });

        map.addOverlay(this.measureTooltip);
    }

}

export class SideMenuBarMap extends Control {
    constructor(opt_options: any) {
        const options = opt_options || {};
        const button = '<button id="side-bar-map"  class="p-element p-ripple p-button p-component p-button-icon-only"><span id="sidebar-span" class="p-button-icon pi pi-caret-right" aria-hidden="true"></span><span class="p-ink"></span></button>';

        const element = document.createElement('div');
        element.innerHTML = button;
        super({
            element: element,
            target: options.target,
        });

    }

}
