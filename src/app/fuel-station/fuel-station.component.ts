import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { HeadStockDto } from '../core/dtos/HeadStock';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-fuel-station',
  templateUrl: './fuel-station.component.html',
  styleUrls: ['./fuel-station.component.css']
})
export class FuelStationComponent implements OnInit {

  currentDate: any
  documentId = null
  stationId: any
  stationName: any
  district: any
  phone: any
  address: any
  availablePetrolAmount: any
  availableDieselAmount: any

  schedulingDate: any
  schedulingTime: any
  schedulingFuelType: any
  schedulingFuelAmount: any
  fuelTypes = ['Petrol', 'Diesel']

  private dbPathHeadStock = '/headStocks';
  headStocksRef: AngularFirestoreCollection<any>;

  private dbPathSchedules = '/fillingStations/' + this.documentId + "/sheduledFilings"
  schedules: Array<any> = new Array<any>();
  scheduledDeliveries: AngularFirestoreCollection<any>;

  headStock: HeadStockDto = new HeadStockDto()

  constructor(private dialog: MatDialog, 
              private angularFireStore: AngularFirestore, 
              private alertService: AlertService, 
              private router: Router) { 
      this.scheduledDeliveries = this.angularFireStore.collection(this.dbPathSchedules);
      this.headStocksRef = this.angularFireStore.collection(this.dbPathHeadStock);
  }

  ngOnInit(): void {
    this.currentDate = this.formatDate(new Date())
    this.getNavigatedFuelStationDetails()
    this.retrieveHeadStock()
  }

  getNavigatedFuelStationDetails() {
    let fuelStationDetails = JSON.parse(sessionStorage.getItem('fuelStationDetails')!)
    console.log(fuelStationDetails)
    this.documentId = fuelStationDetails.id
    this.stationId = fuelStationDetails.stationId
    this.stationName = fuelStationDetails.stationName
    this.district = fuelStationDetails.district
    this.phone = fuelStationDetails.phone
    this.address = fuelStationDetails.address
    this.availablePetrolAmount = fuelStationDetails.availablePetrolAmount
    this.availableDieselAmount = fuelStationDetails.availableDieselAmount

    this.retrieveScheduledDeliveries()
  }
 
  openScheduleFuelDelivery(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    let mm;
    mm = date.getMonth() + 1; // Months start at 0!
    let dd;
    dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '/' + mm + '/' + yyyy;
  }

  isNumber(event: any): boolean {
    const charcode = event.which ? event.which : event.keyCode;
    if ((charcode > 31 && charcode < 48) || charcode > 57) {
      return false;
    }
    return true;
  }

  retrieveScheduledDeliveries(): void {
    this.dbPathSchedules = '/fillingStations/' + this.documentId + "/sheduledFilings"
    this.scheduledDeliveries = this.angularFireStore.collection(this.dbPathSchedules);
    this.scheduledDeliveries.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.schedules = data;
      this.check(data)
    });
  }

  check(schedules: any[]) {
    schedules.forEach(element => {
      if (typeof element.scheduledDate == 'object') {
        console.log(new Date(element.scheduledDate).toString().substring(4, 15))
        
      }
    });
  }

  retrieveHeadStock(): void {
    this.headStocksRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.headStock = data[0];
    });
  }

  scheduleDelivery() {
    
    if ((this.schedulingDate != null && this.schedulingDate != '') 
    && (this.schedulingTime != null && this.schedulingTime != '')
     && (this.schedulingFuelType != null && this.schedulingFuelType != '')
      && (this.schedulingFuelAmount != null && this.schedulingFuelAmount != '')) {
      
        let availablePetrolAmount = (Number(this.headStock.Petrol))
        let availableDieselAmount = (Number(this.headStock.Diesel))

        let scheduledDelivery = {
          fillingStationDocumentId: this.documentId,
          scheduledDate: this.formatDate(this.schedulingDate),
          scheduledTime: this.schedulingTime,
          scheduledFuelType: this.schedulingFuelType,
          scheduledFuelAmount: this.schedulingFuelAmount,
          status: "INPROGRESS"   
        }

        if (this.schedulingFuelType === 'Petrol') {
          if (this.schedulingFuelAmount <= availablePetrolAmount) {
            
            this.scheduledDeliveries.add({ ...scheduledDelivery }).then(() => {

              let headStockData = {
                Petrol: (Number(this.headStock.Petrol) - Number(this.schedulingFuelAmount))
              }
              this.headStocksRef.doc(this.headStock.id).update(headStockData).then(() => {
                this.clear()
                this.alertService.showSuccess("A delivery scheduled successfully..")
              })
  
            })    
    
          } else {
            this.alertService.showError("Fuel amount you're trying to deliver is not available right now. Please check availble Petrol stocks before schedule a delivery.")
          }

        } else if (this.schedulingFuelType === 'Diesel') {
          if (this.schedulingFuelAmount <= availableDieselAmount) {
            
            this.scheduledDeliveries.add({ ...scheduledDelivery }).then(() => {

              let headStockData = {
                Diesel: (Number(this.headStock.Diesel) - Number(this.schedulingFuelAmount))
              }
              this.headStocksRef.doc(this.headStock.id).update(headStockData).then(() => {
                this.clear()
                this.alertService.showSuccess("A delivery scheduled successfully..")
              })
  
            })   

          } else {
            this.alertService.showError("Fuel amount you're trying to deliver is not available right now. Please check availble Diesel stocks before schedule a delivery.")
          }
        }

    } else {
      this.alertService.showError("Please fill all required* fields.")
    }
  }

  clear() {
    this.schedulingDate = null
    this.schedulingTime = null
    this.schedulingFuelType = null
    this.schedulingFuelAmount = null
  }

  backToPrevious() {
    sessionStorage.removeItem('fuelStationDetails')
    this.router.navigateByUrl('/main/fuel-stations')
  }
}