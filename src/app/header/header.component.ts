import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private angularFireAuth: AngularFireAuth, 
              private router: Router) { }

  ngOnInit(): void {
  }

  signOut() {
    this.angularFireAuth.signOut()
    this.router.navigateByUrl('/sign-in')
  }

}
