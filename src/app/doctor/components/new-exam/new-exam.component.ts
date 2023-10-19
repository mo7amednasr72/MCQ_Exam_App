import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';
import { DoctorService } from '../../services/doctor.service';

@Component({
  selector: 'app-new-exam',
  templateUrl: './new-exam.component.html',
  styleUrls: ['./new-exam.component.scss']
})
export class NewExamComponent implements OnInit {

  name = new FormControl("");
  questionForm!:FormGroup
  questions:any[]=[] 
  correctAnsName:any
  startAdd:boolean=false;
  openPreview:boolean=false;
  subjectName:string =""
  stepperIndex = 0;
  id:any // to delete some question at preview time

  constructor(private fb:FormBuilder, private toaster:ToastrService, private doctorService:DoctorService){

  }

  ngOnInit(): void {
    this.createQuestionForm();
  }

  start(){
    if(this.startAdd){
      this.stepperIndex = 1;
      return;
    }
    if(this.name.value == ''){
      this.toaster.error("Please Enter Subject Name First!")
    }
    else{
      this.subjectName = String(this.name.value);
      this.startAdd = true;
    }
  }

  createQuestionForm(){
    this.questionForm = this.fb.group({
      question:['', [Validators.required]],
      answer1:['', [Validators.required]],
      answer2:['', [Validators.required]],
      answer3:['', [Validators.required]],
      answer4:['', [Validators.required]],
    })
  }

  getCorrectAns(event:any){
    this.correctAnsName = event.value;
  }

  saveQuestion(){
    if(this.correctAnsName){
      const model = {
        question: this.questionForm.value.question,
        answer1: this.questionForm.value.answer1,
        answer2: this.questionForm.value.answer2,
        answer3: this.questionForm.value.answer3,
        answer4: this.questionForm.value.answer4,
        correctAnswer: this.questionForm.value[this.correctAnsName]
      }
      this.questions.push(model)
      this.questionForm.reset();
    }
    else{
      this.toaster.error("Please choose the correct answer!")
    }
  }

  removeQuestion(){
    this.questionForm.reset()
  }

  cancelExam(){
    this.questionForm.reset()
    this.questions = []
    this.subjectName = ""
    this.name.reset()
    this.stepperIndex = 0
    this.startAdd = false
  }

  saveExam(){

    if(this.openPreview){
      this.stepperIndex = 2;
      return;
    }

    const model = {
      name : this.subjectName,
      questions: this.questions,
    }

    this.doctorService.CreateSubjectExam(model).subscribe(
      (res:any) => {
        this.openPreview = true;
        this.id = res.id
      },
      (err) => {}
    )
    
  }

  removeAtPreview(indx:number){

    this.questions.splice(indx, 1) //  just delete one element from that index
    const model = {
      name: this.subjectName,
      questions: this.questions
    }
    this.doctorService.updateSubjectExam(model, this.id).subscribe(
      (res:any) => {
        this.toaster.success("The Question has been successfully deleted!")
      },
      (err:any) => {
        this.toaster.error("Some error occured!")
      }
    )
    
  }

}
