import { Component, OnInit } from '@angular/core';
import { Column } from '../custom-table/columns';
import { TenderN,Tender_AN } from 'src/models';
import { TenderService } from '../services/tender.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit{

  partyAddress : any;
  tenders : TenderN[];
  tendersed : Tender_AN[];
  ngOnInit(): void {
    this.partyAddress = localStorage.getItem("WALLETID");
   
    this.tenderService.getMyTenders(this.partyAddress).subscribe((tenders) => {
      // Transform the response to the new model
      this.tenders = tenders.response.map((tender: TenderN) => {
        // Calculate deadline status (assuming 'Deadline' is a string in 'MM/DD/YYYY' format)
        const deadline = new Date(tender.Deadline);
        const currentDate = new Date();
        const isDeadlinePasse = deadline < currentDate;
  
        // Create a new object based on the Tender_AN interface
        const transformedTender: Tender_AN = {
          Id: tender.Id,
          Title: tender.Title,
          Status: tender.Status,
          Budget: tender.Budget,
          Description: tender.Description,
          Milestones: tender.Milestones,
          Deadline: tender.Deadline,
          link:tender.link,
          isDeadlinePassed: isDeadlinePasse,
          
        };
  
        return transformedTender;
      });
    });
  }
  

  constructor(private tenderService : TenderService, private router: Router){}

  tableColumns: Array<Column> = [
    { columnDef: 'Title', header: 'Title', cell: (element: Tender_AN) => `${element.Title}` },
    { columnDef: 'Description', header: 'Description', cell: (element: Tender_AN) => `${element.Description}` },
    { columnDef: 'Budget', header: 'Budget', cell: (element: Tender_AN) => `${element.Budget}` },
     { columnDef: 'Link', header: 'Link', cell: (element: Tender_AN) => `${element.link}` },
    { columnDef: 'Deadline', header: 'Deadline', cell: (element: Tender_AN) => `${element.Deadline}` },
    // { columnDef: 'Milestones', header: 'Milestones', cell: (element: Tender_AN) => `${element.Milestones}` },
    { columnDef: 'Actions', header: 'Actions', cell: (element: Record<string, any>) => `${element['Actions']}`,
      isActionsEnabled: true,
      tenderId: (element: Tender_AN) => `${element.Id}`,
      bidId: (element: Tender_AN) => `${element.Id}`,
      isDeleteEnabled: true,
      isEditEnabled: false,//vinayak - 
      isDeadLine:(element: Tender_AN) => element.isDeadlinePassed,
      isViewBids: true
    }
  ];
  


  addTender() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`tenders/add`])
    );
  }

}
