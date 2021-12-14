import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
const serverAPI = environment.serverAPI;

@Injectable({
  providedIn: 'root'
})
export class HttpCommonService {

  constructor(private http: HttpClient) { }

  get(endpoint: any, params: any): Observable<any> {
    if (Object.keys(params).length) {
      return this.http.get(`${serverAPI}/${endpoint}`, params);
    } else {
      return this.http.get(`${serverAPI}/${endpoint}`);
    }
  }

  post(endpoint: any, params: any): Observable<any> {
    return this.http.post(`${serverAPI}/${endpoint}`, params);
  }

  put(endpoint: any, params: any) {
    return this.http.put(`${serverAPI}/${endpoint}`, params);
  }

}
