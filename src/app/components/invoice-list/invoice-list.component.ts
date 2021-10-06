import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AllCommunityModules, GridOptions, Module } from '@ag-grid-community/all-modules';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { InvoicingService } from 'src/app/services/invoicing.service';
import { InvoiceCodeComponentComponent } from 'src/app/agGridComponents/invoice-code-component/invoice-code-component.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  @ViewChild('agGridParentDiv', {read: ElementRef}) public agGridDiv;

  public modules : Module[] = [...AllCommunityModules, ...[SetFilterModule, MenuModule]]
  public agGridOption: GridOptions;
  public rowData     : any;
  public gridApi: any;
  public apiSuccessFull: boolean;

  public sendMsg(text, data)
  {
    console.log(data.Id);
    this.router.navigateByUrl('/invoicedetail/?Id=' + data.Id);
  }

  private dateComparator(date1, date2) {
    var date1Number = this.monthToComparableNumber(date1);
    var date2Number = this.monthToComparableNumber(date2);
    if (date1Number === null && date2Number === null) {
      return 0;
    }
    if (date1Number === null) {
      return -1;
    }
    if (date2Number === null) {
      return 1;
    }
    return date1Number - date2Number;
  }
  private monthToComparableNumber(date) {
    if (date === undefined || date === null || date.length !== 10) {
      return null;
    }
    var yearNumber = date.substring(6, 10);
    var monthNumber = date.substring(3, 5);
    var dayNumber = date.substring(0, 2);
    var result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
    return result;
  }
  
  private getGridConfig()
  {
    let vm = this
    this.agGridOption= {
      defaultColDef                : { flex: 1, minWidth: 100, sortable: true, filter: 'agTextColumnFilter', resizable: true, sortingOrder: ["asc", "desc"], menuTabs:[], floatingFilter: true},
      rowSelection                 : 'multiple',
      enableMultiRowDragging       : true,
      suppressRowClickSelection    : true,
      rowDragManaged               : true,
      suppressMoveWhenRowDragging  : true,
      suppressDragLeaveHidesColumns: true,
      columnDefs                   : this.getColumnDefinition(),
      animateRows                  : true,
      groupSelectsChildren         : true,
      groupDefaultExpanded         : 1,
      unSortIcon                   : true,
      context                      : {componentParent: this },
      suppressContextMenu          : true,
      //noRowsOverlayComponentFramework: NoRowOverlayComponent,
      noRowsOverlayComponentParams : { noRowsMessageFunc : ()=> this.rowData && this.rowData.length ? 'No matching records found for the required search': 'No invoices to display'},
      onGridReady,
      onModelUpdated,
    }

    function onGridReady(params) {
      vm.gridApi = params;
    }

    function onModelUpdated(params){
      
      if(!vm.apiSuccessFull)
      return;

      if(params.api.getDisplayedRowCount()) params.api.hideOverlay();
      else params.api.showNoRowsOverlay();
  
    }

  }

  private getColumnDefinition()
  {
    return [
      {
        headerName: 'Invoice #',
        field     : 'InvoiceCode',
        tooltipValueGetter (params) {
          return params.value;
        },
        sort : 'asc',
        maxWidth: 200,
        cellRendererFramework: InvoiceCodeComponentComponent,
      },
      {
        headerName: 'Invoice Date',
        field     : 'InvoiceDate',
        filter:'agDateColumnFilter',filterParams:{ filterOptions:['Equals'], suppressAndOrCondition:true },
        comparator: this.dateComparator,
      },
      {
        headerName: 'UploadedDate',
        field     : 'UploadedDate',
        filter:'agDateColumnFilter',
        comparator: this.dateComparator,
      },
      ,
      {
        headerName: 'Description',
        field     : 'Description'
      },
      {
        headerName: 'Status',
        field     : 'EbillerStatus'
      },     
      // {
      //   headerName           : 'Action',
      //   cellRendererFramework: ActionForEditDeleteComponent,
      //   sortable             : false,
      //   filter               : false,
      //   cellRendererParams   : {edit : this.fa.faEdit, delete: this.fa.faTrashAlt, isStandardAg: 'ComputationName'},
      //   minWidth             : 140
      // }
    ]
  }

  private getData()
  {
    //Uncomment the ine from 136 to 141
    this.invoicingService.getInvoiceList()
    .subscribe((response) => {
      console.log(response);
      this.rowData = response;
      this.setGridColSizeAsPerWidth();
      this.apiSuccessFull = true;
    })

    //comment the ine from 144 to 163
    // this.rowData = [
    //   {
    //     "Id": 586,
    //     "InvoiceClientId": 586,
    //     "UploadedDate": "02/11/2012",
    //     "InvoiceCode": "458502",
    //     "InvoiceDate": "07/11/2012",
    //     "Description": "Services Rendered",
    //     "EbillerStatus": "Activated",
    //   },
    //   {
    //     "Id": 587,
    //     "InvoiceClientId": 587,
    //     "UploadedDate": "02/12/2012",
    //     "InvoiceCode": "458502",
    //     "InvoiceDate": "05/11/2012",
    //     "Description": "Services Rendered",
    //     "EbillerStatus": "Released",
    //   },
    // ]
  }
  
  private autoSizeAll() {
    let allColumnIds = [];
    let gridColumnApi = this.gridApi.columnApi
    gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    gridColumnApi.autoSizeColumns(allColumnIds);
  }

  private setGridColSizeAsPerWidth()
  {
    setTimeout(() => {
      this.autoSizeAll();
      let width = 0;
      let gridColumnApi = this.gridApi.columnApi
      gridColumnApi.getAllColumns().forEach(function(column) {
        width = width + column.getActualWidth();
      });
      if(this.agGridDiv.nativeElement && width < this.agGridDiv.nativeElement.offsetWidth )
        this.gridApi.api.sizeColumnsToFit();
    }, 1);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.setGridColSizeAsPerWidth();
  }

  constructor(
    private router : Router,
    private invoicingService: InvoicingService
  ) { }

  ngOnInit(): void {
    this.getGridConfig();
    this.getData();
  }

}
