import { Component, OnInit } from '@angular/core';
import { Column } from '../custom-table/columns';
import { Tender,Tender_A } from 'src/models';
import { TenderService } from '../services/tender.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit{

  partyAddress : any;
  tenders : Tender[];
  tendersed : Tender_A[];
  ngOnInit(): void {
    this.partyAddress = localStorage.getItem("WALLETID");
    this.tenderService.getMyTenders(this.partyAddress).subscribe((tenders) => {
      // Transform the response to the new model
      this.tenders = tenders.response.map((tender: Tender) => {
        // Calculate deadline status (assuming 'Deadline' is a string in 'MM/DD/YYYY' format)
        const deadline = new Date(tender.Deadline);
        const currentDate = new Date();
        const isDeadlinePasse = deadline < currentDate;
  
        // Create a new object based on the Tender_A interface
        const transformedTender: Tender_A = {
          Id: tender.Id,
          Title: tender.Title,
          Status: tender.Status,
          Budget: tender.Budget,
          Description: tender.Description,
          Milestones: tender.Milestones,
          Deadline: tender.Deadline,
          isDeadlinePassed: isDeadlinePasse
        };
  
        return transformedTender;
      });
    });
  }
  

  constructor(private tenderService : TenderService, private router: Router){}

  tableColumns: Array<Column> = [
    { columnDef: 'Title', header: 'Title', cell: (element: Tender_A) => `${element.Title}` },
    { columnDef: 'Description', header: 'Description', cell: (element: Tender_A) => `${element.Description}` },
    { columnDef: 'Budget', header: 'Budget', cell: (element: Tender_A) => `${element.Budget}` },
    // { columnDef: 'Status', header: 'Status', cell: (element: Tender_A) => `${element.Status}` },
    { columnDef: 'Deadline', header: 'Deadline', cell: (element: Tender_A) => `${element.Deadline}` },
    // { columnDef: 'Milestones', header: 'Milestones', cell: (element: Tender_A) => `${element.Milestones}` },
    { columnDef: 'Actions', header: 'Actions', cell: (element: Record<string, any>) => `${element['Actions']}`,
      isActionsEnabled: true,
      tenderId: (element: Tender_A) => `${element.Id}`,
      bidId: (element: Tender_A) => `${element.Id}`,
      isDeleteEnabled: true,
      isEditEnabled: false,//vinayak - 
      isDeadLine:(element: Tender_A) => element.isDeadlinePassed,
      isViewBids: true
    }
  ];
  
  // tableData: Array<Tender> = [
  //   { Id:0, Status: "OPEN", Title: 'Hydrogen', Budget: 1.0079, Description: 'H', Milestones: 10, Deadline: '4/11/2023', },
  //   { Id:0, Status: "OPEN", Title: 'Helium', Budget: 4.0026, Description: 'He', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Lithium', Budget: 6.941, Description: 'Li', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Beryllium', Budget: 9.0122, Description: 'Be', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Boron', Budget: 10.811, Description: 'B', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Carbon', Budget: 12.0107, Description: 'C', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Nitrogen', Budget: 14.0067, Description: 'N', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Oxygen', Budget: 15.9994, Description: 'O', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Fluorine', Budget: 18.9984, Description: 'F', Milestones: 10, Deadline: '4/11/2023'},
  //   { Id:0, Status: "OPEN", Title: 'Neon', Budget: 20.1797, Description: 'Ne', Milestones: 10, Deadline: '4/11/2023'},
  // ];

  addTender() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`tenders/add`])
    );
  }

}
