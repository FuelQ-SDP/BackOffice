import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';

@Component({
  selector: 'app-vehicle-history',
  templateUrl: './vehicle-history.component.html',
  styleUrls: ['./vehicle-history.component.css']
})
export class VehicleHistoryComponent implements OnInit {

  customerDocumentId: any = null
  vehicleDocumentId: any = null
  customerName: any
  nic: any
  vehicleNo: any
  vehicleType: any
  fuelType: any

  fuelHistories: Array<any> = new Array<any>()
  pumpedFuelHistoriesRefs: AngularFirestoreCollection<any>

  private dbPathVehiclePumpedHistory = '/users/' + this.customerDocumentId + "/vehicles/" + this.vehicleDocumentId + "/pumpedFuelHistory"

  constructor(private angularFireStore: AngularFirestore) {
    this.pumpedFuelHistoriesRefs = this.angularFireStore.collection(this.dbPathVehiclePumpedHistory);
  }

  ngOnInit(): void {
    this.getNavigatedVehicleAndCustomerDetails()
  }

  getNavigatedVehicleAndCustomerDetails() {
    let vehicleDetails = JSON.parse(sessionStorage.getItem('vehicleDetails')!)
    let customerDetails = JSON.parse(sessionStorage.getItem('customerDetails')!)
    
    this.customerDocumentId = customerDetails.id
    this.vehicleDocumentId = vehicleDetails.id
    this.customerName = customerDetails.firstName + " " + customerDetails.lastName
    this.nic = customerDetails.nic
    this.vehicleNo = vehicleDetails.vehicleNo
    this.vehicleType = vehicleDetails.vehicleType
    this.fuelType = vehicleDetails.fuelType

    this.getVehicleFuelPumpedHistory()
  }

  getVehicleFuelPumpedHistory() {
    this.dbPathVehiclePumpedHistory = '/users/' + this.customerDocumentId + "/vehicles/" + this.vehicleDocumentId + "/pumpedFuelHistory"
    console.log(this.dbPathVehiclePumpedHistory)
    this.pumpedFuelHistoriesRefs = this.angularFireStore.collection(this.dbPathVehiclePumpedHistory);
    this.pumpedFuelHistoriesRefs.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.fuelHistories = data;
    });
  }
 
}