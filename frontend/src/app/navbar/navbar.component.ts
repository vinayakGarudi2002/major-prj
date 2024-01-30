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
    this.showActiveTenders = !(this.addr === "0xa3df8bd4bd75f724ef51e50f3309dd5943fd648e");
    this.showTenders=(this.addr === "0xa3df8bd4bd75f724ef51e50f3309dd5943fd648e");
  }

  toggleButton() {
    this.status = !this.status;
  }
}
