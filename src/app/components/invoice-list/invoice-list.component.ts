import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AllCommunityModules, GridOptions, IDatasource, IGetRowsParams, Module } from '@ag-grid-community/all-modules';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { InvoicingService } from 'src/app/services/invoicing.service';
import { InvoiceCodeComponentComponent } from 'src/app/agGridComponents/invoice-code-component/invoice-code-component.component';
import { Router } from '@angular/router';
import { invoiceList, casecading } from '../shared/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerSideRowModelModule, ColumnsToolPanelModule } from '@ag-grid-enterprise/all-modules';
import * as moment from 'moment';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  @ViewChild('agGridParentDiv', { read: ElementRef }) public agGridDiv: any;
  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    this.setGridColSizeAsPerWidth();
  }
  public modules: Module[] = [...AllCommunityModules, ...[SetFilterModule, MenuModule, ServerSideRowModelModule, ColumnsToolPanelModule]]
  public agGridOption: GridOptions;
  public rowData: any;
  public gridApi: any;
  public apiSuccessFull: boolean;
  public invoiceList: string;
  public filterForm: FormGroup;
  public sortingOrder;
  public columnDefs;
  public defaultColDef;
  public rowModelType;
  public serverSideStoreType;
  public cacheBlockSize;
  public gridColumnApi;
  public pageIndex: number;
  public filterData: string;
  public filter: any = ' ';
  public lastLength: any;
  public chekindex: boolean;
  private columnTypes;
  public home: any;
  public headerInvoicelist: any;
  public one: any;
  public zero: any;
  public rowCount: any;
  public allRowWidth: any;
  public invoiceWidth: any;

  constructor(private router: Router, private invoicingService: InvoicingService, private formBuilder: FormBuilder,) {
    this.invoiceList = invoiceList.INVOICE_LIST;
    this.one = invoiceList.ONE;
    this.zero = invoiceList.ZERO;
    this.rowCount = invoiceList.ROWCOUNT;
    this.allRowWidth = invoiceList.ALL_ROW_WIDTH;
    this.invoiceWidth = invoiceList.INVOICE_WIDTH;
    this.home = casecading.HOME;
    this.headerInvoicelist = casecading.INVOICE_LIST;
    this.rowModelType = 'serverSide';
    this.serverSideStoreType = 'partial';
  }

  ngOnInit(): void {
    this.getGridConfig();
  }

  public sendMsg(text, data) {
    localStorage.setItem('invoicedetail', JSON.stringify(data))
    this.router.navigateByUrl('/invoicedetail/?Id=' + data.InvoiceId);
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

  private getGridConfig() {
    let vm = this
    this.agGridOption = {
      defaultColDef: { flex: this.one, minWidth: this.allRowWidth, sortable: true, filter: 'agTextColumnFilter', resizable: true, sortingOrder: ["asc", "desc"], menuTabs: [], floatingFilter: true },
      rowSelection: 'multiple',
      enableMultiRowDragging: true,
      suppressRowClickSelection: true,
      rowDragManaged: true,
      suppressMoveWhenRowDragging: true,
      suppressDragLeaveHidesColumns: true,
      columnDefs: this.getColumnDefinition(),
      animateRows: true,
      groupSelectsChildren: true,
      groupDefaultExpanded: this.one,
      unSortIcon: true,
      context: { componentParent: this },
      suppressContextMenu: true,
      //noRowsOverlayComponentFramework: NoRowOverlayComponent,
      // noRowsOverlayComponentParams: { noRowsMessageFunc: () => this.rowData && this.rowData.length == 0 ? 'No matching records found for the required search' : 'No invoices to display' },
      onModelUpdated,
    }

    function onModelUpdated(params) {
      if (!vm.apiSuccessFull)
        return;
      if (params.api.getDisplayedRowCount()) params.api.hideOverlay();
      else params.api.showNoRowsOverlay();
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setServerSideDatasource(this.serverModalForApi());
  }

  private serverModalForApi() {
    return {
      getRows: (params: any) => {
        let request = params.request;
        this.setFilter(request.filterModel)
        const indexData = request.endRow;
        this.pageIndex = indexData / this.rowCount;
        let parameters = {
          pageIndex: this.pageIndex,
          startRecord: request.startRow,
          endRecord: request.endRow,
          filterText: this.filter,
        }
        this.invoicingService.invoicePages(parameters)
          .subscribe((data: any) => {
            this.rowData = data;
            if (this.filter) {
              this.lastLength = data.length;
            } else {
              this.lastLength = data.lastRow;
              // this.lastLength = data.slice(request.startRow, request.endRow);
            }
            params.success({
              rowData: data,
              rowCount: this.lastLength,
            });
          });
      }
    }
  }

  private setFilter(event: any) {
    this.filter = ''
    if (event.InvoiceNumber) {
      this.filterData = event.InvoiceNumber.filter;
      this.filter = 'InvoiceNumber Like \'%' + this.filterData + '%\''
    } else {
      this.filter = this.filter
    }

    if (event.UploadedDate) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND UploadedDate Like \'%' + event.UploadedDate.dateFrom + '%\' '
      } else {
        this.filter = 'UploadedDate Like \'%' + event.UploadedDate.dateFrom + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.InvoiceDate) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND InvoiceDate Like \'%' + event.InvoiceDate.dateFrom + '%\' '
      } else {
        this.filter = 'InvoiceDate Like \'%' + event.InvoiceDate.dateFrom + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.ClientName) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND ClientName Like \'%' + event.ClientName.filter + '%\' '
      } else {
        this.filter = 'ClientName Like \'%' + event.ClientName.filter + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.LawFirmName) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND LawFirmName Like \'%' + event.LawFirmName.filter + '%\' '
      } else {
        this.filter = 'LawFirmName Like \'%' + event.LawFirmName.filter + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.OriginalTotal) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND OriginalTotal Like \'%' + event.OriginalTotal.filter + '%\' '
      } else {
        this.filter = 'OriginalTotal Like \'%' + event.OriginalTotal.filter + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.ModifiedTotal) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND ModifiedTotal Like \'%' + event.ModifiedTotal.filter + '%\' '
      } else {
        this.filter = 'ModifiedTotal Like \'%' + event.ModifiedTotal.filter + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.Status) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND Status Like \'%' + event.Status.filter + '%\' '
      } else {
        this.filter = 'Status Like \'%' + event.Status.filter + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.AppealStatus) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND AppealStatus Like \'%' + event.AppealStatus.filter + '%\' '
      } else {
        this.filter = 'AppealStatus Like \'%' + event.AppealStatus.filter + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.MLStatus) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND MLStatus Like \'%' + event.MLStatus.filter + '%\' '
      } else {
        this.filter = 'MLStatus Like \'%' + event.MLStatus.filter + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.AppealDeadlineDate) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND AppealDeadlineDate Like \'%' + event.AppealDeadlineDate.dateFrom + '%\' '
      } else {
        this.filter = 'AppealDeadlineDate Like \'%' + event.AppealDeadlineDate.dateFrom + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.Preparer) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND Preparer Like \'%' + event.Preparer.filter + '%\' '
      } else {
        this.filter = 'Preparer Like \'%' + event.Preparer.filter + '%\''
      }
    } else {
      this.filter = this.filter
    }

    if (event.WorkFlowOwner) {
      if (this.filter) {
        this.filter = "" + this.filter + '\ AND WorkFlowOwner Like \'%' + event.WorkFlowOwner.filter + '%\' '
      } else {
        this.filter = 'WorkFlowOwner Like \'%' + event.WorkFlowOwner.filter + '%\''
      }
    } else {
      this.filter = this.filter
    }
  }

  private getColumnDefinition() {
    return [
      {
        headerName: 'Invoice #',
        field: 'InvoiceNumber',
        tooltipValueGetter(params) {
          return params.value;
        },
        sort: 'asc',
        maxWidth: this.invoiceWidth,
        filter: 'agNumberColumnFilter',
        cellRendererFramework: InvoiceCodeComponentComponent,
        pinned: 'left',
      },
      {
        headerName: 'Uploaded Date',
        field: 'UploadedDate',
        filter: 'agDateColumnFilter',
        comparator: this.dateComparator,
        cellRenderer: (UploadedDate: any) => {
          return moment(UploadedDate.createdAt).format('MM/DD/YYYY')
        }
      },
      {
        headerName: 'Invoice Date',
        field: 'InvoiceDate',
        filter: 'agDateColumnFilter',
        comparator: this.dateComparator,
        cellRenderer: (InvoiceDate: any) => {
          return moment(InvoiceDate.createdAt).format('MM/DD/YYYY')
        }
      },
      {
        headerName: 'Client',
        field: 'ClientName',
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Firm Client',
        field: 'LawFirmName'
      },
      {
        headerName: 'Original Total',
        field: 'OriginalTotal'
      },
      {
        headerName: 'Modified Total',
        field: 'ModifiedTotal'
      },
      {
        headerName: 'Status',
        field: 'Status'
      },
      {
        headerName: 'Appeal Status',
        field: 'AppealStatus'
      },
      {
        headerName: 'ML Status',
        field: 'MLStatus'
      },
      {
        headerName: 'Appeal Deadline',
        field: 'AppealDeadlineDate',
        filter: 'agDateColumnFilter',
        comparator: this.dateComparator,
        cellRenderer: (AppealDeadlineDate: any) => {
          return moment(AppealDeadlineDate.createdAt).format('MM/DD/YYYY')
        }
      },
      {
        headerName: 'Preparer',
        field: 'Preparer'
      },
      {
        headerName: 'Owner',
        field: 'WorkFlowOwner'
      },
    ]
  }

  private autoSizeAll() {
    let allColumnIds: any[] = [];
    let gridColumnApi = this.gridApi.columnApi
    if (gridColumnApi) {
      gridColumnApi.getAllColumns().forEach(function (column: any) {
        allColumnIds.push(column.colId);
      });
      gridColumnApi.autoSizeColumns(allColumnIds);
    }
  }

  private setGridColSizeAsPerWidth() {
    setTimeout(() => {
      this.autoSizeAll();
      let width = this.zero;
      let gridColumnApi = this.gridApi.columnApi;
      if (gridColumnApi) {
        gridColumnApi.getAllColumns().forEach(function (column: any) {
          width = width + column.getActualWidth();
        });
      }
      if (this.agGridDiv && width < this.agGridDiv.nativeElement.offsetWidth)
        this.gridApi.api.sizeColumnsToFit();
    }, this.one);
  }

  onBack() {
    this.router.navigate(['/invoices']);
  }

}


