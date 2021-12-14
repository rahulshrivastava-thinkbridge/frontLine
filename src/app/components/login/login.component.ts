import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { loginForm } from '../shared/constants';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public showModal: boolean;
  public loginForm: FormGroup;
  public submitted: boolean;
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
  public loginHeaderName: string;
  public loginSuccessMassage: string;
  public loginWelcome: string;
  public loginLogoSuccess: any;
  public loginLogoError: any;
  public loginErrorText: any;
  public loginErrorTitle: any;
  public loading$: any;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService,
    private router: Router, public loader: LoaderService) {
    this.loading$ = this.loader.loading$;
    this.loginLogoError = loginForm.LOGIN_LOGO_ERROR
    this.loginErrorText = loginForm.LOGIN_ERROR_TEXT
    this.loginErrorTitle = loginForm.LOGIN_ERROR_TITLE
    this.loginSuccessMassage = loginForm.LOGIN_SUCCES_MASSAGE;
    this.loginWelcome = loginForm.LOGIN_WELCOME;
    this.loginLogoSuccess = loginForm.LOGIN_LOGO_SUCCESS;
    this.submitted = false
    this.hide = true;
    this.userName = loginForm.USER_NAME;
    this.passwordName = loginForm.PASSWORD_TITLE;
    this.userError = loginForm.USER_NAME_ERROR;
    this.passwordError = loginForm.PASSWORD_NAME_ERROR;
    this.passwordErrorMinlength = loginForm.PASSWORD_NAME_ERROR_MINLENGTH;
    this.loginButton = loginForm.LOGIN_BUTTON_NAME;
    this.rememberMe = loginForm.REMEMBER_ME;
    this.forgotPassword = loginForm.FORGOT_PASSWORD;
    this.loginHeaderName = loginForm.LOGIN_HEADER_NAME;
  }

  ngOnInit() {
    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls }

  show() {
    this.showPassword = true;
  }

  hides() {
    this.showPassword = false;
  }

  onLogin() {
    this.submitted = true;
    this.loader.show();
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
        this.loader.hide();
        const data = response;
        if (data.token) {
          Swal.fire(
            this.loginSuccessMassage,
            this.loginWelcome + response.firstName + ' ' + response.lastName + '!',
            this.loginLogoSuccess
          )
          localStorage.setItem('firstName', response.firstName)
          localStorage.setItem('lastName', response.lastName)
          localStorage.setItem('token', data.token);
          this.router.navigate(['/invoices']);
        }
      }, (error) => {
        this.loader.hide();
        Swal.fire({
          icon: this.loginLogoError,
          title: this.loginErrorTitle,
          text: this.loginErrorText,
        })
      }, () => {
      }).add(() => {
        unsubscribe.unsubscribe();
      })
    }
  }

}
