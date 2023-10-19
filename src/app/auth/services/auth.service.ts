import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubject = new Subject();
  constructor(private httpRequest:HttpClient) {

  }

  createUser(model:any){
    return this.httpRequest.post(environment.baseApi + 'students', model)
  }

  getAllUsers(type:string){
    return this.httpRequest.get(environment.baseApi + type)
  }

  getUserById(id:number){
    return this.httpRequest.get(environment.baseApi + 'students/' + id);
  }

  updateUserById(id:number, model:any){
    return this.httpRequest.put(environment.baseApi + 'students/' + id, model);
  }

  login(model:any){
    return this.httpRequest.put(environment.baseApi + 'login/1', model)
  }

  getRole(){
    return this.httpRequest.get(environment.baseApi + 'login/1');
  }

}
