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
@Component({
  selector: 'app-test-map',
  templateUrl: './test-map.component.html',
  styleUrls: ['./test-map.component.scss']
})
export class TestMapComponent implements OnInit{
    map!: CustomMap;

    ngOnInit(): void {
        this.map = new CustomMap();
        let marker = new Feature({
            geometry:new Polygon( [
                [
                    [
                        33.08241035589798,
                        40.57625304106994
                    ],
                    [
                        33.609955087585774,
                        38.99422179106994
                    ],
                    [
                        36.58179067775015,
                        39.25789366606994
                    ],
                    [
                        35.54428577044102,
                        41.38484652284904
                    ],
                    [
                        34.5771204290134,
                        40.48836241606994
                    ],
                    [
                        33.59237053151931,
                        41.20906527284904
                    ],
                    [
                        33.856142897363206,
                        40.08406567518039
                    ],
                    [
                        33.240674043727445,
                        40.83992491606994
                    ],
                    [
                        33.08241035589798,
                        40.57625304106994
                    ]
                ]
            ])
        })

        let vector = new VectorSource({
            features:[marker]
        })

        let vectorlayer = new VectorLayer({
            source:vector
        })

        const serviceUrl =
            'https://services-eu1.arcgis.com/NPIbx47lsIiu2pqz/ArcGIS/rest/services/' +
            'Neptune_Coastline_Campaign_Open_Data_Land_Use_2014/FeatureServer/';
        const layer = '0';

        let fillColors:any = {
            'Lost To Sea Since 1965': [0, 0, 0, 1],
            'Urban/Built-up': [104, 104, 104, 1],
            'Shacks': [115, 76, 0, 1],
            'Industry': [230, 0, 0, 1],
            'Wasteland': [230, 0, 0, 1],
            'Caravans': [0, 112, 255, 0.5],
            'Defence': [230, 152, 0, 0.5],
            'Transport': [230, 152, 0, 1],
            'Open Countryside': [255, 255, 115, 1],
            'Woodland': [38, 115, 0, 1],
            'Managed Recreation/Sport': [85, 255, 0, 1],
            'Amenity Water': [0, 112, 255, 1],
            'Inland Water': [0, 38, 115, 1],
        };

        const style = new Style({
            fill: new Fill(),
            stroke: new Stroke({
                color: [0, 0, 0, 1],
                width: 0.5,
            }),
        });

        let esriSource = new VectorSource({
            format:new EsriJSON(),
            url:function (extent, resolution, projection) {
                const srid = projection
                    .getCode()
                    .split(/:(?=\d+$)/)
                    .pop();

                return serviceUrl +
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
                    tileSize:512
                }
            ))
            ,

        })

        const esriVector = new VectorLayer({
            source: esriSource,
            style: function (feature) {
                const classify = feature.get('LU_2014');
                const color = fillColors[classify] || [0, 0, 0, 0];
                style.getFill().setColor(color);
                return style;
            },
            opacity: 0.7,
        });

        let esriLayer = new VectorLayer({
            source:esriSource
        })
        /*this.map.getMap().setView(new View({
            center: fromLonLat([1.72, 52.4]),
            zoom: 14,
        }))*/

        const ogmSource = new VectorSource({
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
        })

        const ogmLayer = new VectorLayer({
            source:ogmSource,
            style: {
                'fill-color': 'rgba(255,255,255,0.45)',
                'stroke-color': '#e10c0c',
                'stroke-width': 2,
            },
            opacity:0.5
        })

        const ogmSource2 = new VectorSource({
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

        })

        const ogmLayer2 = new VectorLayer({
            source:ogmSource2,
            style: {
                'fill-color': 'rgba(0,78,255,0)',
                'stroke-color': '#3eff00',
                'stroke-width': 15,

            },
            opacity:0.5
        })

        this.map.getMap().setView(
            new View({
                center: [31.96141091291871,40.738509417720984],
                zoom: 14,
                maxZoom: 18,
                projection: 'EPSG:4326',
            }),
        )
        this.map.getMap().addLayer(esriVector);
        this.map.getMap().addLayer(esriLayer);
        this.map.getMap().addLayer(ogmLayer2)
        this.map.getMap().addLayer(ogmLayer)


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
