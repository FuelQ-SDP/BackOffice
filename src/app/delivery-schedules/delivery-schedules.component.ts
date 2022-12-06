import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-delivery-schedules',
  templateUrl: './delivery-schedules.component.html',
  styleUrls: ['./delivery-schedules.component.css']
})
export class DeliverySchedulesComponent implements OnInit {

  currentDate: any

  private dbPath = 'sheduledFilings';

  schedules: Array<any> = new Array<any>()
  schedulesRef: AngularFirestoreCollectionGroup<any>;

  constructor(private angularFireStore: AngularFirestore,
              private router: Router) { 
    this.schedulesRef = this.angularFireStore.collectionGroup(this.dbPath);
  }

  ngOnInit(): void {
    this.currentDate = this.formatDate(new Date())
    this.retrieveScheduledDeliveries()
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

  retrieveScheduledDeliveries(): void {
    this.schedulesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log(data)
      this.schedules = data;
    });
  }

  navigateToScheduledDelivery(schedule: any) {
    sessionStorage.setItem('scheduledDeliveryDetails', JSON.stringify(schedule))
    this.router.navigateByUrl('/main/schedule-details')
  }

}
