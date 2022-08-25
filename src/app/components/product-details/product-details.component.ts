import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product:Product = new Product;
  productId:number = 0;

  constructor(private productService:ProductService, private route:ActivatedRoute) { }

  ngOnInit(): void {

    if(this.route.snapshot.paramMap.has('id')){
      this.productId = Number(this.route.snapshot.paramMap.get('id'));
      this.route.paramMap.subscribe(() => this.getProductDetails(this.productId)) ;
    }
     
     
    
  }
  getProductDetails(theProductId:number){
    
    this.productService.getProductById(theProductId).subscribe((data) => this.product = data);
    
  }

}
