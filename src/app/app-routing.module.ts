import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { LoginComponent } from './components/login/login.component';
import { UploadInvoiceComponent } from './components/upload-invoice/upload-invoice.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  //{ path: '', component: AppComponent},
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'Home' } },
  {
    path: 'invoices', component: InvoiceListComponent, canActivate: [AuthGuard], data: { breadcrumb: 'invoicess' }
  },
  {
    path: 'uploadinvoices', component: UploadInvoiceComponent, canActivate: [AuthGuard]
  },
  { path: 'invoicedetail/:id', component: InvoiceDetailsComponent, canActivate: [AuthGuard], data: { breadcrumb: 'invoicedetails' } },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
