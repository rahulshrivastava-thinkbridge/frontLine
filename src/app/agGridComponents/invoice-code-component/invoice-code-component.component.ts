import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-code-component',
  templateUrl: './invoice-code-component.component.html',
  styleUrls: ['./invoice-code-component.component.scss']
})
export class InvoiceCodeComponentComponent implements ICellRendererAngularComp {

  params : any;

  agInit(params) {
    this.params = params;
  }

  sendMsgToParent(text,node)
  {
    this.params.context.componentParent.sendMsg('', node);
  }

  refresh()
  {
    return false;
  }

}
