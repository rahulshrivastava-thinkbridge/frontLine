import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AllCommunityModules, GridOptions, Module } from '@ag-grid-community/all-modules';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { InvoicingService } from 'src/app/services/invoicing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { invoiceDetails, casecading } from '../shared/constant';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {
  @ViewChild('agGridParentDiv', { read: ElementRef }) public agGridDiv;
  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.setGridColSizeAsPerWidth();
  }
  public modules: Module[] = [...AllCommunityModules, ...[SetFilterModule, MenuModule]]
  public agGridOption: GridOptions;
  public rowData: any;
  public data: any;
  public gridApi: any;
  public apiSuccessFull: boolean;
  public id: number;
  public invoiceNumber: any;
  public invoiceDate: string = new Date().toISOString();
  public startDate: string = new Date().toISOString();;
  public endDate: string = new Date().toISOString();;
  public invoiceFormat: any;
  public firmMatterId: any;
  public firmClientMatterId: any;
  public matterName: any;
  public isFinal: any;
  public client: any;
  public firmClient: any;
  public tags: any;
  public ruleCode: any;
  public serverSideStoreType;
  public rowModelType;
  public sortingOrder;
  public columnDefs;
  public defaultColDef;
  public lastLength: any;
  public filter: string;
  public pageIndex: number;
  public totalOld: any;
  public total: any;
  public change: any;
  public discount: any;
  public expenses: any;
  public original: any;
  public changeValue: any;
  public final: any;
  public dess: any;
  public invoiceHeader: any;
  public invoiceNumbers: any;
  public invoiceDates: any;
  public startDates: any;
  public endDates: any;
  public invoiceFormate: any;
  public matterHeader: any;
  public matterName1: any;
  public matterName2: any;
  public isFinals: any;
  public clients: any;
  public firmClients: any;
  public tagss: any;
  public ruleCodes: any;
  public firmHeader: any;
  public firmMatterId1: any;
  public firmMatterId2: any;
  public firmClientId: any;
  public firmClientId2: any;
  public orignal: any
  public changes: any;
  public finals: any;
  public feess: any;
  public expensess: any;
  public discounts: any;
  public totals: any;
  public nullValueSet: any;
  public home: any;
  public headerInvoicelist: any;
  public headerInvoiceDetails: any;

  constructor(private route: ActivatedRoute, private router: Router, private invoicingService: InvoicingService) {
    this.discount = 0;
    this.expenses = 0;
    this.invoiceHeader = invoiceDetails.INVOICE_HEADER;
    this.invoiceNumbers = invoiceDetails.INVOICE_NUMBER;
    this.invoiceDates = invoiceDetails.INVOICE_DATE;
    this.startDates = invoiceDetails.START_DATE;
    this.endDates = invoiceDetails.END_DATE;
    this.invoiceFormate = invoiceDetails.INVOICE_FORMATE;
    this.matterHeader = invoiceDetails.MATTER_DETAILS_HEADER;
    this.matterName1 = invoiceDetails.MATTER_NAME;
    this.matterName2 = invoiceDetails.MATTER_NAMES;
    this.isFinals = invoiceDetails.IS_FINAL;
    this.clients = invoiceDetails.CLIENT;
    this.firmClients = invoiceDetails.FIRM_CLIENT;
    this.tagss = invoiceDetails.TAGS;
    this.ruleCodes = invoiceDetails.RULE_CODE;
    this.firmHeader = invoiceDetails.FIRM_DETAILS_HEADER;
    this.firmMatterId1 = invoiceDetails.FIRM_MATTER_ID;
    this.firmMatterId2 = invoiceDetails.FIRM_MATTER_ID2;
    this.firmClientId = invoiceDetails.FIRM_CLIENT_ID;
    this.firmClientId2 = invoiceDetails.FIRM_CLIENT_ID2;
    this.orignal = invoiceDetails.ORIGINAL;
    this.changes = invoiceDetails.CHANGE;
    this.finals = invoiceDetails.FINAL;
    this.feess = invoiceDetails.FEES;
    this.expensess = invoiceDetails.EXPENSES;
    this.discounts = invoiceDetails.DISCOUNTS;
    this.totals = invoiceDetails.TOTAL;
    this.nullValueSet = 'NA';
    this.home = casecading.HOME;
    this.headerInvoicelist = casecading.INVOICE_LIST;
    this.headerInvoiceDetails = casecading.INVOICE_DETAILS;
  }

  ngOnInit(): void {
    this.getGridConfig();
    this.getData();
    const invoiceDetails = localStorage.getItem('invoicedetail');
    const invoiceData = JSON.parse(invoiceDetails);
    this.invoiceNumber = invoiceData.InvoiceNumber || this.nullValueSet;
    this.invoiceDate = this.myDateParser(invoiceData.InvoiceDate);
    this.firmMatterId = invoiceData.FirmMatterId || this.nullValueSet;
    this.firmClientMatterId = invoiceData.ClientMatterId || this.nullValueSet;
    this.matterName = invoiceData.MatterName || this.nullValueSet;
    this.client = invoiceData.ClientName || this.nullValueSet;
    this.firmClient = invoiceData.LawFirmName || this.nullValueSet;
  }

  private getGridConfig() {
    let vm = this
    this.agGridOption = {
      defaultColDef: { flex: 1, minWidth: 100, sortable: true, filter: 'agTextColumnFilter', resizable: true, sortingOrder: ["asc", "desc"], menuTabs: [], floatingFilter: true, editable: true, },
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
      getRowNodeId: function (data) {
        return data.id;
      },
      //noRowsOverlayComponentFramework: NoRowOverlayComponent,
      noRowsOverlayComponentParams: { noRowsMessageFunc: () => this.rowData && this.rowData.length ? 'No matching records found for the required search' : 'No invoice details to display' },
      onModelUpdated,
    }

    function onModelUpdated(params) {
      if (!vm.apiSuccessFull)
        return;
      if (params.api.getDisplayedRowCount()) params.api.hideOverlay();
      else params.api.showNoRowsOverlay();
    }
  }

  private setFilter(event: any) {
    this.filter = ''
  }

  private getColumnDefinition() {
    function ragRenderer(params) {
      return '<span class="rag-element">' + params.value + '</span>';
    }
    var ragCellClassRules = {
      'rag-green-outer': function (params) {
        return params.value == 'Active';
      },
      'rag-amber-outer': function (params) {
        return params.value == 11.00;
      },
      'rag-red-outer': function (params) {
        return params.value === 2000;
      },
    };
    return [
      {
        headerName: "Status",
        field: 'LineItemStatus',
        // cellClassRules: ragCellClassRules,
        //   cellRenderer: ragRenderer,
      },
      {
        headerName: "Rule",
        field: 'Rule'
      },
      {
        headerName: "Rule Category",
        field: 'RuleCategory'
      },
      {
        headerName: "Units",
        field: 'Units'
      },
      {
        headerName: "Rate",
        field: 'Rate'
      },
      {
        headerName: "Agreed Rate",
        field: 'AgreedRate'
      },
      {
        headerName: "Discounts",
        field: 'Discounts'
      },
      {
        headerName: "Total",
        field: 'Total',

      },  // cellStyle: params => params.value == 22.00 ? { color: 'red' } : { color: 'green' }
      {
        headerName: "Tags",
        field: 'Tags'
      },
      {
        headerName: 'Date',
        field: 'Date',
        filter: 'agDateColumnFilter',
        comparator: this.dateComparator,
        minWidth: 180
      },
      {
        headerName: "Task",
        field: 'Task'
      },
      {
        headerName: "Activity",
        field: 'Activity'
      },
      {
        headerName: "Timekeeper Initial",
        field: 'TimekeeperInitial'
      },
      {
        headerName: 'Description',
        field: 'Description',
      },
      {
        headerName: 'ML Preparation Note',
        field: ' '
      },
    ]
  }

  ragRenderer(params) {
    return '<span class="rag-element">' + params.value + '</span>';
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
    this.id = this.route.snapshot.queryParams.Id;
    this.invoicingService.getInvoiceDataDetails(this.id)
      .subscribe((response) => {
        this.startDate = this.myDateParser(response[0].StartDate) || this.nullValueSet;
        this.endDate = this.myDateParser(response[0].EndDate) || this.nullValueSet;
        this.invoiceFormat = response[0].InvoiceFormat || this.nullValueSet;
        this.isFinal = response[0].IsFinal || this.nullValueSet;
        this.tags = response[0].Tags || this.nullValueSet;
        this.ruleCode = response[0].RuleCode || this.nullValueSet;

        this.invoicingService.getInvoiceDetails(this.id)
          .subscribe((response) => {
            this.data = response;
            this.rowData = this.data;
            this.setGridColSizeAsPerWidth();
            this.apiSuccessFull = true;
            let sum = 0;
            for (var i in this.data) {
              sum += parseFloat(this.data[i].TotalOld);
            }
            this.totalOld = sum || 0;

            let old = 0;
            for (var i in this.data) {
              old += parseFloat(this.data[i].Total);
            }
            this.total = old || 0;
            this.change = this.totalOld - this.total || 0;
            let des = 0;
            for (var i in this.data) {
              des += parseFloat(this.data[i].Discounts);
              this.dess = des;
            }
            this.discount = this.dess || 0;
            this.original = this.totalOld + this.discount + this.expenses || 0;
            this.changeValue = this.change + this.discount + this.expenses || 0;
            this.final = this.total + this.discount + this.expenses || 0;
          })
      })
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

  myDateParser(dateStr: string): string {
    let date = dateStr.substring(0, 13);
    let validDate = date
    return validDate
  }

  onBack(){
    this.router.navigate(['/invoices']);
  }

}
