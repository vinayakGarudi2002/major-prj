export interface Tender {
    Id: number;
    Title: string;
    Status: string;
    Budget: number;
    Description: string;
    Milestones: number;
    Deadline: string;
    link:string;
  }

  export interface TenderN {
    Id: number;
    Title: string;
    Status: string;
    Budget: number;
    Description: string;
    Milestones: number;
    Deadline: string;
    link:string;
  }

  export interface Tender_A {
    Id: number;
    Title: string;
    Status: string;
    Budget: number;
    Description: string;
    Milestones: number;
    Deadline: string;
    isDeadlinePassed:boolean;
  }
  export interface Tender_AN {
    Id: number;
    Title: string;
    Status: string;
    Budget: number;
    Description: string;
    Milestones: number;
    Deadline: string;
    link:string;
    isDeadlinePassed:boolean;
    
  }
export interface Bid {
  BidId: number;
  TenderId: number;
  BidClause: string;
  QuoteAmount: number;
  Status: string;
  Addres:string;
}

export interface TenderResponse {
  status: string;
  response: Tender[];
}

export interface BidResponse {
  status: string;
  response: Bid[];
}