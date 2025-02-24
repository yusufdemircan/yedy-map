import {Component, OnInit} from '@angular/core';
import {CustomMap} from "../../../map/models/CustomMap";
import {LineString, Point} from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import {Feature} from "ol";
import {getVectorContext} from "ol/render";
import {Fill, Icon, Stroke, Style} from "ol/style";
import {unByKey} from "ol/Observable";
import {FormControl, FormGroup} from "@angular/forms";
import {HavacilikService} from "../services/havacilik.service";
import VectorSource from "ol/source/Vector";
import {Cluster} from "ol/source";
import CircleStyle from "ol/style/Circle";
import Text from "ol/style/Text"
import {boundingExtent} from "ol/extent";

@Component({
    selector: 'app-tracking-map',
    templateUrl: './tracking-map.component.html',
    styleUrls: ['./tracking-map.component.scss']
})
export class TrackingMapComponent implements OnInit {
    map!: CustomMap;
    route: any;
    speedInput: number = 10;
    animating: boolean = false;
    lastTime: any;
    havaAraciLayer!: VectorLayer<any>;
    havaAraciSource!: VectorSource;
    havaAraciLayerHistory!: VectorLayer<any>;
    havaAraciSourceHistory!: VectorSource;
    position: any;
    geoMarker: any;
    distance: number = 0;
    styles: any;
    startMarker: any;
    lastMarker: any;
    planeSymbol: any;
    trackASymbol: any;
    startSymbol: any;
    listenerKey: any[] = [];
    heartBeat: boolean = false;
    formGroup: FormGroup | undefined;
    featuresList: any[] = [];
    feature: any;
    waterCollectionStyle: any;
    suCukuruLayer!: VectorLayer<any>;
    suCukuruSource!: VectorSource;
    airVehicleLayer!: VectorLayer<any>;
    airVehicleSource!: VectorSource;
    waterCollectionCluster : any;
    waterCollectionClusterLayer : any;
    airVehicleCluster : any;
    airVehicleClusterLayer : any;
    styleCache:any = {};
    styleCacheAir:any = {};

    constructor(private havacilikService: HavacilikService) {

    }

    ngOnInit(): void {
        this.initSettings();
        this.addRoute()
        this.havacilikService.getWaterCollectionPit().subscribe(resp => {
            resp.data.forEach((f: any) => {
                let points = f.nokta.replaceAll(",", ".").split(":");
                this.addWaterCollectionPits([parseFloat(points[0]), parseFloat(points[1])], f)
            })
        });
        this.havacilikService.getActiveAirVehicles().subscribe(resp => {
            resp.data.forEach((f: any) => {
                let points = f.nokta.replaceAll(",", ".").split(":");
                this.addAirVehicles([parseFloat(points[0]), parseFloat(points[1])], f);
            })
        })
    }

    initSettings() {
        this.formGroup = new FormGroup({
            city: new FormControl<string | null>(null)
        });
        this.map = new CustomMap();
       /* this.havaAraciSource = new VectorSource({
            features: []
        })
        this.havaAraciLayer = new VectorLayer<any>({
            source: this.havaAraciSource
        });*/

        this.havaAraciSourceHistory = new VectorSource({
            features: []
        })
        this.havaAraciLayerHistory = new VectorLayer<any>({
            source: this.havaAraciSourceHistory,
            className: 'havaAraclariHistory',
            visible: false
        });

        this.airVehicleSource = new VectorSource({
            features: []
        })
        this.airVehicleLayer = new VectorLayer<any>({
            source: this.airVehicleSource,
            className:'airVehicles2',
            visible:false
        });

        this.suCukuruSource = new VectorSource({
            features: [],
        })
        this.suCukuruLayer = new VectorLayer<any>({
            source: this.suCukuruSource,
            className: 'suCukuruLayer2',
            visible: false,

        })

        this.waterCollectionCluster = new Cluster({
            distance:100,
            minDistance:30,
            source:this.suCukuruSource
        })
        this.waterCollectionClusterLayer = new VectorLayer({
            source: this.waterCollectionCluster,
            visible:false,
            className: 'suCukuruLayer',
            style: function (feature) {
                const size = feature.get('features').length;
                let style = that.styleCache[size];
                if (!style) {
                    style = new Style({
                        image: new Icon({
                            anchor: [0.5, 15],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'pixels',
                            rotateWithView: true,
                            scale:1.5,
                            rotation: 0,
                            src: '/assets/images/lake-32.png',//https://cdn-icons-png.flaticon.com/32/11015/11015750.png
                        }),
                        text:new Text({
                            text: size.toString(),
                            scale:1.5,
                            fill: new Fill({
                                color: '#000000',
                            }),
                        })
                    });
                    that.styleCache[size] = style;
                }
                return style;
            },
        })

        this.airVehicleCluster = new Cluster({
            distance:100,
            minDistance:30,
            source:this.airVehicleSource
        })
        this.airVehicleClusterLayer = new VectorLayer({
            source: this.airVehicleCluster,
            visible:false,
            className: 'airVehicles',
            style: function (feature) {
                const size = feature.get('features').length;
                let style = that.styleCacheAir[size];
                if (!style) {
                    style = new Style({
                        image: new Icon({
                            anchor: [0.5, 15],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'pixels',
                            rotateWithView: true,
                            scale:1.5,
                            src: '/assets/images/heli-32.png',//https://cdn-icons-png.flaticon.com/64/1048/1048346.png
                        }),
                        text:new Text({
                            text: size.toString(),
                            scale:2,
                            fill: new Fill({
                                color: '#fdd506',
                            }),
                        })
                    });
                    that.styleCacheAir[size] = style;
                }
                return style;
            },
        })

        this.map.getMap().addLayer(this.waterCollectionClusterLayer)
        this.map.getMap().addLayer(this.airVehicleClusterLayer)
        //this.map.getMap().addLayer(this.airVehicleLayer);
        //this.map.getMap().addLayer(this.suCukuruLayer);
        this.map.getMap().addLayer(this.havaAraciLayerHistory);

        this.map.getMap().on('click', (e) => {
            that.waterCollectionClusterLayer.getFeatures(e.pixel).then((clickedFeatures:any) => {
                if (clickedFeatures.length) {
                    const features = clickedFeatures[0].get('features');
                    if (features.length > 1) {
                        const extent = boundingExtent(
                            features.map((r:any) => r.getGeometry().getCoordinates())
                        );
                        this.map.getMap().getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50]});
                    }
                }
            });
            that.airVehicleClusterLayer.getFeatures(e.pixel).then((clickedFeatures:any) => {
                if (clickedFeatures.length) {
                    const features = clickedFeatures[0].get('features');
                    if (features.length > 1) {
                        const extent = boundingExtent(
                            features.map((r:any) => r.getGeometry().getCoordinates())
                        );
                        this.map.getMap().getView().fit(extent, {duration: 1000, padding: [50, 50, 50, 50]});
                    }
                }
            });
        });
        let that = this;
        this.map.select.on('select', function (selected: any) {
            if (selected.selected.length > 0) {
                if (selected.deselected.length > 0) {
                    that.clearHistory()
                }
                that.map.getMap().getLayers().forEach(f => {
                    if (f instanceof VectorLayer && f.getClassName() == 'airVehicles') {
                        if (f.getVisible()) {
                            that.addRouteHistory(that.route)
                        }
                    }
                })
            } else {
                that.listenerKey.forEach(f => unByKey(f))
                that.clearHistory()
            }
        });
        this.planeSymbol = new Style({
            image: new Icon({
                anchor: [0.5, 20],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                rotateWithView: true,
                rotation: 0,
                src: '/assets/images/heli-32.png',//https://cdn-icons-png.flaticon.com/64/1048/1048346.png
            }),
        });
        this.trackASymbol = new Style({
            image: new Icon({
                anchor: [0.5, 40],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                rotateWithView: true,
                rotation: 0,
                scale: 0.5,
                src: '/assets/images/prop-64.png',//https://cdn-icons-png.flaticon.com/32/1783/1783356.png  /assets/images/propeller-64.png
            }),
        });
        this.startSymbol = new Style({
            image: new Icon({
                anchor: [0.5, 15],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                rotateWithView: true,
                rotation: 0,
                src: '/assets/images/heliport-32.png',//https://cdn-icons-png.flaticon.com/32/2850/2850722.png
            }),
        });

        this.waterCollectionStyle = new Style({
            image: new Icon({
                anchor: [0.5, 15],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                rotateWithView: true,
                scale:0.7,
                rotation: 0,
                src: '/assets/images/lake-32.png',//https://cdn-icons-png.flaticon.com/32/11015/11015750.png
            }),
        });
    }

    clearHistory() {
        this.map.getMap().getLayers().forEach(f => {
            if (f instanceof VectorLayer && f.getClassName() == 'havaAraclariHistory') {
                f.getSource().clear()
            }
        })
    }

    addWaterCollectionPits(points: number[], attr: any) {
        let waterCollection = new Feature({
            geometry: new Point(points),
        })
        waterCollection.setProperties(attr)
        waterCollection.setStyle(this.waterCollectionStyle);
        this.suCukuruSource.addFeatures([waterCollection])
    }

    addAirVehicles(points: number[], attr: any) {
        let airVehicle = new Feature({
            geometry: new Point(points),
        })
        airVehicle.setProperties(attr)
        airVehicle.setStyle(this.planeSymbol);
        this.airVehicleSource.addFeatures([airVehicle])
    }

    addRoute() {
        this.route = new LineString([
            [
                30.233669341430137,
                40.945393397849045
            ],
            [
                30.233669341430137,
                40.945393397849045
            ],
            [
                30.286423009629537,
                40.945393397849045
            ],
            [
                30.3743471315775,
                40.945393397849045
            ],
            [
                30.444686697459,
                40.92781554106995
            ],
            [
                30.602950385288466,
                40.92781554106995
            ],
            [
                30.6381194974214,
                40.91023768429085
            ],
            [
                30.83155363899943,
                40.875080629628144
            ],
            [
                30.95464687308033,
                40.875080629628144
            ],
            [
                31.07774010716123,
                40.875080629628144
            ],
            [
                31.130495116976263,
                40.875080629628144
            ],
            [
                31.165664229109197,
                40.875080629628144
            ],
            [
                31.30634336087219,
                40.875080629628144
            ],
            [
                31.323927916938658,
                40.857502772849045
            ],
            [
                31.37668292675369,
                40.857502772849045
            ],
            [
                31.429436594953092,
                40.80476786140724
            ],
            [
                31.482191604768126,
                40.787190004628144
            ],
            [
                31.534946614583156,
                40.769612147849045
            ],
            [
                31.57011572671609,
                40.75203429106995
            ],
            [
                31.587700282782556,
                40.75203429106995
            ],
            [
                31.622870736531123,
                40.73445643429085
            ],
            [
                31.69320896079699,
                40.71687723640724
            ],
            [
                31.781133082744958,
                40.64656580929085
            ],
            [
                31.81630353649352,
                40.64656580929085
            ],
            [
                31.904227658441485,
                40.593830897849045
            ],
            [
                31.95698132664089,
                40.593830897849045
            ],
            [
                32.02732089252239,
                40.55867518429085
            ],
            [
                32.13282957053682,
                40.523518129628144
            ],
            [
                32.13282957053682,
                40.505940272849045
            ],
            [
                32.255924146233355,
                40.47078455929085
            ],
            [
                32.308677814432755,
                40.435627504628144
            ],
            [
                32.361432824247785,
                40.418049647849045
            ],
            [
                32.39660193638072,
                40.38289393429085
            ],
            [
                32.414187834062815,
                40.347736879628144
            ],
            [
                32.44935694619575,
                40.330159022849045
            ],
            [
                32.48452605832868,
                40.31258116606995
            ],
            [
                32.48452605832868,
                40.29500330929085
            ],
            [
                32.519696512077246,
                40.259846254628144
            ],
            [
                32.55486562421018,
                40.242268397849045
            ],
            [
                32.57245018027665,
                40.22469054106995
            ],
            [
                32.57245018027665,
                40.20711268429085
            ],
            [
                32.59003607795874,
                40.18953348640724
            ],
            [
                32.60762063402522,
                40.18953348640724
            ],
            [
                32.64278974615815,
                40.154377772849045
            ],
            [
                32.66037430222462,
                40.11922205929085
            ],
            [
                32.730713868106115,
                40.066487147849045
            ],
            [
                32.730713868106115,
                40.03133143429085
            ],
            [
                32.74829842417258,
                40.01375223640724
            ],
            [
                32.76588432185468,
                39.96101866606995
            ],
            [
                32.783468877921145,
                39.908283754628144
            ],
            [
                32.80105343398761,
                39.890705897849045
            ],
            [
                32.80105343398761,
                39.87312804106995
            ],
            [
                32.81863799005408,
                39.76765955929085
            ],
            [
                32.81863799005408,
                39.732502504628144
            ],
            [
                32.81863799005408,
                39.644611879628144
            ],
            [
                32.836222546120545,
                39.57429911140724
            ],
            [
                32.836222546120545,
                39.556721254628144
            ],
            [
                32.836222546120545,
                39.43367491606995
            ],
            [
                32.836222546120545,
                39.380940004628144
            ],
            [
                32.836222546120545,
                39.32820643429085
            ],
            [
                32.836222546120545,
                39.275471522849045
            ],
            [
                32.836222546120545,
                39.22273661140724
            ],
            [
                32.836222546120545,
                39.187580897849045
            ],
            [
                32.836222546120545,
                39.17000304106995
            ],
            [
                32.836222546120545,
                39.13484598640724
            ],
            [
                32.836222546120545,
                39.06453455929085
            ],
            [
                32.836222546120545,
                39.04695536140724
            ],
            [
                32.81863799005408,
                38.99422179106995
            ],
            [
                32.80105343398761,
                38.941486879628144
            ],
            [
                32.783468877921145,
                38.90633116606995
            ],
            [
                32.74829842417258,
                38.853596254628144
            ],
            [
                32.730713868106115,
                38.81844054106995
            ],
            [
                32.677960199906714,
                38.748127772849045
            ],
            [
                32.60762063402522,
                38.64265929106995
            ],
            [
                32.55486562421018,
                38.60750223640724
            ],
            [
                32.519696512077246,
                38.572346522849045
            ],
            [
                32.50211195601078,
                38.572346522849045
            ],
            [
                32.44935694619575,
                38.484455897849045
            ],
            [
                32.37901738031425,
                38.396565272849045
            ],
            [
                32.32626371211485,
                38.34383036140724
            ],
            [
                32.29109325836629,
                38.326252504628144
            ],
            [
                32.23833959016689,
                38.27351893429085
            ],
            [
                32.220753692484784,
                38.25593973640724
            ],
            [
                32.168000024285384,
                38.238361879628144
            ],
            [
                32.15041546821892,
                38.20320616606995
            ],
            [
                32.115245014470354,
                38.20320616606995
            ],
            [
                32.08007590233742,
                38.20320616606995
            ],
            [
                32.04490544858886,
                38.18562830929085
            ],
            [
                32.02732089252239,
                38.18562830929085
            ],
            [
                32.009736336455916,
                38.18562830929085
            ],
            [
                31.974567224322985,
                38.16804911140724
            ],
            [
                31.939396770574422,
                38.16804911140724
            ],
            [
                31.886643102375018,
                38.16804911140724
            ],
            [
                31.833888092559988,
                38.16804911140724
            ],
            [
                31.798718980427054,
                38.16804911140724
            ],
            [
                31.76354852667849,
                38.16804911140724
            ],
            [
                31.745963970612024,
                38.16804911140724
            ],
            [
                31.728379414545557,
                38.16804911140724
            ],
            [
                31.69320896079699,
                38.16804911140724
            ],
            [
                31.69320896079699,
                38.220784022849045
            ],
            [
                31.658039848664057,
                38.27351893429085
            ],
            [
                31.658039848664057,
                38.29109679106995
            ],
            [
                31.64045529259759,
                38.36140955929085
            ],
            [
                31.64045529259759,
                38.396565272849045
            ],
            [
                31.64045529259759,
                38.43172098640724
            ],
            [
                31.64045529259759,
                38.484455897849045
            ],
            [
                31.64045529259759,
                38.53719080929085
            ],
            [
                31.64045529259759,
                38.572346522849045
            ],
            [
                31.64045529259759,
                38.60750223640724
            ],
            [
                31.64045529259759,
                38.62508143429085
            ],
            [
                31.64045529259759,
                38.64265929106995
            ],
            [
                31.64045529259759,
                38.660237147849045
            ],
            [
                31.658039848664057,
                38.677815004628144
            ],
            [
                31.675624404730524,
                38.677815004628144
            ],
            [
                31.71079485847909,
                38.677815004628144
            ],
            [
                31.76354852667849,
                38.677815004628144
            ],
            [
                31.781133082744958,
                38.677815004628144
            ],
            [
                31.851472648626455,
                38.69539286140724
            ],
            [
                31.886643102375018,
                38.69539286140724
            ],
            [
                31.921812214507955,
                38.69539286140724
            ],
            [
                31.95698132664089,
                38.69539286140724
            ],
            [
                31.974567224322985,
                38.69539286140724
            ],
            [
                32.08007590233742,
                38.69539286140724
            ],
            [
                32.09766045840389,
                38.69539286140724
            ],
            [
                32.168000024285384,
                38.69539286140724
            ],
            [
                32.20316913641832,
                38.69539286140724
            ],
            [
                32.23833959016689,
                38.69539286140724
            ],
            [
                32.255924146233355,
                38.677815004628144
            ],
            [
                32.29109325836629,
                38.677815004628144
            ],
            [
                32.34384826818132,
                38.64265929106995
            ],
            [
                32.361432824247785,
                38.60750223640724
            ],
            [
                32.39660193638072,
                38.589924379628144
            ],
            [
                32.414187834062815,
                38.572346522849045
            ],
            [
                32.44935694619575,
                38.51961161140724
            ],
            [
                32.466941502262216,
                38.484455897849045
            ],
            [
                32.466941502262216,
                38.46687804106995
            ],
            [
                32.466941502262216,
                38.43172098640724
            ],
            [
                32.48452605832868,
                38.414143129628144
            ],
            [
                32.50211195601078,
                38.396565272849045
            ],
            [
                32.50211195601078,
                38.37898741606995
            ],
            [
                32.519696512077246,
                38.34383036140724
            ],
            [
                32.519696512077246,
                38.308674647849045
            ],
            [
                32.53728106814371,
                38.27351893429085
            ],
            [
                32.53728106814371,
                38.25593973640724
            ],
            [
                32.53728106814371,
                38.220784022849045
            ],
            [
                32.53728106814371,
                38.20320616606995
            ],
            [
                32.53728106814371,
                38.150471254628144
            ],
            [
                32.53728106814371,
                38.11531554106995
            ],
            [
                32.53728106814371,
                38.09773768429085
            ],
            [
                32.53728106814371,
                38.08015848640724
            ],
            [
                32.53728106814371,
                38.045002772849045
            ],
            [
                32.53728106814371,
                38.02742491606995
            ],
            [
                32.53728106814371,
                38.00984705929085
            ],
            [
                32.53728106814371,
                37.957112147849045
            ],
            [
                32.53728106814371,
                37.93953429106995
            ],
            [
                32.50211195601078,
                37.90437723640724
            ],
            [
                32.48452605832868,
                37.886799379628144
            ],
            [
                32.48452605832868,
                37.869221522849045
            ],
            [
                32.466941502262216,
                37.85164366606995
            ],
            [
                32.44935694619575,
                37.83406580929085
            ],
            [
                32.414187834062815,
                37.798908754628144
            ],
            [
                32.37901738031425,
                37.798908754628144
            ],
            [
                32.32626371211485,
                37.781330897849045
            ],
            [
                32.27350870229982,
                37.76375304106995
            ],
            [
                32.255924146233355,
                37.74617518429085
            ],
            [
                32.220753692484784,
                37.693440272849045
            ],
            [
                32.168000024285384,
                37.693440272849045
            ],
            [
                32.15041546821892,
                37.693440272849045
            ],
            [
                32.08007590233742,
                37.67586241606995
            ],
            [
                32.02732089252239,
                37.65828455929085
            ],
            [
                31.992151780389452,
                37.65828455929085
            ],
            [
                31.939396770574422,
                37.65828455929085
            ],
            [
                31.869057204692922,
                37.64070536140724
            ],
            [
                31.81630353649352,
                37.623127504628144
            ],
            [
                31.76354852667849,
                37.605549647849045
            ],
            [
                31.728379414545557,
                37.605549647849045
            ],
            [
                31.64045529259759,
                37.605549647849045
            ],
            [
                31.534946614583156,
                37.605549647849045
            ],
            [
                31.46460704870166,
                37.605549647849045
            ],
            [
                31.411852038886625,
                37.605549647849045
            ],
            [
                31.323927916938658,
                37.605549647849045
            ],
            [
                31.30634336087219,
                37.605549647849045
            ],
            [
                31.130495116976263,
                37.605549647849045
            ],
            [
                31.07774010716123,
                37.605549647849045
            ],
            [
                31.007401882895362,
                37.605549647849045
            ],
            [
                30.919477760947395,
                37.605549647849045
            ],
            [
                30.813967741317335,
                37.605549647849045
            ],
            [
                30.585365829222,
                37.605549647849045
            ],
            [
                30.479857151207565,
                37.623127504628144
            ],
            [
                30.46227125352547,
                37.64070536140724
            ],
            [
                30.286423009629537,
                37.67586241606995
            ],
            [
                30.180914331615103,
                37.74617518429085
            ],
            [
                30.0578210975342,
                37.781330897849045
            ],
            [
                29.987481531652705,
                37.81648661140724
            ],
            [
                29.934726521837675,
                37.81648661140724
            ],
            [
                29.82921784382324,
                37.85164366606995
            ],
            [
                29.794048731690307,
                37.886799379628144
            ],
            [
                29.723709165808806,
                37.90437723640724
            ],
            [
                29.70612460974234,
                37.93953429106995
            ],
            [
                29.65336959992731,
                37.93953429106995
            ],
            [
                29.60061593172791,
                37.99226786140724
            ],
            [
                29.58303003404581,
                38.00984705929085
            ],
            [
                29.565445477979342,
                38.02742491606995
            ],
            [
                29.530276365846408,
                38.062580629628144
            ],
            [
                29.495105912097845,
                38.11531554106995
            ],
            [
                29.477521356031378,
                38.132893397849045
            ],
            [
                29.44235224389844,
                38.18562830929085
            ],
            [
                29.44235224389844,
                38.20320616606995
            ],
            [
                29.407181790149878,
                38.220784022849045
            ],
            [
                29.372012678016944,
                38.326252504628144
            ],
            [
                29.354428121950477,
                38.34383036140724
            ],
            [
                29.319257668201914,
                38.396565272849045
            ],
            [
                29.301673112135447,
                38.46687804106995
            ],
            [
                29.301673112135447,
                38.484455897849045
            ],
            [
                29.266504000002513,
                38.55476866606995
            ],
            [
                29.248919443936042,
                38.62508143429085
            ],
            [
                29.231333546253946,
                38.677815004628144
            ],
            [
                29.21374899018748,
                38.73054991606995
            ],
            [
                29.21374899018748,
                38.765705629628144
            ],
            [
                29.178579878054542,
                38.853596254628144
            ],
            [
                29.178579878054542,
                38.923909022849045
            ],
            [
                29.160995321988075,
                38.95906473640724
            ],
            [
                29.108240312173045,
                39.011799647849045
            ],
            [
                29.090655756106578,
                39.06453455929085
            ],
            [
                29.07307120004011,
                39.13484598640724
            ],
            [
                29.07307120004011,
                39.15242518429085
            ],
            [
                29.055485302358015,
                39.205158754628144
            ],
            [
                29.037900746291548,
                39.25789366606995
            ],
            [
                29.02031619022508,
                39.275471522849045
            ],
            [
                28.985147078092147,
                39.34578429106995
            ],
            [
                28.967561180410048,
                39.39851786140724
            ],
            [
                28.967561180410048,
                39.41609705929085
            ],
            [
                28.94997662434358,
                39.451252772849045
            ],
            [
                28.932392068277114,
                39.50398768429085
            ],
            [
                28.914807512210647,
                39.556721254628144
            ],
            [
                28.89722295614418,
                39.556721254628144
            ],
            [
                28.862052502395613,
                39.627034022849045
            ],
            [
                28.862052502395613,
                39.644611879628144
            ],
            [
                28.844467946329146,
                39.66218973640724
            ],
            [
                28.82688339026268,
                39.69734679106995
            ],
            [
                28.809298834196213,
                39.69734679106995
            ],
            [
                28.809298834196213,
                39.75008036140724
            ],
            [
                28.809298834196213,
                39.76765955929085
            ],
            [
                28.791712936514116,
                39.802815272849045
            ],
            [
                28.77412838044765,
                39.820393129628144
            ],
            [
                28.756543824381183,
                39.87312804106995
            ],
            [
                28.756543824381183,
                39.890705897849045
            ],
            [
                28.756543824381183,
                39.908283754628144
            ],
            [
                28.738959268314716,
                39.92586161140724
            ],
            [
                28.72137471224825,
                39.96101866606995
            ],
            [
                28.703788814566153,
                39.96101866606995
            ],
            [
                28.686204258499686,
                39.996174379628144
            ],
            [
                28.686204258499686,
                40.03133143429085
            ],
            [
                28.65103514636675,
                40.04890929106995
            ],
            [
                28.59828013655172,
                40.066487147849045
            ],
            [
                28.58069558048525,
                40.066487147849045
            ],
            [
                28.563111024418784,
                40.084065004628144
            ],
            [
                28.51035601460375,
                40.10164286140724
            ],
            [
                28.45760234640435,
                40.13679991606995
            ],
            [
                28.440016448722254,
                40.154377772849045
            ],
            [
                28.352092326774287,
                40.154377772849045
            ],
            [
                28.246583648759852,
                40.18953348640724
            ],
            [
                28.176244082878355,
                40.18953348640724
            ],
            [
                28.15865952681189,
                40.20711268429085
            ],
            [
                28.123490414678955,
                40.20711268429085
            ],
            [
                28.035566292730987,
                40.20711268429085
            ],
            [
                28.01798173666452,
                40.20711268429085
            ],
            [
                28.000395838982424,
                40.20711268429085
            ],
            [
                27.982811282915957,
                40.20711268429085
            ],
            [
                27.947642170783023,
                40.20711268429085
            ],
            [
                27.912471717034457,
                40.20711268429085
            ],
            [
                27.89488716096799,
                40.20711268429085
            ],
            [
                27.877302604901523,
                40.20711268429085
            ],
            [
                27.824547595086493,
                40.20711268429085
            ],
            [
                27.806963039020026,
                40.18953348640724
            ],
            [
                27.771793926887092,
                40.171955629628144
            ],
            [
                27.771793926887092,
                40.154377772849045
            ],
            [
                27.754209370820625,
                40.13679991606995
            ],
            [
                27.71903891707206,
                40.11922205929085
            ],
            [
                27.71903891707206,
                40.10164286140724
            ],
            [
                27.683869804939125,
                40.084065004628144
            ],
            [
                27.666285248872658,
                40.066487147849045
            ]
        ]);
        this.lastMarker = new Feature({
            geometry: new Point(this.route.getLastCoordinate())
        })
        this.lastMarker.setProperties({"il": ["Çanakkale"]})
        this.lastMarker.setProperties({"Tip": "Helikopter"})
        this.lastMarker.setStyle(this.planeSymbol)

        let vector = new VectorLayer({
            source: new VectorSource({
                features: [this.lastMarker]
            }),
            visible: false,
            className: 'havaAraclari'
        })
        this.map.getMap().addLayer(vector)
        //this.addFeatures([this.lastMarker]);
        //this.addRouteHistory(this.route)
    }

    addRouteHistory(route: any) {
        this.feature = new Feature({
            geometry: route,
        })

        this.startMarker = new Feature({
            geometry: new Point(route.getFirstCoordinate()),
        })

        this.startMarker.setStyle(this.startSymbol)

        this.position = this.startMarker.getGeometry()!.clone();
        this.geoMarker = new Feature({
            type: 'geoMarker',
            geometry: this.position,
        });
        this.geoMarker.setStyle(this.trackASymbol)
        this.map.getMap().getLayers().forEach(f => {
            if (f instanceof VectorLayer && f.getClassName() == 'havaAraclariHistory') {
                f.setVisible(true)
                f.getSource().addFeatures([this.startMarker, this.geoMarker, this.feature]);
            }
        })
    }

    removeFeatures(featureList: any[]) {
        this.map.getMap().getLayers().forEach(f => {
            if (f instanceof VectorLayer && f.getClassName() == 'ol-layer') {
                this.havaAraciLayer = f;
                this.havaAraciLayer.getSource().removeFeatures(featureList);
            }
        })
    }

    moveFeature(event: any, that: any) {
        let speed = that.speedInput / 60;
        let time = event.frameState.time;
        let elapsedTime = time - that.lastTime;
        that.distance = (that.distance + (speed * elapsedTime) / 1e6) % 2
        if (that.distance > 1)
            that.distance = 0
        that.lastTime = time;
        let currentCoordinate = that.route.getCoordinateAt(that.distance > 1 ? 2 - that.distance : that.distance)
        that.position.setCoordinates(currentCoordinate);
        if (that.heartBeat) {
            this.speedInput = 20
            that.map.getMap().getView().setCenter(that.position.getCoordinates())//TODO ANLIK TAKİP İÇİN
            that.map.getMap().getView().setZoom(that.map.getMap().getView().getMaxZoom() - 4)
        }
        let vectorContext = getVectorContext(event);
        let style = that.trackASymbol;
        style.getImage().setRotation(style.getImage().getRotation() + 0.3)
        //let styleVector = that.trackASymbol;
        vectorContext.setStyle(style);
        vectorContext.drawGeometry(that.position)

        that.map.getMap().render()
    }

    startAnimation() {
        this.animating = true;
        this.lastTime = Date.now()
        const that = this;
        this.listenerKey.push(this.havaAraciLayerHistory.on('postrender', function (evt) {
            return that.moveFeature(evt, that)
        }))
        this.geoMarker.setGeometry(undefined);
    }

    stopAnimation() {
        this.geoMarker.setGeometry(this.position)
        const that = this;
        this.listenerKey.forEach(f => unByKey(f))
    }


}
