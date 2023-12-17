import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true' ? true : false;

  constructor() { }
}
