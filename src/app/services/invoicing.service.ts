import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoicingService {

  constructor(
    private http : HttpClient
  ) {}

  getInvoiceList()
  {
    return this.http.get('https://frontlineebillingassistantapi.azurewebsites.net/api/Invoice/GetAllInvoices');
  }
  getInvoiceDetail(invoiceId: any)
  {
    return this.http.get('https://frontlineebillingassistantapi.azurewebsites.net/api/InvoiceLineItem/GetInvoiceLineItemsById', {params:{Id: invoiceId}});
  }
}
