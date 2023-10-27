import {Injectable} from '@angular/core';
import {CustomMap} from "../models/CustomMap";
import VectorSource from "ol/source/Vector";
import EsriJSON from "ol/format/EsriJSON";
import {tile as tileStrategy} from "ol/loadingstrategy";
import {createXYZ} from "ol/tilegrid";
import VectorLayer from "ol/layer/Vector";
import {Style} from "ol/style";
import {StyleLike} from "ol/style/Style";

@Injectable({
    providedIn: 'root'
})
export class MapService {
    constructor() {
    }

    getMap() {
        return new CustomMap();
    }

    generateVectorLayer(url: string, layer: string, className:string, minZoomLevel: number,style:any) {
        let vectorSource = new VectorSource({
            format: new EsriJSON(),
            url: function (extent, resolution, projection) {
                const srid = projection
                    .getCode()
                    .split(/:(?=\d+$)/)
                    .pop();

                return url + '/' +
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
            strategy: tileStrategy(createXYZ(
                {
                    tileSize: 128
                }
            ))
        });
        return new VectorLayer({
            source: vectorSource,
            style: style,
            opacity: 0.5,
            className: className,
            visible: false,
            minZoom: minZoomLevel
        });

    }
}
