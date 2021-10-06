import { LicenseManager } from '@ag-grid-enterprise/core';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
LicenseManager.setLicenseKey('CompanyName=Consero Global,LicensedApplication=SIMPL,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=1,AssetReference=AG-015179,ExpiryDate=20_May_2022_[v2]_MTY1MzAwMTIwMDAwMA==d8426fb8ff20912cd950536fd1247eb3');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
