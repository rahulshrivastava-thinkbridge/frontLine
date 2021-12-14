import { Injectable } from '@angular/core';
import { HttpCommonService } from './http-common.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicingService {

  constructor(private httpCommonService: HttpCommonService) { }

  invoicePages(objReqBody) {
    return this.httpCommonService.post('invoice/listing/paged', objReqBody)
  }

  getInvoiceDetails(InvoiceID: any) {
    return this.httpCommonService.get('invoicelineitems/listing', { params: { Id: InvoiceID } });
  }

  getInvoiceDataDetails(InvoiceID: any) {
    return this.httpCommonService.get('invoice/details', { params: { Id: InvoiceID } });
  }

  invoiceLineitemsUpdate(objReqBody: any) {
    return this.httpCommonService.post('invoicelineitems/update', objReqBody)
  }

}



// this.httpClient.get('https://www.userdomain.com/api_name/data/' + this.id);

