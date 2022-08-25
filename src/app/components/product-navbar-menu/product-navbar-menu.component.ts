import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-navbar-menu',
  templateUrl: './product-navbar-menu.component.html',
  styleUrls: ['./product-navbar-menu.component.css']
})
export class ProductNavbarMenuComponent implements OnInit {

  productCategories: ProductCategory[] =[];

  constructor(private productService:ProductService) { 
    
  }

  ngOnInit(): void {
    this.listProductCategories();
   
  }

  listProductCategories(){
    this.productService.getProductCategories().subscribe( (data) => { this.productCategories = data});
  }

}
