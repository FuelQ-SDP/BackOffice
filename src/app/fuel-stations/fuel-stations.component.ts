import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-fuel-stations',
  templateUrl: './fuel-stations.component.html',
  styleUrls: ['./fuel-stations.component.css']
})
export class FuelStationsComponent implements OnInit {

  districts = ["All", "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
               "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
                "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
                 "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
                  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"]

  fuelStations: Array<any> = new Array<any>()
  searchedResults: Array<any> = new Array<any>()

  selectedDistrict: any = 'All'
  isSearched: boolean = false

  private dbPath = '/fillingStations';
  fuelStationsRef: AngularFirestoreCollection<any>;

  constructor(private router: Router, 
              private angularFireStore: AngularFirestore) {
      this.fuelStationsRef = this.angularFireStore.collection(this.dbPath);
  }

  ngOnInit(): void {
    this.retrieveFuelStations()
  }

  navigateToFuelStation(stationDetails: any) {
    sessionStorage.setItem('fuelStationDetails', JSON.stringify(stationDetails))
    this.router.navigateByUrl('/main/fuel-station')
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

  searchByDistrict() {
    if (this.selectedDistrict === 'All') {
      this.isSearched = false
    } else {
      this.isSearched = true
      this.searchedResults = []
      this.fuelStations.forEach(fuelStation => {
        if (fuelStation.district === this.selectedDistrict) {
          this.searchedResults.push(fuelStation)
        }
      });
    }
  }
}
