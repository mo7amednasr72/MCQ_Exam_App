import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})

export class SubjectsComponent implements OnInit{

  subjects:any[]=[]
  user:any

  constructor(private doctorService:DoctorService, private toaster:ToastrService,
    private authService:AuthService ){

  }

  ngOnInit(): void {
    this.getSubjects();
    this.getUserInfo();
  }

  getSubjects(){
    this.doctorService.getAllSubjects().subscribe(
      (res:any) => {
        this.subjects = res;
      },
      (err) => {
        this.toaster.error("Some Error Occured!")
      }
    )
  }


  getUserInfo(){
    this.authService.getRole().subscribe(
      res => {
        this.user = res;
      },
      err => {
        this.toaster.error("Some Error Occured!")
      }
    )
  }

  deleteExam(index:number){
    let subjectId = this.subjects[index].id;
    let subjectName = this.subjects[index].name;
    this.subjects.splice(index, 1)

    this.doctorService.deleteSubjectExam(subjectId).subscribe(
      res => {
        this.toaster.success(`${subjectName} Exam has been deleted successfully!`)
      },
      err => {
        this.toaster.error("Some Error Occured!")
      }
    )
  }

}
