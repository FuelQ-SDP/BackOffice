import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {

  customerDocumentId: any = null
  customerName: any
  nic: any
  phone: any
  email: any

  private dbPathVehicles = '/users/' + this.customerDocumentId + "/vehicles"

  vehicles: Array<any> = new Array<any>()
  vehiclesRefs: AngularFirestoreCollection<any>

  constructor(private angularFireStore: AngularFirestore, 
              private router: Router) {
    this.vehiclesRefs = this.angularFireStore.collection(this.dbPathVehicles);
  }

  ngOnInit(): void {
    this.getNavigatedCustomerDetails()
  }

  getNavigatedCustomerDetails() {
    let customerDetails = JSON.parse(sessionStorage.getItem('customerDetails')!)
    this.customerDocumentId = customerDetails.id
    this.customerName = customerDetails.firstName + " " + customerDetails.lastName
    this.nic = customerDetails.nic
    this.phone = customerDetails.mobileNo;
    this.email = customerDetails.email

    this.retrieveCustomerVehicles()
  }

  retrieveCustomerVehicles(): void {
    this.dbPathVehicles = '/users/' + this.customerDocumentId + "/vehicles"
    this.vehiclesRefs = this.angularFireStore.collection(this.dbPathVehicles);
    this.vehiclesRefs.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.vehicles = data;
    });
  }

  navigateToVehicleProfile(vehicleDetails: any) {
    sessionStorage.setItem('vehicleDetails', JSON.stringify(vehicleDetails))
    this.router.navigateByUrl('/main/vehicle-profile')
  }

}
