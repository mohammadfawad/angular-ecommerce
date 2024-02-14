import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '../common/state';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService { 

  private countriesUrl:string;
  private statesUrl:string;

  constructor(private httpClient:HttpClient) { 
    this.countriesUrl = environment.niqasayApiBaseUrl+'/countries';
    this.statesUrl = environment.niqasayApiBaseUrl+'/states/search/findByCountryCode?code=';
  }

  //Get Countries List
  getCountries(): Observable<Country[]>{
    const countriesListUrl: string = this.countriesUrl;
    return this.httpClient.get<GetResponseCountries>(countriesListUrl).pipe(
      map((response: GetResponseCountries) => response._embedded.countries)
    );
  }

  //Get States List
  getStates(counteryCode:string): Observable<State[]>{
    const statesByCounteryCodeUrl:string = this.statesUrl + counteryCode;
    return this.httpClient.get<GetResponseStates>(statesByCounteryCodeUrl).pipe(
      map((response: GetResponseStates) => response._embedded.states)
    );
  }

  //Start from any month upto 12 months
  getCraditCardMonths(startMonth: number):Observable<number[]>{
    let dataMonths:number[]=[];
    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      dataMonths.push(theMonth);
    }
    return of(dataMonths);
  }

  //Current year + 10 years range
  getCarditCardYears(): Observable<number[]>{
    let dataYears: number[] = [];
    const stratYear: number = new Date().getFullYear();
    const endYear: number = stratYear + 10;

    for(let theYear = stratYear; theYear <= endYear; theYear++){
      dataYears.push(theYear);
    }

    return of(dataYears);
  }
}

interface GetResponseStates{
  _embedded : {
    states : State[];
  }
}

interface GetResponseCountries{
  _embedded : {
    countries : Country[];
  }
}