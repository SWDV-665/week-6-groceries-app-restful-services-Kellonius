import { Injectable, ɵConsole } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GroceriesServiceService {

  items: any = []

  dataChanged$: Observable<boolean>

  private dataChangedSubject: Subject<boolean>

  baseURL = "http://localhost:8080"



  constructor(public http: HttpClient) {
    this.dataChangedSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangedSubject.asObservable();
   }

   getItems(): Observable<object[]> {
     return this.http.get<object[]>(this.baseURL + '/api/groceries');
   }

   private extractData(res: Response) {
     let body = res;
     return body || {}
   }

   private handleError(error: Response | any){
     let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ?  error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
   }

  removeItem(item) {
    this.http.delete(this.baseURL + '/api/groceries/' + item).subscribe();
    this.dataChangedSubject.next(true);
  }

  addItem(data) {
   this.http.post(this.baseURL + '/api/groceries', data).subscribe(res => {
     this.items = res;
     this.dataChangedSubject.next(true);
   })
  }

  editItem(item, index) {
    console.log(index)
    this.http.put(this.baseURL + '/api/groceries/' + index, item).subscribe(res => {
      this.items = res;
      this.dataChangedSubject.next(true);
    })
  }
}
