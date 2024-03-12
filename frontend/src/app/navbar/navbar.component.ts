import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() template: TemplateRef<any>;
  status: boolean = true;

  name: string|null = localStorage.getItem('NAME');
  addr: string|null = localStorage.getItem('WALLETID');
  showActiveTenders: boolean;
  showTenders: boolean;
  constructor() {
    // Use constructor for initialization
    this.showActiveTenders = !(this.addr === "0xff158f98a9b863881d1e618b7ffd6722077490b8");
    this.showTenders=(this.addr === "0xff158f98a9b863881d1e618b7ffd6722077490b8");
  }

  toggleButton() {
    this.status = !this.status;
  }
}
