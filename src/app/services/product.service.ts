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

  getProductListPaginate(thePage:number, thePageSize:number, theCategoryId:number ): Observable<GetResponseProducts>{
    this.paginationUrl = this.paginationUrl + theCategoryId + '&page=' + thePage + '&size=' + thePageSize;
    return this.httpClient.get<GetResponseProducts>(this.paginationUrl);
  }

  getProductById(theProductId: number): Observable<Product> {
    return this.httpClient
      .get<Product>(this.searchProductById + theProductId);
  }

  searchByProductNameContaining(thekeyWord: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(this.searchByProductNameContainingUrl + thekeyWord)
      .pipe(
        map(
          (response: { _embedded: { products: any } }) =>
            response._embedded.products
        )
      );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.productCategoryUrl)
      .pipe(
        map(
          (response: { _embedded: { productCategory: any } }) =>
            response._embedded.productCategory
        )
      );
  }

  getProductList(): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(this.productUrl)
      .pipe(
        map(
          (response: { _embedded: { products: any } }) =>
            response._embedded.products
        )
      );
  }

  getProductSearchList(theCategoryId: number): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(this.searchUrl + theCategoryId)
      .pipe(
        map(
          (response: { _embedded: { products: any } }) =>
            response._embedded.products
        )
      );
  }

  getAllProducts(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.productUrl);
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
  };
}
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
