import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapStatusBarComponent } from './map-status-bar.component';

describe('MapStatusBarComponent', () => {
  let component: MapStatusBarComponent;
  let fixture: ComponentFixture<MapStatusBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapStatusBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
