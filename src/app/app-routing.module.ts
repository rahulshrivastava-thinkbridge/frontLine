import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';


const routes: Routes = [  
  //{ path: '', component: AppComponent},
  {
    path: '',
    redirectTo: '/invoices',
    pathMatch: 'full'
},
  { path: 'invoices', component: InvoiceListComponent},
  { path: 'invoicedetail/:id', component: InvoiceDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
