import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BuyTokenService } from '../services/buytoken.service';
import { HostService } from '../services/host.service';

@Component({
  selector: 'app-buy100tokens',
  templateUrl: './buy100tokens.component.html',
  styleUrls: ['./buy100tokens.component.css']
})
export class Buy100tokensComponent implements OnInit {
  cb: any;
  connectedUser : any;

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

  pay100(val: any) {
    this.cb = val;
    this.buytokenService.msgErrCB100 = '';
    this.buytokenService.msgOKCB100 = '';
    this.buytokenService.msgErrPrepayee100 = '';
    this.buytokenService.msgOKPrepayee100 = '';



    if (this.cb.nom == "" || this.cb.numcarte == "" || this.cb.cvc == "" || this.cb.moisexp == "" || this.cb.anexp == "" || this.cb.prepayee == "") {
      this.buytokenService.msgErrPrepayee100 = this.msgAttributManquant;
      this.buytokenService.msgErrCB100 = this.msgAttributManquant;

    } else {
      if (!this.regexNom.test(this.cb.nom)) {
        this.buytokenService.msgErrCB100 = this.msgNomIncorrect;
      }
      if (!this.regexCarte.test(this.cb.numcarte)) {
        this.buytokenService.msgErrCB100 = this.msgCarteIncorrecte;
      }
      if (!this.regexCVC.test(this.cb.cvc)) {
        this.buytokenService.msgErrCB100 = this.msgCVCIncorrect;
      }
      if (!this.regexMM.test(this.cb.moisexp)) {
        this.buytokenService.msgErrCB100 = this.msgDateIncorrecte;
      }
      if (!this.regexYYYY.test(this.cb.anexp)) {
        this.buytokenService.msgErrCB100 = this.msgDateIncorrecte;
      }
      if (!this.regexPrepayee.test(this.cb.carteprepayee)) {
        this.buytokenService.msgErrPrepayee100 = this.msgPrepayeeIncorrecte;
      }

      if (this.cb.nom == "" || this.cb.numcarte == "" || this.cb.cvc == "" || this.cb.moisexp == "" || this.cb.anexp == "" && this.cb.prepayee != "" && !this.regexPrepayee.test(this.cb.carteprepayee)) {
        this.buytokenService.msgErrPrepayee100 = this.msgPrepayeeIncorrecte;
      }

      if ((this.regexNom.test(this.cb.nom) && this.regexCarte.test(this.cb.numcarte)
        && this.regexCVC.test(this.cb.cvc) && this.regexMM.test(this.cb.moisexp)
        && this.regexYYYY.test(this.cb.anexp)) || (this.regexPrepayee.test(this.cb.carteprepayee))) {
        this.http.patch(this.host.myDevHost + 'token/add/100/' + this.authService.getUserSession().id, val).subscribe({
          next: (data) => {
            if (this.regexNom.test(this.cb.nom) && this.regexCarte.test(this.cb.numcarte)
              && this.regexCVC.test(this.cb.cvc) && this.regexMM.test(this.cb.moisexp)
              && this.regexYYYY.test(this.cb.anexp)) {
              this.buytokenService.msgErrCB100 = "";
              this.buytokenService.msgOKCB100 = "Merci pour votre achat !";
            }
            if (this.regexPrepayee.test(this.cb.carteprepayee)) {
              this.buytokenService.msgErrPrepayee100 = "";
              this.buytokenService.msgOKPrepayee100 = "Merci pour votre achat !";
            }

           this.connectedUser = this.authService.getUserSession();
           this.connectedUser.nbPoint = this.connectedUser.nbPoint + 20;
           this.connectedUser.nbToken = this.connectedUser.nbToken + 100;
           this.authService.setUserInSession(this.connectedUser);
          },
        })
      }
    }
  }
}