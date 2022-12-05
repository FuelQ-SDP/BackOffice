import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePumpersComponent } from './manage-pumpers.component';

describe('ManagePumpersComponent', () => {
  let component: ManagePumpersComponent;
  let fixture: ComponentFixture<ManagePumpersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePumpersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePumpersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
