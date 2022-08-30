import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

//Note : Always use const variable for All URL's inside Function to avoid String Additions in Base urls Declared Globally
  private productUrl: string;
  private searchUrl: string;
  private productCategoryUrl: string;
  private searchByProductNameContainingUrl: string;
  private searchProductById: string;
  private paginationUrl:string;

  constructor(private httpClient: HttpClient) {
    this.productUrl = 'http://localhost:8082/api/products?size=250';
    this.searchUrl = 'http://localhost:8082/api/products/search/findByCategoryId?id=';
    this.productCategoryUrl = 'http://localhost:8082/api/product-category';
    this.searchByProductNameContainingUrl = 'http://localhost:8082/api/products/search/findByNameContaining?name=';
    this.searchProductById = 'http://localhost:8082/api/products/';
    this.paginationUrl = 'http://localhost:8082/api/products/search/findByCategoryId?id=';
  }

  //Products List with Pagination
  getProductListPaginate(thePage:number, thePageSize:number, theCategoryId:number ): Observable<GetResponseProducts>{
    //http://localhost:8082/api/products/search/findByCategoryId?id=2&page=0&size=5
    const searchUrl = `${this.paginationUrl}${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`; 
    console.log(searchUrl);
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  //search By Product Name with Pagination
  searchByProductNameContainingPaginate(thePage:number, thePageSize:number, thekeyWord: string): Observable<GetResponseProducts>{
    //http://localhost:8082/api/products/search/findByNameContaining?name=mug&page=0&size=12
    const searchUrl = `${this.searchByProductNameContainingUrl}${thekeyWord}`
                    + `&page=${thePage}&size=${thePageSize}`; 
    console.log(searchUrl);
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductById(theProductId: number): Observable<Product> {
    const searchUrl = this.searchProductById + theProductId;
    return this.httpClient
      .get<Product>(searchUrl);
  }
//Pagination required in search 
  searchByProductNameContaining(thekeyWord: string): Observable<Product[]> {
    const searchUrl = this.searchByProductNameContainingUrl + thekeyWord;
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(
        map(
          (response: { _embedded: { products: any } }) =>
            response._embedded.products
        )
      );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    const searchUrl = this.productCategoryUrl;
    return this.httpClient
      .get<GetResponseProductCategory>(searchUrl)
      .pipe(
        map(
          (response: { _embedded: { productCategory: any } }) =>
            response._embedded.productCategory
        )
      );
  }

  getProductList(): Observable<Product[]> {
    const searchUrl = this.productUrl;
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(
        map(
          (response: { _embedded: { products: any } }) =>
            response._embedded.products
        )
      );
  }

  getProductSearchList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = this.searchUrl + theCategoryId;
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(
        map(
          (response: { _embedded: { products: any } }) =>
            response._embedded.products
        )
      );
  }

  getAllProducts(): Observable<any[]> {
    const searchUrl = this.productUrl;
    return this.httpClient.get<any[]>(searchUrl);
  }


}

interface GetResponseProducts {
  _embedded : {
    products: Product[];
  },
  page : {
    size : number,
    totalElements : number,
    totalPages : number,
    number : number
  }
}
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
