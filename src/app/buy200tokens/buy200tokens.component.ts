import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BuyTokenService } from '../services/buytoken.service';
import { HostService } from '../services/host.service';

@Component({
  selector: 'app-buy200tokens',
  templateUrl: './buy200tokens.component.html',
  styleUrls: ['./buy200tokens.component.css']
})
export class Buy200tokensComponent implements OnInit {
  cb: any;
  connectedUser: any;

  regexNom = new RegExp('[a-zA-Z]+');
  regexCarte = new RegExp('[0-9]{16}$');
  regexCVC = new RegExp('[0-9]{3}$');
  regexMM = new RegExp('(0[1-9]|1[0-2])$');
  regexYYYY = new RegExp('[0-9]{4}$');
  regexPrepayee = new RegExp('[a-zA-Z]{3}-[a-zA-Z]{3}-[a-zA-Z]{3}$');

  msgAttributManquant = "Un attribut est manquant";
  msgNomIncorrect = "Le nom du détenteur n'est pas valide";
  msgCarteIncorrecte = "Le numéro de carte n'est pas valide. Il doit contenir 16 chiffres";
  msgCVCIncorrect = "Le CVC est incorrect. Il se situe au dos de votre carte";
  msgDateIncorrecte = "Merci d'entrer une date d'expiration valide au format MM/YYYY (ex. 05/2024)";
  msgPrepayeeIncorrecte = "Le numéro de carte prépayée est incorrect";


  constructor(private http: HttpClient, public authService: AuthService, public buytokenService: BuyTokenService, private host: HostService, private route : Router) { }

  ngOnInit(): void {
    if(!this.authService.isConnected()){
      this.route.navigateByUrl('login');
      this.authService.msgErr = "Veuillez vous connecter";
    }
  }

  pay200(val: any) {
    this.cb = val;
    this.buytokenService.msgErrCB200 = '';
    this.buytokenService.msgOKCB200 = '';
    this.buytokenService.msgErrPrepayee200 = '';
    this.buytokenService.msgOKPrepayee200 = '';



    if (this.cb.nom == "" || this.cb.numcarte == "" || this.cb.cvc == "" || this.cb.moisexp == "" || this.cb.anexp == "" || this.cb.prepayee == "") {
      this.buytokenService.msgErrPrepayee200 = this.msgAttributManquant;
      this.buytokenService.msgErrCB200 = this.msgAttributManquant;

    } else {
      if (!this.regexNom.test(this.cb.nom)) {
        this.buytokenService.msgErrCB200 = this.msgNomIncorrect;
      }
      if (!this.regexCarte.test(this.cb.numcarte)) {
        this.buytokenService.msgErrCB200 = this.msgCarteIncorrecte;
      }
      if (!this.regexCVC.test(this.cb.cvc)) {
        this.buytokenService.msgErrCB200 = this.msgCVCIncorrect;
      }
      if (!this.regexMM.test(this.cb.moisexp)) {
        this.buytokenService.msgErrCB200 = this.msgDateIncorrecte;
      }
      if (!this.regexYYYY.test(this.cb.anexp)) {
        this.buytokenService.msgErrCB200 = this.msgDateIncorrecte;
      }
      if (!this.regexPrepayee.test(this.cb.carteprepayee)) {
        this.buytokenService.msgErrPrepayee200 = this.msgPrepayeeIncorrecte;
      }

      if (this.cb.nom == "" || this.cb.numcarte == "" || this.cb.cvc == "" || this.cb.moisexp == "" || this.cb.anexp == "" && this.cb.prepayee != "" && !this.regexPrepayee.test(this.cb.carteprepayee)) {
        this.buytokenService.msgErrPrepayee200 = this.msgPrepayeeIncorrecte;
      }

      if ((this.regexNom.test(this.cb.nom) && this.regexCarte.test(this.cb.numcarte)
        && this.regexCVC.test(this.cb.cvc) && this.regexMM.test(this.cb.moisexp)
        && this.regexYYYY.test(this.cb.anexp)) || (this.regexPrepayee.test(this.cb.carteprepayee))) {
        this.http.patch(this.host.myDevHost + 'token/add/200/' + this.authService.getUserSession().id, val).subscribe({
          next: (data) => {
            if (this.regexNom.test(this.cb.nom) && this.regexCarte.test(this.cb.numcarte)
              && this.regexCVC.test(this.cb.cvc) && this.regexMM.test(this.cb.moisexp)
              && this.regexYYYY.test(this.cb.anexp)) {
              this.buytokenService.msgErrCB200 = "";
              this.buytokenService.msgOKCB200 = "Merci pour votre achat !";
            }
            if (this.regexPrepayee.test(this.cb.carteprepayee)) {
              this.buytokenService.msgErrPrepayee200 = "";
              this.buytokenService.msgOKPrepayee200 = "Merci pour votre achat !";
            }

            this.connectedUser = this.authService.getUserSession();
            this.connectedUser.nbPoint = this.connectedUser.nbPoint + 40;
            this.connectedUser.nbToken = this.connectedUser.nbToken + 200;
            this.authService.setUserInSession(this.connectedUser);

          },
        })
      }
    }
  }
}