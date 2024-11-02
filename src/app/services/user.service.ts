import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://dentavibe-backend.onrender.com/api/users'; // Base URL for your backend API

  constructor(private http: HttpClient) {}

  // Method to create a new user
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }
}
