import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private httpRequest:HttpClient) { }

  CreateSubjectExam(model:any){
    return this.httpRequest.post(environment.baseApi + 'subjects', model)
  }

  updateSubjectExam(model:any, id:number){
    return this.httpRequest.put(environment.baseApi + 'subjects/' + id, model)
  }

  getAllSubjects(){
    return this.httpRequest.get(environment.baseApi + 'subjects')
  }

  getSubjectById(id:number){
    return this.httpRequest.get(environment.baseApi + 'subjects/' + id)
  }

  deleteSubjectExam(id:number){
    return this.httpRequest.delete(environment.baseApi + 'subjects/' + id)
  }
}
