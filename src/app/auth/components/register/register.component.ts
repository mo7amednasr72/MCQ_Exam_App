import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userForm!:FormGroup;
  students:any[] = []
  constructor(private FBService:FormBuilder,
      private authService: AuthService,
      private router:Router,
      private toast:ToastrService){

  }

  ngOnInit(): void {
    this.createForm();
    this.getStudents();
  }

  getStudents(){
    this.authService.getAllUsers('students').subscribe(
      (res:any) => {
        this.students = res;
      }
    )
  }

  createForm(){
    this.userForm = this.FBService.group({
      username:['', [Validators.required]],
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      confirmPassword:['', [Validators.required]]
    })
  }

  submit(){
    // anonymous object
    const model = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password
    }

    let index = this.students.findIndex(item => item.email == this.userForm.value.email);
    // index = -1 means that e-mail doesn't exist in the database!
    if(index != -1){
      this.toast.error("E-mail already exists!", "", {
        disableTimeOut:false,
        titleClass:"toastr_title",
        messageClass: "toastr_message",
        timeOut:5000,
        closeButton: true
      })
    }
    else{

      this.authService.createUser(model).subscribe(
        (res:any) => {
          this.toast.success("Account has been created successfully!", "", {
            disableTimeOut:false,
            titleClass:"toastr_title",
            messageClass: "toastr_message",
            timeOut:5000,
            closeButton: true
          })
          const model = {
            username:res.username,
            role:'students',
            userId:res.id
          }
          this.authService.login(model).subscribe(res => {
            this.authService.userSubject.next(res)
          })
          this.router.navigate(['/subjects'])
        },
        (err) => {
          this.toast.error("Some errors happened!", "", {
            disableTimeOut:false,
            titleClass:"toastr_title",
            messageClass: "toastr_message",
            timeOut:5000,
            closeButton: true
          })
        }
      )
    }

  }

}
