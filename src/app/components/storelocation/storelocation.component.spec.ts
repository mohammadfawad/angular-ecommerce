import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorelocationComponent } from './storelocation.component';

describe('StorelocationComponent', () => {
  let component: StorelocationComponent;
  let fixture: ComponentFixture<StorelocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorelocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorelocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
