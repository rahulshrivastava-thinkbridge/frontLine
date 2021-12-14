import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgGridModule } from '@ag-grid-community/angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { InvoicingService } from './services/invoicing.service';
import { InvoiceCodeComponentComponent } from './agGridComponents/invoice-code-component/invoice-code-component.component';
import { LoginComponent } from './components/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpInterceptorInterceptor } from './components/shared/http-interceptor.interceptor';
import { HeaderComponent } from './components/shared/header/header.component';
import { AuthGuard } from './auth.guard'
import { FormsModule } from '@angular/forms';
import { UploadInvoiceComponent } from './components/upload-invoice/upload-invoice.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceListComponent,
    InvoiceDetailsComponent,
    InvoiceCodeComponentComponent,
    LoginComponent,
    HeaderComponent,
    UploadInvoiceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatProgressSpinnerModule,
    AgGridModule.withComponents([]),
    NgbModule,
    BrowserAnimationsModule,
  ],
  providers: [InvoicingService, AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
