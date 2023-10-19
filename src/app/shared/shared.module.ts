import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatrialModule } from './matrial.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    MatrialModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot() // ToastrModule added
  ],
  exports:[
    HttpClientModule,
    BrowserModule,
    RouterModule,
    MatrialModule,
    CommonModule,
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }