import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  //Pagination Properties
  thePageNumber:number = 1;
  thePageSize:number = 10;
  theTotalElements:number = 0;

  productList:Product[] = [];
  currentCategoryId:number = 0;
  theKeyword:any;

  constructor(private productService: ProductService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    
    if(this.route.snapshot.paramMap.has('keyword')){
      this.theKeyword = this.route.snapshot.paramMap.get('keyword');
      this.route.paramMap.subscribe(()=>{this.searchProductByNameContaining(this.theKeyword);});
    }else{
      this.route.paramMap.subscribe(()=>{this.getProductList();});
    }
    
  }

  getProductList(){

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId ){
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id')) ;
    }else{
      this.currentCategoryId =1;
    }

    this.route.paramMap.subscribe(()=>{
      this.getSearchedPoductsList(Number(this.currentCategoryId));
    });

  }

  getAllPoductsList(){
    this.productService.getProductList().subscribe((responseData)=>{this.productList = responseData});
  }
  getSearchedPoductsList(categoryId : number){
    this.productService.getProductSearchList(categoryId).subscribe((responseData)=>{this.productList = responseData});
  }
  searchProductByNameContaining(searchProductName:string){
    this.productService.searchByProductNameContaining(searchProductName).subscribe(data => this.productList = data);
  }
  getProductListPaginate(){
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
      (data) => {
        this.productList = data._embedded.products;
        this.thePageNumber = data.page.number + 1; //
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }

}

