import { Component, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string;
  storage: Storage = sessionStorage;
  private KEY_STORAGE_EMAIL: string = 'userEmailStorage';

  constructor(private oktaAuthService: OktaAuthStateService,
              private oktaAuth: OktaAuth) { }

  ngOnInit(): void {

    // Subscribe to authenticate state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );

  }
  
  getUserDetails() {
    if(this.isAuthenticated){
      // Fetch the logged in user details ( user's claims )

      // user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name!;

          // retrieve the user's email from authentication response
          const theEmail = res.email;

          // now store the email in browser storage
          this.storage.setItem(this.KEY_STORAGE_EMAIL, JSON.stringify(theEmail));

        }
      )
    }
  }

  logout(){

        // clear session storage from browser
        sessionStorage.clear();

        // Terminates the session with Okta and removes current tokens.
        this.oktaAuth.signOut();
  }

}
