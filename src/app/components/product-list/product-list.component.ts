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

  productList: Product[] = [];
  hasCategoryId: boolean = false;
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  theKeyword: any;

  //Pagination Properties
  thePageNumber: number = 1;
  thePageSize: number = 12;
  theTotalElements: number = 0;


  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => { this.listProducts(); });

  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.searchProductByNameContaining();
    } else {
      this.getProductList();
    }
  }

  getProductList() {

    this.hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (this.hasCategoryId) {
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      this.currentCategoryId = 1;
    }

    //Product category changed
    // compare Current and Previous catagory ID, if category changed then set page to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    //console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
    
    this. getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId);    

  } 

  getAllPoductsList() {
    this.productService.getProductList().subscribe((responseData) => { this.productList = responseData });
  }
  getSearchedPoductsList(categoryId: number) {
    this.productService.getProductSearchList(categoryId).subscribe((responseData) => { this.productList = responseData });
  }
  searchProductByNameContaining() {
    this.theKeyword = this.route.snapshot.paramMap.get('keyword');
    this.productService.searchByProductNameContaining(this.theKeyword).subscribe(data => this.productList = data);
  }
  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number) {
    this.productService.getProductListPaginate(thePage, thePageSize, theCategoryId).subscribe(
      (data) => {
        this.productList = data._embedded.products;
        this.thePageNumber = data.page.number + 1; //Angular pagination starts from 1: SpringBoot Pagination Starts from 0:
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements; //console.log("theTotalElements = " + data.page.totalElements );
      }
    );
  }
  updatePageSize(myPageSelect:string){
    this.thePageSize = Number(myPageSelect);
    this.thePageNumber = 1;
    this.listProducts();
  }
  

}

