import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Buy100tokensComponent } from '../buy100tokens/buy100tokens.component';
import { Buy10tokensComponent } from '../buy10tokens/buy10tokens.component';
import { Buy200tokensComponent } from '../buy200tokens/buy200tokens.component';
import { BuycustomtokensComponent } from '../buycustomtokens/buycustomtokens.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-achat-tokens',
  templateUrl: './achat-tokens.component.html',
  styleUrls: ['./achat-tokens.component.css']
})


export class AchatTokensComponent implements OnInit {

  constructor(private dialog: MatDialog, public authService: AuthService, private route: Router) { }

  ngOnInit(): void {
    if(!this.authService.isConnected()) {
      this.route.navigateByUrl('login');
    }
  }


  openDialog10(): void {
    const dial = this.dialog.open(Buy10tokensComponent, {
      width: '45%',
    });
  }

  openDialog100(): void {
    const dial = this.dialog.open(Buy100tokensComponent, {
      width: '45%',
    });
  }

  openDialog200(): void {
    const dial = this.dialog.open(Buy200tokensComponent, {
      width: '45%',
    });
  }

  openDialogCustom(): void {
    const dial = this.dialog.open(BuycustomtokensComponent, {
      width: '45%',
    });
  }
}
