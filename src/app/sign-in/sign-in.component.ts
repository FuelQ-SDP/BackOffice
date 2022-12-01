import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertService } from '../core/services/alert.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  email: any
  password: any

  constructor(private angularFireAuth: AngularFireAuth, 
              private router: Router,
              private alertService: AlertService) { }

  ngOnInit(): void {
  }

  signIn() {
    this.angularFireAuth.signInWithEmailAndPassword(this.email, this.password)
    .then( res => {
      console.log(res)
      this.router.navigateByUrl('/main/dashboard')
    })
    .catch( error => {
      this.filterError(error.message)
    })
  }

  filterError(errorMessage: string) {
    let message = errorMessage.split(": ")[1]
    message = message.split("(")[0]
    this.alertService.showError(message)
  }

}
