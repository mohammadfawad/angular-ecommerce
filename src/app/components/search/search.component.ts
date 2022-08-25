import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private productService:ProductService, private router:Router) { }

  ngOnInit(): void {
  }

  searchProducts(searchKeyword:string){
    this.router.navigateByUrl('/search/' + searchKeyword);
  }

}
