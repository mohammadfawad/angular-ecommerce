import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTiledViewComponent } from './product-tiled-view.component';

describe('ProductTiledViewComponent', () => {
  let component: ProductTiledViewComponent;
  let fixture: ComponentFixture<ProductTiledViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTiledViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTiledViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
