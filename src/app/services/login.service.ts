import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCommonService } from './http-common.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpCommonService: HttpCommonService) { }

  login(objReqBody: any): Observable<any> {
    return this.httpCommonService.post('auth/login', objReqBody);
  }

}
