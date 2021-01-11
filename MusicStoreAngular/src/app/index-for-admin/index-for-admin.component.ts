import { Component, OnInit } from '@angular/core';
import {AuthGuardService} from '../auth-guard.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-index-for-admin',
  templateUrl: './index-for-admin.component.html',
  styleUrls: ['./index-for-admin.component.css']
})
export class IndexForAdminComponent implements OnInit {

  constructor(
    private authService: AuthGuardService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  isAdmin(): boolean {
    return this.authService.isAdminVar();
  }

  isLogged(): boolean {
    return this.authService.isLoggedVar();
  }
}
