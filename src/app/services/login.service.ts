import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(objReqBody: any): Observable<any> {
    return this.http.post('https://frontlineebillingassistantapi.azurewebsites.net/api/Auth/login', objReqBody);
  }
  
}
