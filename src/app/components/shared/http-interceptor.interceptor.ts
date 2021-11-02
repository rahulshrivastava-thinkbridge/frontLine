import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
  HttpResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { UserComponentRegistry } from '@ag-grid-community/core';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // return next.handle(request);
    const token = localStorage.getItem('token');
    if (token) {     
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=utf-8'
        }
      }); 
    }
    return next.handle(request);
  }

}
