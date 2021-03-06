import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { PasswordToggleComponent } from '../../shared/components/password-toggle/password-toggle.component';

import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['../child.component.scss']
})
export class PasswordResetComponent implements OnInit {
  @ViewChild(PasswordToggleComponent)
  toggler: PasswordToggleComponent;

  private oobCode: string;

  email: string;
  newPassword: string;
  validCode: boolean;

  private activatedRoute: ActivatedRoute;
  private auth: AuthService;
  private router: Router;
  private loader: LoaderService;

  constructor(activatedRoute: ActivatedRoute, auth: AuthService, router: Router, loader: LoaderService) {
    this.activatedRoute = activatedRoute;
    this.auth = auth;
    this.router = router;
    this.loader = loader;

    this.validCode = true;
  }

  ngOnInit(): void {
    this.loader.setState(true);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.oobCode = params.oobCode;
      this.auth.verifyPasswordResetCode(this.oobCode)
        .then(email => {
          this.loader.setState(false);
          this.email = email;
        }).catch(error => {
          this.loader.setState(false);
          this.validCode = false;
          console.log(error.message);
        })
    });
  }

  resetPassword(): void {
    this.loader.setState(true);
    this.auth.resetPassword(this.oobCode, this.newPassword).then(() => {
      return this.auth.login(this.email, this.newPassword);
    }).then(() => {
      this.loader.setState(false);
      this.router.navigate(['/home']);
    }).catch(error => {
      this.loader.setState(false);
      console.log(error)
    });
  }
}
