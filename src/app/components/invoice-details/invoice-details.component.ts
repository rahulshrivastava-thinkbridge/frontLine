import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AllCommunityModules, GridOptions, Module } from '@ag-grid-community/all-modules';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { InvoicingService } from 'src/app/services/invoicing.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

  @ViewChild('agGridParentDiv', { read: ElementRef }) public agGridDiv;

  public modules: Module[] = [...AllCommunityModules, ...[SetFilterModule, MenuModule]]
  public agGridOption: GridOptions;
  public rowData: any;
  public data: any;
  public gridApi: any;
  public apiSuccessFull: boolean;
  public id: number;

  public backToInvoicing() {
    //this.router.navigateByUrl(['']);
    this.router.navigate(
      ['invoices']
    );
  }

  private getGridConfig() {
    let vm = this
    this.agGridOption = {
      defaultColDef: { flex: 1, minWidth: 100, sortable: true, filter: 'agTextColumnFilter', resizable: true, sortingOrder: ["asc", "desc"], menuTabs: [], floatingFilter: true },
      rowSelection: 'multiple',
      enableMultiRowDragging: true,
      suppressRowClickSelection: true,
      rowDragManaged: true,
      suppressMoveWhenRowDragging: true,
      suppressDragLeaveHidesColumns: true,
      columnDefs: this.getColumnDefinition(),
      animateRows: true,
      groupSelectsChildren: true,
      groupDefaultExpanded: 1,
      unSortIcon: true,
      context: { componentParent: this },
      suppressContextMenu: true,
      //noRowsOverlayComponentFramework: NoRowOverlayComponent,
      noRowsOverlayComponentParams: { noRowsMessageFunc: () => this.rowData && this.rowData.length ? 'No matching records found for the required search' : 'No invoice details to display' },
      onGridReady,
      onModelUpdated,
    }

    function onGridReady(params) {
      vm.gridApi = params;
    }

    function onModelUpdated(params) {

      if (!vm.apiSuccessFull)
        return;

      if (params.api.getDisplayedRowCount()) params.api.hideOverlay();
      else params.api.showNoRowsOverlay();

    }

  }

  private getColumnDefinition() {
    return [
      {
        headerName: "File Item #",
        field: 'FileItemNumber'
      },
      // {
      //   headerName: 'Invoice Line Item #',
      //   field     : 'Id',
      //   tooltipValueGetter (params) {
      //     return params.value;
      //   },
      //   sort : 'asc',
      //   maxWidth: 200
      // },
      {
        headerName: 'Charge Date',
        field: 'ChargeDate',
        filter: 'agDateColumnFilter',
        comparator: this.dateComparator,
        minWidth: 180
      },
      // {
      //   headerName: 'UploadedDate',
      //   field     : 'UploadedDate',
      //   filter:'agDateColumnFilter',
      //   comparator: this.dateComparator,
      // },
      {
        headerName: 'Charge Desciption',
        field: 'ChargeDesciption'
      },
      {
        headerName: 'Task Code',
        field: 'TaskCode'
      },
      {
        headerName: 'Units',
        field: 'Units'
      },
      {
        headerName: 'Rate',
        field: 'Rate'
      },
      {
        headerName: 'Total Amount',
        field: 'TotalAmount'
      },

      {
        headerName: 'ML Approval Status',
        field: 'MLApprovalStatus'
      },

      {
        headerName: 'ML Preparation Notes',
        field: 'MLPreparationNotes',
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

  private getData() {
    this.id = this.route.snapshot.queryParams.Id
    //Uncomment the line from 137 to 142
    this.invoicingService.getInvoiceDetail(this.id)
      .subscribe((response) => {
        this.data = response;
        for (let i = 0; i < this.data.length; i++) {
          this.data[i]["MLApprovalStatus"] = 'Approved', this.data[i]["MLPreparationNotes"] = 'Demo Notes';
        }
        this.rowData = this.data;
        this.setGridColSizeAsPerWidth();
        this.apiSuccessFull = true;
      })

    //comment the ine from 145 to 164
    // this.rowData = [
    //   {
    //     "Id": 586,
    //     "InvoiceClientId": 586,
    //     "UploadedDate": "08/11/2012",
    //     "InvoiceCode": "458502",
    //     "InvoiceDate": "07/01/2012",
    //     "Description": "Services Rendered",
    //     "EbillerStatus": "Activated",
    //   },
    //   {
    //     "Id": 587,
    //     "InvoiceClientId": 587,
    //     "UploadedDate": "02/11/2012",
    //     "InvoiceCode": "458502",
    //     "InvoiceDate": "07/11/2012",
    //     "Description": "Services Rendered",
    //     "EbillerStatus": "Activated",
    //   }
    // ]
  }

  private autoSizeAll() {
    let allColumnIds = [];
    let gridColumnApi = this.gridApi.columnApi
    gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    gridColumnApi.autoSizeColumns(allColumnIds);
  }

  private setGridColSizeAsPerWidth() {
    setTimeout(() => {
      this.autoSizeAll();
      let width = 0;
      let gridColumnApi = this.gridApi.columnApi
      gridColumnApi.getAllColumns().forEach(function (column) {
        width = width + column.getActualWidth();
      });
      if (this.agGridDiv && width < this.agGridDiv.nativeElement.offsetWidth)
        this.gridApi.api.sizeColumnsToFit();
    }, 1);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.setGridColSizeAsPerWidth();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoicingService: InvoicingService
  ) { }

  ngOnInit(): void {
    this.getGridConfig();
    this.getData();
  }

}
