import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingZoneComponent } from './drawing-zone.component';

describe('DrawingZoneComponent', () => {
  let component: DrawingZoneComponent;
  let fixture: ComponentFixture<DrawingZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
