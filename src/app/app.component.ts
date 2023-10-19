import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'MCQ_Exam_App';
  constructor(private authService:AuthService){

  }
  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(){
    this.authService.getRole().subscribe( // this  is observable
      (res) => {
        this.authService.userSubject.next(res); // userSubject here works as a observer
      }
    )
  }
}
