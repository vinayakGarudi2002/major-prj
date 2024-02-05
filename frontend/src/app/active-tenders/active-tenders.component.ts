import { Component } from '@angular/core';
import { Column } from '../custom-table/columns';
import { Tender } from 'src/models';
import { TenderService } from '../services/tender.service';

@Component({
  selector: 'app-active-tenders',
  templateUrl: './active-tenders.component.html',
  styleUrls: ['./active-tenders.component.scss']
})
export class ActiveTendersComponent {

  partyAddress: any;
  status: boolean = false; // Initialize status here
  tenders: Tender[];

  constructor(private tenderService: TenderService) { }

  ngOnInit(): void {
    this.partyAddress = localStorage.getItem("WALLETID");

    this.tenderService.getVerBids(this.partyAddress).subscribe((res) => {
      //console.log(res.verificationStatus);
      if (res.verificationStatus == 0) {
        this.status = false;
      } else {
        this.status = true;
      }
    console.log(this.status)
      // Move the code that depends on 'status' inside this block
      this.tenderService.getActiveTenders(this.partyAddress).subscribe((tenders) => {

        this.tenders = tenders.response;
      });
    });
  }


    // Use a method to dynamically determine the status for each row
    isStatus(Element: Record<string, any>): boolean {
      return this.status;
    }
  

  tableColumns: Array<Column> = [
    { columnDef: 'Title', header: 'Title', cell: (element: Record<string, any>) => `${element['Title']}` },
    { columnDef: 'Description', header: 'Description', cell: (element: Record<string, any>) => `${element['Description']}` },
    { columnDef: 'Budget', header: 'Budget', cell: (element: Record<string, any>) => `${element['Budget']}` },
    { columnDef: 'link', header: 'link', cell: (element: Record<string, any>) => `${element['link']}` },
    { columnDef: 'Deadline', header: 'Deadline', cell: (element: Record<string, any>) => `${element['Deadline']}` },
    { columnDef: 'Actions', header: 'Actions', cell: (element: Record<string, any>) => `${element['Actions']}`, isActionsEnabled: true, adr: (element: Record<string, any>) => this.isStatus(element), tenderId: (element: Record<string, any>) => `${element['Id']}`, isAddBid: true },
  ];
}
