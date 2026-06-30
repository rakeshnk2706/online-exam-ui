import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import {
  ConfirmDialogService,
  ConfirmDialogData
} from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {

  dialogService = inject(ConfirmDialogService);

  dialogData$: Observable<ConfirmDialogData> =
    this.dialogService.dialogData$;

  confirm() {
    this.dialogService.onConfirm();
  }

  cancel() {
    this.dialogService.onCancel();
  }
}