import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicingService {

  constructor(private http: HttpClient) { }

  getInvoiceList() {
    return this.http.get('https://frontlineebillingassistantapi.azurewebsites.net/api/Invoice/GetInvoiceGridResults');
  }

  getInvoiceDetail(invoiceId: any) {
    return this.http.get('https://frontlineebillingassistantapi.azurewebsites.net/api/InvoiceLineItem/GetInvoiceLineItemsById', { params: { Id: invoiceId } });
  }

}

