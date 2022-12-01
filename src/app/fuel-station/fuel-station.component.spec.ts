import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStationComponent } from './fuel-station.component';

describe('FuelStationComponent', () => {
  let component: FuelStationComponent;
  let fixture: ComponentFixture<FuelStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuelStationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
