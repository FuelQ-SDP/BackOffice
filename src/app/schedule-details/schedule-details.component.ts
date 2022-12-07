import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { HeadStockDto } from '../core/dtos/HeadStock';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-schedule-details',
  templateUrl: './schedule-details.component.html',
  styleUrls: ['./schedule-details.component.css']
})
export class ScheduleDetailsComponent implements OnInit {

  fillingStationDocumentId: any = null
  scheduledFilingDocumentId: any
  scheduledDate: any
  scheduledTime: any
  scheduledFuelType: any
  scheduledFuelAmount: any
  status: any
  fillingStationDetails: any = null

  stationId: any
  stationName: any
  phone: any
  address: any

  private dbPathFillingStation = '/fillingStations'
  private dbPathScheduledFilling = '/fillingStations/' + this.fillingStationDocumentId + '/sheduledFilings'
  private dbPathHeadStock = '/headStocks';
  
  headStocksRef: AngularFirestoreCollection<any>
  fillingStationRef: AngularFirestoreCollection;
  scheduledFillingRef: AngularFirestoreCollection; 

  headStock: HeadStockDto = new HeadStockDto()

  constructor(private angularFireStore: AngularFirestore, 
              private alertService: AlertService, 
              private dialog: MatDialog) {
    this.fillingStationRef = this.angularFireStore.collection(this.dbPathFillingStation);
    this.scheduledFillingRef = this.angularFireStore.collection(this.dbPathScheduledFilling);
    this.headStocksRef = this.angularFireStore.collection(this.dbPathHeadStock);
  }

  ngOnInit(): void {
    this.getNavigatedScheduledDetails()
    this.retrieveHeadStock()
  }

  getNavigatedScheduledDetails() {
    let scheduledDeliveryDetails = JSON.parse(sessionStorage.getItem('scheduledDeliveryDetails')!)
    console.log(scheduledDeliveryDetails)

    this.fillingStationDocumentId = scheduledDeliveryDetails.fillingStationDocumentId
    this.scheduledFilingDocumentId = scheduledDeliveryDetails.id
    this.scheduledDate = scheduledDeliveryDetails.scheduledDate
    this.scheduledTime = scheduledDeliveryDetails.scheduledTime
    this.scheduledFuelType = scheduledDeliveryDetails.scheduledFuelType
    this.scheduledFuelAmount = scheduledDeliveryDetails.scheduledFuelAmount
    this.status = scheduledDeliveryDetails.status
    
    this.getFillingStationDetails()
  }

  getFillingStationDetails() {
    this.fillingStationRef.doc(this.fillingStationDocumentId).ref.get().then( (doc) => {
      if (doc.exists) {
        this.fillingStationDetails = doc.data()
        console.log(this.fillingStationDetails)
        this.stationId = this.fillingStationDetails.stationId
        this.stationName = this.fillingStationDetails.stationName
        this.phone = this.fillingStationDetails.phone
        this.address = this.fillingStationDetails.address
      } else {
        console.log("There is no document!");
      }
    }).catch(function (error) {
      console.log("There was an error getting your document:", error);
    })
  }

  updateScheduledFilling(deliveryStatus: any) {

    this.dbPathScheduledFilling = '/fillingStations/' + this.fillingStationDocumentId + '/sheduledFilings'
    this.scheduledFillingRef = this.angularFireStore.collection(this.dbPathScheduledFilling);

    let data = {
      status: deliveryStatus
    }

    this.scheduledFillingRef.doc(this.scheduledFilingDocumentId).update(data).then(() => {
      if (data.status === 'DONE') {
        this.status = 'DONE'
        this.alertService.showSuccess("Scheduled delivery completed.")  
      } else if (data.status === 'CANCELLED') {
        this.updateHeadStock()
      }
    })
  }

  // this is about adding scheduled fuel amounts to head stocks again if the order is cancelled
  updateHeadStock() {

    let headStockData = {}

    if (this.scheduledFuelType === 'Petrol') {
      
      headStockData = {
        Petrol: (Number(this.headStock.Petrol) + Number(this.scheduledFuelAmount))
      }

    } else if (this.scheduledFuelType === 'Diesel') {
      
      headStockData = {
        Diesel: (Number(this.headStock.Diesel) + Number(this.scheduledFuelAmount))
      }
    
    }

    this.headStocksRef.doc(this.headStock.id).update(headStockData).then(() => {
      this.status = 'CANCELLED'
      this.alertService.showSuccess("Scheduled delivery cancelled.") 
    })

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

  openCompleteConfirmationDialog(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }

  openCancellationConfirmationDialog(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }
}