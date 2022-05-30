import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private saveNewUserAddressUrl = 'http://localhost:3000/api/users'

  constructor(private HttpClient: HttpClient) { }

  saveNewUserAddress(new_user_address:any)
  {
    return this.HttpClient.post(this.saveNewUserAddressUrl, new_user_address)
    .subscribe(
      error => console.log(error)
    );
  }

    // Error handling
    private error (error: any) {
      let message = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(message);
    }
}
