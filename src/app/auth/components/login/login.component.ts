import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup // ! means that trust me this field is gonna has a value won't be null or undefined
  users:any[] = []
  type:string = 'students'
  constructor(private fb:FormBuilder, private authService:AuthService, private router:Router, private toaster:ToastrService){

  }
  ngOnInit(): void {
    this.createForm();
    this.getUsers();
  }
  
  createForm(){
    this.loginForm = this.fb.group({
      type:[this.type],
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]]
    })
  }

  getRole(event:any){
    this.type = event.value;
    this.getUsers()
  }

  getUsers(){
     this.authService.getAllUsers(this.type).subscribe(
      (res:any) => {
        this.users = res;
      },
      (err) => {
        alert("Some error occured!")
      }
     )
  }

  submit(){

    let index = this.users.findIndex(item => (item.email == this.loginForm.value.email && item.password == this.loginForm.value.password));
    if(index == -1){
      this.toaster.error("The email address or password is incorrect. Please try again...!", "", {
        disableTimeOut:false,
        titleClass:"toastr_title",
        messageClass: "toastr_message",
        timeOut:5000,
        closeButton:false
      })
    }
    else{

      const model = {
        username:this.users[index].username,
        role:this.type,
        userId:this.users[index].id
      }

      this.authService.login(model).subscribe(
        (res) => {
          this.authService.userSubject.next(res); // userSubject here works as a observer
          this.toaster.success("You have successfully logged-in!", "", {
            disableTimeOut:false,
            titleClass:"toastr_title",
            messageClass:"toastr_message",
            timeOut:5000,
            closeButton:true
          })
          this.router.navigate(['/subjects'])
        },
        (err) => {
          this.toaster.error("some error occured!", "", {
            disableTimeOut:false,
            titleClass:"toastr_title",
            messageClass:"toastr_message",
            timeOut:5000,
            closeButton:false
          })
        }
      )

      
    }
  }


}
