import {Component, OnInit} from '@angular/core';
import {CustomMap} from "../../../map/models/CustomMap";
import {LineString, Point} from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import {Feature} from "ol";
import {getVectorContext} from "ol/render";
import {Fill, Icon, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";

@Component({
    selector: 'app-tracking-map',
    templateUrl: './tracking-map.component.html',
    styleUrls: ['./tracking-map.component.scss']
})
export class TrackingMapComponent implements OnInit {
    map!: CustomMap;
    route: any;
    speedInput: any = 100;
    animating: boolean = false;
    lastTime: any;
    vectorLayer!: VectorLayer<any>;
    position: any;
    geoMarker: any;
    distance: number = 0;
    styles: any;
    startMarker:any;
    lastMarker:any;
    planeSymbol:any;

    ngOnInit(): void {
        this.map = new CustomMap();
        this.addRoute()
    }

    addRoute() {
        this.route = new LineString([[28.545526468352314
            ,
            41.17390955929085]
            ,
            [32.80105343398761
                ,
                39.996174379628144]
            ,
            [39.483288043648656
                ,
                40.769612147849045]]);
        this.planeSymbol =new Style({
            image: new Icon({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'https://cdn-icons-png.flaticon.com/64/12605/12605180.png',
            }),
        });

        let feature = new Feature({
            geometry: this.route
        })

        this.startMarker = new Feature({
            geometry: new Point(this.route.getFirstCoordinate())
        })

        this.lastMarker = new Feature({
            geometry: new Point(this.route.getLastCoordinate())
        })
        this.lastMarker.setStyle(this.planeSymbol)

        this.position = this.startMarker.getGeometry()!.clone();
        this.geoMarker = new Feature({
            type: 'geoMarker',
            geometry: this.position,
        });

        this.map.getMap().getLayers().forEach(f => {
            if (f instanceof VectorLayer && f.getClassName() == 'ol-layer') {
                this.vectorLayer = f;
                this.vectorLayer.getSource().addFeatures([feature, this.geoMarker, this.startMarker, this.lastMarker]);
            }
        })
    }

    moveFeature(event: any, that: any) {
        if (!that.animating)
            return
        let speed = that.speedInput;
        let time = event.frameState.time;
        let elapsedTime = time - that.lastTime;
        that.distance = (that.distance + (speed * elapsedTime) / 1e6) % 2
        if(that.distance>1)
            that.distance=0
        console.log(that.distance)
        that.lastTime = time;
        let currentCoordinate = that.route.getCoordinateAt(that.distance > 1 ? 2 - that.distance : that.distance)
        that.position.setCoordinates(currentCoordinate);
        let vectorContext = getVectorContext(event);
        vectorContext.setStyle(that.planeSymbol);
        vectorContext.drawGeometry(that.position)
        that.map.getMap().render()
    }

    startAnimation() {
        this.animating = true;
        this.lastTime = Date.now()
        const that = this;
        this.vectorLayer.on('postrender', function (evt) {
            return that.moveFeature(evt, that)
        })
        this.geoMarker.setGeometry(undefined);
    }

    stopAnimation() {
        this.animating = false;
        this.geoMarker.setStyle(this.planeSymbol)
        this.geoMarker.setGeometry(this.position)
        const that = this;
        this.vectorLayer.un('postrender', function (evt) {
            return that.moveFeature(evt, that)
        })
    }


}
