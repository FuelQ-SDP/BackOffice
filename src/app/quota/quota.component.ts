import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-quota',
  templateUrl: './quota.component.html',
  styleUrls: ['./quota.component.css']
})
export class QuotaComponent implements OnInit {

  fuelTypes = ['Petrol', 'Diesel']

  documentId: any
  vehicleType: any
  fuelType: any
  weeklyQuota: any

  isRowSelected: boolean = false

  displayedColumns = ['index', 'vehicleType', 'fuelType', 'quota', 'lastUpdateAt']
  quotas: Array<any> = new Array<any>()

  vehicleQuotasRef: AngularFirestoreCollection<any>;
  private dbPath = '/vehicleQuotas';

  constructor(private alertService: AlertService, 
              private dialog: MatDialog,
              private angularFireStore: AngularFirestore) {

      this.vehicleQuotasRef = this.angularFireStore.collection(this.dbPath);
  }

  ngOnInit(): void {
    this.retrieveQuotas()
  }

  createVehicleQuota() {
    if ((this.vehicleType != null && this.vehicleType != '') && (this.fuelType != null && this.fuelType != '') && (this.weeklyQuota != null && this.weeklyQuota != '')) {
      
      let quotaData = {
        vehicleType: this.vehicleType,
        fuelType: this.fuelType,
        weeklyQuota: this.weeklyQuota,
        lastUpdatedAt: new Date().toLocaleString()
      }
    
      this.vehicleQuotasRef.add({ ...quotaData }).then((res) => {
        console.log(res)
        this.clear()
        this.alertService.showSuccess("A new Quota added successfully.")
      })

    } else {
      this.alertService.showError("Please fill all required* fields.")
    }
  }

  updateVehicleQuota() {
    if ((this.vehicleType != null && this.vehicleType != '') && (this.fuelType != null && this.fuelType != '') && (this.weeklyQuota != null && this.weeklyQuota != '')) {
    
      let data = {
        vehicleType: this.vehicleType,
        fuelType: this.fuelType,
        weeklyQuota: this.weeklyQuota,
        lastUpdatedAt: new Date().toLocaleString()
      }

      this.vehicleQuotasRef.doc(this.documentId).update(data).then(() => {
        this.clear()
        this.alertService.showSuccess("Quota updated successfully.")
      })

    } else {
      this.alertService.showError("Please fill all required* fields.")
    }
  }

  removeVehicleQuota() {
    this.vehicleQuotasRef.doc(this.documentId).delete().then(() => {
      this.clear()
      this.alertService.showSuccess("Quota removed successfully.")
    })
  }

  retrieveQuotas(): void {
    this.vehicleQuotasRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.quotas = data;
    });
  }

  clear() {
    this.vehicleType = null
    this.fuelType = null
    this.weeklyQuota = null
    this.isRowSelected = false
  }

  clickOnTableRow(quota: any) {
    console.log(quota)
    this.documentId = quota.id
    this.vehicleType = quota.vehicleType
    this.fuelType = quota.fuelType
    this.weeklyQuota = quota.weeklyQuota
    this.isRowSelected = true
  }

  isNumber(event: any): boolean {
    const charcode = event.which ? event.which : event.keyCode;
    if ((charcode > 31 && charcode < 48) || charcode > 57) {
      return false;
    }
    return true;
  }

  openRemoveConfirmationDialog(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }

  // get call - doen't need here. just to understand
  getDetails() {
    this.vehicleQuotasRef.doc(this.documentId).ref.get().then(function (doc) {
      if (doc.exists) {
        console.log(doc.data());
      } else {
        console.log("There is no document!");
      }
      return ''
    }).catch(function (error) {
      console.log("There was an error getting your document:", error);
    })
  }

}
