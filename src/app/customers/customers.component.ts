import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customerDocumentId: any = null
  customers: Array<any> = new Array<any>()

  isSearched: boolean = false
  searchedResults: Array<any> = new Array<any>()
  searchedKeys: any

  customersRef: AngularFirestoreCollection<any>;
  
  constructor(private router: Router, 
              private angularFireStore: AngularFirestore) { 
      
      // query for retrieve only customer type users          
      this.customersRef = this.angularFireStore.collection('users', ref => ref.where('type', '==', 'customer'));
  }

  ngOnInit(): void {
    this.retrieveCustomers()
  }

  navigateToCustomerProfile(customerDetails: any) {
    sessionStorage.setItem('customerDetails', JSON.stringify(customerDetails))
    this.router.navigateByUrl('/main/customer-profile')
  }

  retrieveCustomers(): void {
    this.customersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.customers = data;
    });
  }

  searchByCustomerNIC() {
    console.log(this.searchedKeys)
    if (this.searchedKeys.length > 0) {
      this.isSearched = true
      this.searchedResults = []
      this.customers.forEach(customer => {
        if (customer.nic.startsWith(this.searchedKeys.toUpperCase())) {
          this.searchedResults.push(customer)
        }
      });
    } else {
      this.isSearched = false
      this.searchedResults = []
    }
  }
}
