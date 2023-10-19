import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DoctorModule } from 'src/app/doctor/doctor.module';
import { DoctorService } from 'src/app/doctor/services/doctor.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {
  
  id:any
  examDetails:any
  user:any
  userData:any
  total:number = 0
  showRes:boolean = false
  userTakenExams:any[] = []
  validExam:boolean = true
  constructor(private route:ActivatedRoute, private doctorService:DoctorService,
    private toaster:ToastrService, private authService:AuthService){

  }

  ngOnInit(): void { // note that this ngOnInit() method is an async method
    this.id = this.route.snapshot.paramMap.get('id')
    this.getExamDetails()
    this.getUserLoggedIn();
  }

  getUserLoggedIn(){
    this.authService.getRole().subscribe(
      res => {
        this.user = res;
        this.getUserData(); // we called it here bc it depends on the execution of this method
      },
      err => {
        this.toaster.error("Some Error Occured!")
      }
    )
  }

  getUserData(){
    this.authService.getUserById(this.user.userId).subscribe(
      (res:any) => {
        this.userData = res;
        this.userTakenExams = res?.takenExams ? res?.takenExams : []
        this.validateExam() // since it depends on this method
      },
      err => {
        this.toaster.error("Some Error Occured!")
      }
    )
  }

  validateExam(){
    for(let item of this.userTakenExams){
      if(item.id == this.id){
        this.validExam = false
        this.total = item.degree
        this.toaster.warning("You've been tested for this exam and your result has been recorded already!")
      }
    }
    console.log(this.validExam)
  }

  getExamDetails(){
    this.doctorService.getSubjectById(this.id).subscribe(
      (res) => {
        this.examDetails = res;
      },
      (err) => {
        this.toaster.error("Some Error Occured!")
      }
    )
  }



  deleteQuestion(index:number){
    this.examDetails.questions.splice(index, 1)
    const model = {
      name: this.examDetails.name,
      questions: this.examDetails.questions
    }

    this.doctorService.updateSubjectExam(model, this.id).subscribe(
      res => {
        this.toaster.success(`Question no. ${index + 1} has been deleted successfully!`)
      },
      err => {
        this.toaster.error("Some error Occured!")
      }
    )
  }

  getAnswer(event:any){
    let value = event.value,
    questionIndex = event.source.name;
    this.examDetails.questions[questionIndex].studentAnswer = value; // add new property to that object
  }
  
  getResult(){
    this.showRes = true;
    for(let x of this.examDetails.questions){
      if(x.studentAnswer === x.correctAnswer)
        this.total++
    }

    this.userTakenExams.push(
      {
        name: this.examDetails.name,
          id: this.id, // exam id
          degree: this.total
      }
    )

    const model = {
      username: this.userData.username,
      email: this.userData.email,
      password: this.userData.password,
      takenExams: this.userTakenExams
    }

    this.authService.updateUserById(this.user.userId, model).subscribe(
      res => {
        this.toaster.success("Result has been successfully recorded!")
      },
      err => {
        this.toaster.error("Some error occured!")
      }
    )
  }

}
