import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { CustomersComponent } from './customers/customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeliverySchedulesComponent } from './delivery-schedules/delivery-schedules.component';
import { FuelStationComponent } from './fuel-station/fuel-station.component';
import { FuelStationsComponent } from './fuel-stations/fuel-stations.component';
import { ManagePumpersComponent } from './manage-pumpers/manage-pumpers.component';
import { NavigationComponent } from './navigation/navigation.component';
import { QuotaComponent } from './quota/quota.component';
import { ScheduleDetailsComponent } from './schedule-details/schedule-details.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { StocksComponent } from './stocks/stocks.component';
import { VehicleHistoryComponent } from './vehicle-history/vehicle-history.component';
import { VehiclesComponent } from './vehicles/vehicles.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'main', pathMatch: 'full', redirectTo: 'main/dashboard' },
  { path: 'main', component: NavigationComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'fuel-stocks', component: StocksComponent },
      { path: 'fuel-stations', component: FuelStationsComponent },
      { path: 'fuel-station', component: FuelStationComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'customer-profile', component: CustomerProfileComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: 'vehicle-profile', component: VehicleHistoryComponent },
      { path: 'quota', component: QuotaComponent },
      { path: 'delivery-schedules', component: DeliverySchedulesComponent },
      { path: 'schedule-details', component: ScheduleDetailsComponent },
      { path: 'manage-pumpers', component: ManagePumpersComponent }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
