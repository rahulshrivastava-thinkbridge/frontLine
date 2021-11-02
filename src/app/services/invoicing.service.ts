import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicingService {

  constructor(private http: HttpClient) { }

  getInvoiceList() {
    return this.http.get('https://frontlineebillingassistantapi.azurewebsites.net/api/invoice/listing');
  }

  getInvoiceDetail(invoiceId: any) {
    return this.http.get('https://frontlineebillingassistantapi.azurewebsites.net/api/InvoiceLineItem/GetInvoiceLineItemsById', { params: { Id: invoiceId } });
  }

  getInvoiceFilter(objReqBody) {
    return this.http.post('https://frontlineebillingassistantapi.azurewebsites.net/api/invoice/listing/filtered', objReqBody)
  }

  invoicePages(objReqBody) {
    return this.http.post('https://frontlineebillingassistantapi.azurewebsites.net/api/invoice/listing/paged', objReqBody)
  }

  getInvoiceDetails(InvoiceID: any) {
    return this.http.get('https://frontlineebillingassistantapi.azurewebsites.net/api/invoicelineitems/listing', { params: { Id: InvoiceID } });
  }

  getInvoiceDataDetails(InvoiceID: any) {
    return this.http.get('https://frontlineebillingassistantapi.azurewebsites.net/api/invoice/details', { params: { Id: InvoiceID } });
  }

}

