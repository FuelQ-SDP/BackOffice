import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverySchedulesComponent } from './delivery-schedules.component';

describe('DeliverySchedulesComponent', () => {
  let component: DeliverySchedulesComponent;
  let fixture: ComponentFixture<DeliverySchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverySchedulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverySchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
