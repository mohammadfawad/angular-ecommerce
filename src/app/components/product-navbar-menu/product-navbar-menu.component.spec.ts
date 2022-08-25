import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNavbarMenuComponent } from './product-navbar-menu.component';

describe('ProductNavbarMenuComponent', () => {
  let component: ProductNavbarMenuComponent;
  let fixture: ComponentFixture<ProductNavbarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductNavbarMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductNavbarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
