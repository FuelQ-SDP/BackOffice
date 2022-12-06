import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { ChartConfiguration, ChartOptions, Color } from 'chart.js';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public barChartLegendFuelDispatch = true;
  public barChartPluginsFuelDispatch = [];

  public barChartDataFuelDispatch: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Petrol (Ltrs)' },
      { data: [], label: 'Diesel (Ltrs)' },
    ]
  };

  public barChartOptionsFuelDispatch: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  // ========

  public barChartLegendPumpedFuelAmounts = true;
  public barChartPluginsPumpedFuelAmounts = [];

  public barChartDataPumpedFuelAmounts: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Petrol (Ltrs)' },
      { data: [], label: 'Diesel (Ltrs)' }
    ]
  };

  public barChartOptionsPumpedFuelAmounts: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  // ========

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Number of vehicle registrations',
        fill: true,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(151, 186, 222, 0.8)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;

  isLineChartDatLoaded: boolean = false
  isFuelDispatchBarChartDataLoaded: boolean = false
  isPumpedFuelBarChartDataLoaded: boolean = false

  customersCount = 0
  vehiclesCount = 0
  fillingStationsCount = 0

  vehicles: Array<any> = new Array<any>()
  dispatchedFuelArray: Array<any> = new Array<any>()
  pumpedFuelHistories: Array<any> = new Array<any>()

  private dbPathVehicles = 'vehicles';
  private dbPathPumpedFuelHistory = 'pumpedFuelHistory';
  private dbPathFillingStations = '/fillingStations';
  
  customersRef: AngularFirestoreCollection<any>;
  vehiclesGroupRef: AngularFirestoreCollectionGroup<any>;
  dispatchedFuelsRef: AngularFirestoreCollectionGroup<any>;
  pumpedFuelHistoriesRefs: AngularFirestoreCollectionGroup<any>;
  fillingStationsRef: AngularFirestoreCollection<any>;

  constructor(private angularFireStore: AngularFirestore) {
    this.customersRef = this.angularFireStore.collection('users', ref => ref.where('type', '==', 'customer'));
    this.vehiclesGroupRef = this.angularFireStore.collectionGroup(this.dbPathVehicles);
    this.fillingStationsRef = this.angularFireStore.collection(this.dbPathFillingStations);
    this.dispatchedFuelsRef = this.angularFireStore.collectionGroup('sheduledFilings', ref => ref.where('status', '==', 'DONE'));
    this.pumpedFuelHistoriesRefs = this.angularFireStore.collectionGroup(this.dbPathPumpedFuelHistory);
  }

  ngOnInit(): void {
    this.retrieveDashboardDetails()
  }

  retrieveDashboardDetails() {
    
    this.retrieveCustomers()
    this.retrieveVehicles()
    this.retrieveFillingStations()
    this.retrieveDispatchedFuel()
    this.retrievePumpedFuelHistories()

    this.lineChartData.labels = this.getPastDays(7)
    this.barChartDataFuelDispatch.labels = this.getPastDays(5)
    this.barChartDataPumpedFuelAmounts.labels = this.getPastDays(5)
    
  }

  customizeLineChart() {
    let vehicleCountsArray = [0, 0, 0, 0, 0, 0, 0]

    this.vehicles.forEach(vehicle => {
      if (vehicle.registeredDate) {
        switch (vehicle.registeredDate) {
          case this.lineChartData.labels?.toString().split(",")[0]:
            vehicleCountsArray[0] = Number(vehicleCountsArray[0]) + 1
            break;
          case this.lineChartData.labels?.toString().split(",")[1]:
            vehicleCountsArray[1] = Number(vehicleCountsArray[1]) + 1
            break;
          case this.lineChartData.labels?.toString().split(",")[2]:
            vehicleCountsArray[2] = Number(vehicleCountsArray[2]) + 1
            break;
          case this.lineChartData.labels?.toString().split(",")[3]:
            vehicleCountsArray[3] = Number(vehicleCountsArray[3]) + 1
            break;
          case this.lineChartData.labels?.toString().split(",")[4]:
            vehicleCountsArray[4] = Number(vehicleCountsArray[4]) + 1
            break;
          case this.lineChartData.labels?.toString().split(",")[5]:
            vehicleCountsArray[5] = Number(vehicleCountsArray[5]) + 1
            break;
          case this.lineChartData.labels?.toString().split(",")[6]:
            vehicleCountsArray[6] = Number(vehicleCountsArray[6]) + 1
            break;                
          default:
            console.log("Something went wrong in switch - line chart customizing")
            break;
        }
      }  
    });
    this.lineChartData.datasets[0].data = vehicleCountsArray
    this.isLineChartDatLoaded = true
  }

  customizeFuelDispatchSummaryBarChart() {
    let petrolDispatch = [0, 0, 0, 0, 0]
    let dieselDispatch = [0, 0, 0, 0, 0]

    this.dispatchedFuelArray.forEach(dispatchedFuel => {
      if (dispatchedFuel.scheduledDate) {
        switch (dispatchedFuel.scheduledDate) {
          case this.barChartDataFuelDispatch.labels?.toString().split(",")[0]:
            if (dispatchedFuel.scheduledFuelType === 'Petrol') {
              petrolDispatch[0] = Number(petrolDispatch[0]) + dispatchedFuel.scheduledFuelAmount
            } else if (dispatchedFuel.scheduledFuelType === 'Diesel') {
              dieselDispatch[0] = Number(dieselDispatch[0]) + dispatchedFuel.scheduledFuelAmount
            }
            break;
          case this.barChartDataFuelDispatch.labels?.toString().split(",")[1]:
            if (dispatchedFuel.scheduledFuelType === 'Petrol') {
              petrolDispatch[1] = Number(petrolDispatch[1]) + dispatchedFuel.scheduledFuelAmount
            } else if (dispatchedFuel.scheduledFuelType === 'Diesel') {
              dieselDispatch[1] = Number(dieselDispatch[1]) + dispatchedFuel.scheduledFuelAmount
            }
            break;
          case this.barChartDataFuelDispatch.labels?.toString().split(",")[2]:
            if (dispatchedFuel.scheduledFuelType === 'Petrol') {
              petrolDispatch[2] = Number(petrolDispatch[2]) + dispatchedFuel.scheduledFuelAmount
            } else if (dispatchedFuel.scheduledFuelType === 'Diesel') {
              dieselDispatch[2] = Number(dieselDispatch[2]) + dispatchedFuel.scheduledFuelAmount
            }
            break;
          case this.barChartDataFuelDispatch.labels?.toString().split(",")[3]:
            if (dispatchedFuel.scheduledFuelType === 'Petrol') {
              petrolDispatch[3] = Number(petrolDispatch[3]) + dispatchedFuel.scheduledFuelAmount
            } else if (dispatchedFuel.scheduledFuelType === 'Diesel') {
              dieselDispatch[3] = Number(dieselDispatch[3]) + dispatchedFuel.scheduledFuelAmount
            }
            break;
          case this.barChartDataFuelDispatch.labels?.toString().split(",")[4]:
            if (dispatchedFuel.scheduledFuelType === 'Petrol') {
              petrolDispatch[4] = Number(petrolDispatch[4]) + dispatchedFuel.scheduledFuelAmount
            } else if (dispatchedFuel.scheduledFuelType === 'Diesel') {
              dieselDispatch[4] = Number(dieselDispatch[4]) + dispatchedFuel.scheduledFuelAmount
            }
            break;         
          default:
            console.log("Something went wrong in switch - fuel dispatch bar chart customizing")
            break;
        }
      }
    });
    this.barChartDataFuelDispatch.datasets[0].data = petrolDispatch
    this.barChartDataFuelDispatch.datasets[1].data = dieselDispatch
    this.isFuelDispatchBarChartDataLoaded = true
  }

  customizeFuelPumpingSummaryBarChart() {
    let pumpedPetrol = [0, 0, 0, 0, 0]
    let pumpedDiesel = [0, 0, 0, 0, 0]

    this.pumpedFuelHistories.forEach(pumpedHistory => {
      if (pumpedHistory.pumpedDate) {
        switch (pumpedHistory.pumpedDate) {
          case this.barChartDataPumpedFuelAmounts.labels?.toString().split(",")[0]:
            if (pumpedHistory.fuelType === 'Petrol') {
              pumpedPetrol[0] = Number(pumpedPetrol[0]) + pumpedHistory.pumpedFuelAmount
            } else if (pumpedHistory.fuelType === 'Diesel') {
              pumpedDiesel[0] = Number(pumpedDiesel[0]) + pumpedHistory.pumpedFuelAmount
            }
            break;
          case this.barChartDataPumpedFuelAmounts.labels?.toString().split(",")[1]:
            if (pumpedHistory.fuelType === 'Petrol') {
              pumpedPetrol[1] = Number(pumpedPetrol[1]) + pumpedHistory.pumpedFuelAmount
            } else if (pumpedHistory.fuelType === 'Diesel') {
              pumpedDiesel[1] = Number(pumpedDiesel[1]) + pumpedHistory.pumpedFuelAmount
            }
            break;
          case this.barChartDataPumpedFuelAmounts.labels?.toString().split(",")[2]:
            if (pumpedHistory.fuelType === 'Petrol') {
              pumpedPetrol[2] = Number(pumpedPetrol[2]) + pumpedHistory.pumpedFuelAmount
            } else if (pumpedHistory.fuelType === 'Diesel') {
              pumpedDiesel[2] = Number(pumpedDiesel[2]) + pumpedHistory.pumpedFuelAmount
            }
            break;
          case this.barChartDataPumpedFuelAmounts.labels?.toString().split(",")[3]:
            if (pumpedHistory.fuelType === 'Petrol') {
              pumpedPetrol[3] = Number(pumpedPetrol[3]) + pumpedHistory.pumpedFuelAmount
            } else if (pumpedHistory.fuelType === 'Diesel') {
              pumpedDiesel[3] = Number(pumpedDiesel[3]) + pumpedHistory.pumpedFuelAmount
            }
            break;
          case this.barChartDataPumpedFuelAmounts.labels?.toString().split(",")[4]:
            if (pumpedHistory.fuelType === 'Petrol') {
              pumpedPetrol[4] = Number(pumpedPetrol[4]) + pumpedHistory.pumpedFuelAmount
            } else if (pumpedHistory.fuelType === 'Diesel') {
              pumpedDiesel[4] = Number(pumpedDiesel[4]) + pumpedHistory.pumpedFuelAmount
            }
            break;         
          default:
            console.log("Something went wrong in switch - fuel pumped bar chart customizing")
            break;
        }
      }
    });
    this.barChartDataPumpedFuelAmounts.datasets[0].data = pumpedPetrol
    this.barChartDataPumpedFuelAmounts.datasets[1].data = pumpedDiesel
    this.isPumpedFuelBarChartDataLoaded = true
  }

  getPastDays(daysCount: number): any {
    let result = [];
    for (var i=0; i < daysCount; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        result.unshift(this.formatDate(d))
    }
    return result;
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

  retrieveCustomers(): void {
    this.customersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.customersCount = data.length;
    });
  }

  retrieveVehicles(): void {
    this.vehiclesGroupRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.vehicles = data
      this.vehiclesCount = data.length;
      this.customizeLineChart()
    });
  }

  retrieveFillingStations(): void {
    this.fillingStationsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.fillingStationsCount = data.length;
    });
  }

  retrieveDispatchedFuel(): void {
    this.dispatchedFuelsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.dispatchedFuelArray = data
      this.customizeFuelDispatchSummaryBarChart()
    });
  }

  retrievePumpedFuelHistories(): void {
    this.pumpedFuelHistoriesRefs.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.pumpedFuelHistories = data
      this.customizeFuelPumpingSummaryBarChart()
    });
  }

}
