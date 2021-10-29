import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { LoginService } from '../../services/login.service';
import { loginForm } from '../shared/constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public title = 'angulartoastr';
  public showModal: boolean;
  public loginForm: FormGroup;
  public submitted = false;
  public hide!: Boolean;
  public showPassword: boolean;
  public input: any;
  public userName: string;
  public passwordName: string;
  public userError: string;
  public passwordError: string;
  public passwordErrorMinlength: string;
  public loginButton: string;
  public rememberMe: string;
  public forgotPassword: string

  constructor(private formBuilder: FormBuilder, private loginService: LoginService,
    private router: Router,) {
    this.hide = true;
    this.userName = loginForm.USER_NAME;
    this.passwordName = loginForm.PASSWORD_TITLE;
    this.userError = loginForm.USER_NAME_ERROR;
    this.passwordError = loginForm.PASSWORD_NAME_ERROR;
    this.passwordErrorMinlength = loginForm.PASSWORD_NAME_ERROR_MINLENGTH;
    this.loginButton = loginForm.LOGIN_BUTTON_NAME;
    this.rememberMe = loginForm.REMEMBER_ME;
    this.forgotPassword = loginForm.FORGOT_PASSWORD;
  }

  ngOnInit() {
    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  show() {
    this.showPassword = true;
  }

  hides() {
    this.showPassword = false;
  }

  onLogin() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    if (this.loginForm.valid || this.submitted) {
      const userName = this.loginForm.get('userName')?.value;
      const password = this.loginForm.get('password')?.value;
      const userDetail = {
        userName: userName,
        password: password,
      }
      const unsubscribe = this.loginService.login(userDetail).subscribe((response) => {
        const data = response;
        if (data.token) {
          Swal.fire(
            'Good job!',
            'Welcome aboard ' +  response.firstName + ' ' + response.lastName + '!',
            'success'
          )
          localStorage.setItem('firstName', response.firstName)
          localStorage.setItem('lastName', response.lastName)
          localStorage.setItem('token', data.token);
          this.router.navigate(['/invoices']);
        }
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Invalid credentials!',
        })
      }, () => {
      }).add(() => {
        unsubscribe.unsubscribe();
      })
    }
  }

}
