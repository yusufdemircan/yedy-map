import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingMapComponent } from './tracking-map.component';

describe('TrackingMapComponent', () => {
  let component: TrackingMapComponent;
  let fixture: ComponentFixture<TrackingMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
