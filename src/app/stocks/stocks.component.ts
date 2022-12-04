import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { HeadStockDto } from '../core/dtos/HeadStock';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {

  fuelTypes = ['Petrol', 'Diesel']

  fuelType: any
  fuelAmount: any

  displayedColumns = ['index', 'fuelType', 'amount', 'date']
  stocks: Array<any> = new Array<any>()
  headStock: HeadStockDto = new HeadStockDto()

  private dbPathHeadStock = '/headStocks';
  private dbPathFuelStocks = '/fuelStocks';

  headStocksRef: AngularFirestoreCollection<any>;
  fuelStocksRef: AngularFirestoreCollection<any>;

  constructor(private dialog: MatDialog, 
              private alertService: AlertService,
              private angularFireStore: AngularFirestore 
              ) {
      this.headStocksRef = this.angularFireStore.collection(this.dbPathHeadStock);
      this.fuelStocksRef = this.angularFireStore.collection(this.dbPathFuelStocks);
  }

  ngOnInit(): void {
    this.retrieveFuelStocks()
    this.retrieveHeadStock()
  }

  openAddNewModal(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }

  addFuelStock() {
    if ((this.fuelType != null && this.fuelType != '') && (this.fuelAmount != null && this.fuelAmount != '')) {
      
      let fuelStockData = {
        fuelType: this.fuelType,
        fuelAmount: this.fuelAmount,
        addedDate: new Date().toLocaleString()
      }

      this.fuelStocksRef.add({...fuelStockData}).then( () => {

        let headStockData = {
          Petrol: this.fuelType === 'Petrol' ? (Number(this.headStock.Petrol) + Number(this.fuelAmount)) : this.headStock.Petrol,
          Diesel: this.fuelType === 'Diesel' ? (Number(this.headStock.Diesel) + Number(this.fuelAmount)) : this.headStock.Diesel
        }
        this.headStocksRef.doc(this.headStock.id).update(headStockData).then(() => {
          this.clear()
          this.alertService.showSuccess("A new fuel-stock added & stocks updated successfully.")
        })
      })

    } else {
      this.alertService.showError("Please fill all required* fields.")
    }
  }

  clear() {
    this.fuelType = null
    this.fuelAmount = null
  }

  retrieveFuelStocks(): void {
    this.fuelStocksRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.stocks = data;
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
}
