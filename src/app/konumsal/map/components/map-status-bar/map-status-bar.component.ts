import {Component, Input, OnInit} from '@angular/core';
import {MapService} from "../../services/map.service";
import {CustomMap} from "../../models/CustomMap";
import {MenuItem} from "primeng/api";
import {mapEditTabMenuItem, mapEditToolbarsItem} from "../../consts/map-edit-tab-menu-item";
import { FeatureLike } from 'ol/Feature';

@Component({
    selector: 'konumsal-map-status-bar',
    templateUrl: './map-status-bar.component.html',
    styleUrls: ['./map-status-bar.component.scss']
})
export class MapStatusBarComponent implements OnInit {
    @Input() map!: CustomMap;
    items!: any[];
    tabItems!: MenuItem[];
    activeItem!: MenuItem;
    selectedDrop: any = 'None';
    isDrawingTool: boolean = false;
    isActiveEditing: boolean = false;

    constructor(private mapService: MapService) {
    }

    ngOnInit(): void {
        this.tabItems = mapEditTabMenuItem;
        this.items = mapEditToolbarsItem;
        this.activeItem = mapEditTabMenuItem[0];
    }

    onActiveItemChange(event: any) {
        if(this.selectedDrop==='None')
            this.map.select.setActive(false)
        else this.map.select.setActive(true)

        this.map.getMap().removeEventListener('pointermove', this.map.pointerMoveHandler);
        if (event.value === 'KML') {
            console.log(this.map.source.getFeatures())
            const that = this;
            this.map.getMap().on('pointermove', function (event) {
                if (event.dragging)
                    return;
                const pixel = that.map.getMap().getEventPixel(event.originalEvent);
                that.displayFeatures(pixel);

            });
        } else if (event.value === 'PDF' || event.value === 'PNG')
            this.exportMap(event.value)
        else if (event.value === 'line' || event.value == 'area') {
            this.map.addMeasurementInteraction(event.value, this.map.getMap());
            //this.map.getMap().on('pointermove',this.map.pointerMoveHandler);
        } else {
            this.selectedDrop = event.value;
            this.addInteraction()
            this.activeItem = event;
        }

    }

    exportMap(type: string) {
        this.map.printMap(this.map.getMap(), type)
    }

    addInteraction() {
        this.map.addInteractionDraw(this.selectedDrop)
    }

    changedPanel(event: any) {
        this.defaultOpt()
        const i = event.originalEvent.target;
        console.log(i.innerText)
        if (i.innerText === 'Çizim')
            this.isDrawingTool = true
        if (i.innerText === 'Düzenleme') {
            this.map.addInteractionDraw(this.selectedDrop)
            this.isActiveEditing = true
            this.map.activatedEditing(this.isActiveEditing);
        }

    }

    defaultOpt() {
        this.isDrawingTool = false
        this.selectedDrop = 'None'
        this.addInteraction();
        this.isActiveEditing = false
        this.map.activatedEditing(false);
    }


    displayFeatures(pixel: any) {
        const features: FeatureLike[] = [];
        this.map.getMap().forEachFeatureAtPixel(pixel, function (feature) {
            features.push(feature);

        })
        console.log(features);
    }

}
