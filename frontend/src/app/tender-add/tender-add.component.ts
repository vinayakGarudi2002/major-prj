import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TenderService } from '../services/tender.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tender-add',
  templateUrl: './tender-add.component.html',
  styleUrls: ['./tender-add.component.scss']
})
export class TenderAddComponent {
  tenderForm = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(3)]],
    description: ["", [Validators.required, Validators.minLength(1)]],
    deadline: ["", [Validators.required, Validators.minLength(1)]],
    totalMilestones: [0, [Validators.required, Validators.minLength(1)]],
    budget: [0, [Validators.required, Validators.minLength(1)]],
    password: ["", [Validators.required, Validators.minLength(6)]]
  })

  get title() {
    return this.tenderForm.get('title');
  }

  get description() {
    return this.tenderForm.get('description');
  }

  get deadline() {
    return this.tenderForm.get('deadline');
  }

  get totalMilestones() {
    return 5;
  }

  get budget() {
    return this.tenderForm.get('budget');
  }
  get password() {
    return this.tenderForm.get('password');
  }
  constructor(private fb: FormBuilder, private tenderService: TenderService, private router: Router) {}

  onCancel() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([`tenders`])
    );
  }

  onSubmit() {
    const passwordControl = this.password;
    if (passwordControl && passwordControl.value === 'Vikas@') { // Check the value of the password field
      this.tenderService.createTender(this.tenderForm.value)
        .subscribe(success => {
          if (success) {
            Swal.fire({
              icon: 'success',
              titleText: 'Tender created successfully',
              html: `<a type="button" style="
              margin-top: 10%;
              border: none;
              border-radius: 1.5rem;
              padding: 7px;
              background: #11101D;
              color: #fff;
              text-decoration: none;
              font-weight: 600;
              width: 150px;
              cursor: pointer;" href="/tenders">Tenders</a> `,
              showConfirmButton: false,
              showCloseButton: true
            });
          }
        });
    } else {
      alert("Wrong password or password control is null");
    }
  }
}