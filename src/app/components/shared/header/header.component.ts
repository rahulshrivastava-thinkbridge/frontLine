import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { header } from '../constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public firstName: string;
  public lastName: string;
  public logouts: string;
  public userName: string;

  constructor(private router: Router) {
    this.logouts = header.LOGOUT;
    this.userName = header.HEADER_NAME;
  }

  ngOnInit(): void {
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
