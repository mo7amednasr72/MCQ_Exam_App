import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user:any = null
  constructor(private authService:AuthService, private toaster:ToastrService){
  }
  ngOnInit(): void {
    this.authService.userSubject.subscribe( // user subject works here as a observable
      (res:any) => {
        if(res.role)
         this.user = res;
        else
          this.user = null
      },
      (err) => {
        alert("some error occured!");
      }
    )
  }

  logout(){
    const model = {}
    this.authService.login(model).subscribe(
      (res) => {
        this.authService.userSubject.next(res);
        this.toaster.success("You have logged out successfully!", "",
        {
          disableTimeOut:false,
          titleClass:"toastr_title",
          messageClass: "toastr_message",
          timeOut:5000,
          closeButton:true
        })
      },
      (err) => {
        this.toaster.success("Some error occured!", "",
        {
          disableTimeOut:false,
          titleClass:"toastr_title",
          messageClass: "toastr_message",
          timeOut:5000,
          closeButton:true
        })
      }
    )
  }

}
