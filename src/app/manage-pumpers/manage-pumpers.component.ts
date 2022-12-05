import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-manage-pumpers',
  templateUrl: './manage-pumpers.component.html',
  styleUrls: ['./manage-pumpers.component.css']
})
export class ManagePumpersComponent implements OnInit {

  selectedFuelStationForSearch: any
  selectedStationNameForSearch: any

  selectedFuelStationToAddPumper: any

  email: any
  password: any

  pumpers: Array<any> = new Array<any>()
  isSearched: boolean = false
  searchedResults: Array<any> = new Array<any>()

  fuelStations: Array<any> = new Array<any>()

  private dbPathFillingStations = '/fillingStations';

  fuelStationsRef: AngularFirestoreCollection<any>;
  usersRef: AngularFirestoreCollection<any>;

  constructor(private angularFireStore: AngularFirestore, 
              private angularFireAuth: AngularFireAuth, 
              private alertService: AlertService, 
              private dialog: MatDialog) {
    this.fuelStationsRef = this.angularFireStore.collection(this.dbPathFillingStations)
    this.usersRef = this.angularFireStore.collection('users', ref => ref.where('type', '==', 'pumper'));
   }

  ngOnInit(): void {
    this.retrieveFuelStations()
    this.retrievePumpers()
  }

  searchByFuelStation() {
    // console.log(this.selectedFuelStation)
    this.selectedStationNameForSearch = this.selectedFuelStationForSearch.stationName

    if (this.selectedFuelStationForSearch != null) {
      this.isSearched = true
      this.pumpers.forEach(pumper => {
        if (pumper.fillingStationId === this.selectedFuelStationForSearch.id) {
          this.searchedResults.push(pumper)
        }
      });
    }
    
  }

  createNewPumper() {
    if ((this.selectedFuelStationToAddPumper != null && this.selectedFuelStationToAddPumper != '') && (this.email != null && this.email != '') && (this.password != null && this.password != '')) {
      this.angularFireAuth.createUserWithEmailAndPassword(this.email, this.password)
      .then( res => {
        console.log(res.user?.uid)
        
        let pumper = {
          email: res.user?.email,
          uid: res.user?.uid,
          fillingStationId: this.selectedFuelStationToAddPumper.id,
          fillingStationName: this.selectedFuelStationToAddPumper.stationName,
          type: "pumper"
        }

        this.usersRef.add({ ...pumper }).then((res) => {
          console.log(res)
          this.clear()
          this.alertService.showSuccess("A new pumper added successfully.")
        })

      })
      .catch( error => {
        this.alertService.showError(error.message)
      })
    } else {
      this.alertService.showError("Please fill all the required * fields.")
    }
  }

  retrieveFuelStations(): void {
    this.fuelStationsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.fuelStations = data;
    });
  }

  retrievePumpers(): void {
    this.usersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.pumpers = data;
    });
  }

  clear() {
    this.email = null
    this.password = null
  }

  openAddNewPumperModal(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }

}
