import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeZoneComponent } from './home-zone.component';

describe('HomeZoneComponent', () => {
  let component: HomeZoneComponent;
  let fixture: ComponentFixture<HomeZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
