import {Component, OnInit} from '@angular/core';
import {CustomMap} from "../models/CustomMap";
import {LineString, Point} from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import {Feature} from "ol";
import {Fill, Icon, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import {getVectorContext} from "ol/render";

@Component({
    selector: 'app-test-map',
    templateUrl: './test-map.component.html',
    styleUrls: ['./test-map.component.scss']
})
export class TestMapComponent implements OnInit {
    map!: CustomMap;
    route:any;
    speedInput:any=100;
    animating:boolean=false;
    lastTime:any;
    vectorLayer!:VectorLayer<any>;
    position:any;
    geoMarker:any;
    distance:number=0;
    styles:any;

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

        let feature = new Feature({
            geometry:this.route
        })

        let startMarker = new Feature({
            geometry:new Point(this.route.getFirstCoordinate())
        })

        let lastMarker = new Feature({
            geometry:new Point(this.route.getLastCoordinate())
        })

        this.position = startMarker.getGeometry()!.clone();
        this.geoMarker = new Feature({
            type: 'geoMarker',
            geometry: this.position,
        });

        this.map.getMap().getLayers().forEach(f=>{
            if(f instanceof VectorLayer && f.getClassName()=='ol-layer'){
                this.vectorLayer=f;
                this.vectorLayer.getSource().addFeatures([feature,this.geoMarker,startMarker,lastMarker]);
            }
        })
    }

    moveFeature(event:any,that:any){
        if(!that.animating)
            return
        let speed=that.speedInput;
        let time = event.frameState.time;
        let elapsedTime = time - that.lastTime;
        that.distance = (that.distance + (speed * elapsedTime) / 1e6) % 2
        that.lastTime = time;
        let currentCoordinate = that.route.getCoordinateAt(that.distance>1?2-that.distance:that.distance)
        that.position.setCoordinates(currentCoordinate);
        let vectorContext = getVectorContext(event);
        console.log("test")
        vectorContext.setStyle(new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({color: 'black'}),
                stroke: new Stroke({
                    color: 'white',
                    width: 2,
                }),
            }),
        }));
        vectorContext.drawGeometry(that.position)
        that.map.getMap().render()
    }

    startAnimation(){
        this.animating=true;
        this.lastTime=Date.now()
        const that=this;
        this.vectorLayer.on('postrender',function (evt){
            return that.moveFeature(evt,that)
        })
        this.geoMarker.setGeometry(undefined);
    }

    stopAnimation(){
        this.animating=false;
        this.geoMarker.setGeometry(this.position)
        const that=this;
        this.vectorLayer.un('postrender',function (evt){
            return that.moveFeature(evt,that)
        })
    }

}
