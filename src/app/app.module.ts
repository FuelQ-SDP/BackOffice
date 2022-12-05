import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from "src/environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SignInComponent } from './sign-in/sign-in.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { StocksComponent } from './stocks/stocks.component';
import { FuelStationsComponent } from './fuel-stations/fuel-stations.component';
import { FuelStationComponent } from './fuel-station/fuel-station.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleHistoryComponent } from './vehicle-history/vehicle-history.component';
import { QuotaComponent } from './quota/quota.component';
import { ToastrModule } from 'ngx-toastr';
import { DeliverySchedulesComponent } from './delivery-schedules/delivery-schedules.component';
import { ScheduleDetailsComponent } from './schedule-details/schedule-details.component';
import { ManagePumpersComponent } from './manage-pumpers/manage-pumpers.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HeaderComponent,
    SignInComponent,
    DashboardComponent,
    StocksComponent,
    FuelStationsComponent,
    FuelStationComponent,
    CustomersComponent,
    CustomerProfileComponent,
    VehiclesComponent,
    VehicleHistoryComponent,
    QuotaComponent,
    DeliverySchedulesComponent,
    ScheduleDetailsComponent,
    ManagePumpersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    NgChartsModule,
    MatFormFieldModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
