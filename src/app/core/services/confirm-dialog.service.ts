import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

export interface ConfirmDialogData {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private resultSubject?: Subject<boolean>;

  private dialogDataSubject = new BehaviorSubject<ConfirmDialogData>({
    visible: false,
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel'
  });

  dialogData$: Observable<ConfirmDialogData> =
  this.dialogDataSubject.asObservable();

  confirm(
    title: string,
    message: string,
    confirmText = 'OK',
    cancelText = 'Cancel'
  ) {
    this.resultSubject = new Subject<boolean>();

    this.dialogDataSubject.next({
      visible: true,
      title,
      message,
      confirmText,
      cancelText
    });

    return this.resultSubject.asObservable();
  }

  success(message: string) {
    return this.confirm('Success', message, 'OK', '');
  }

  error(message: string) {
    return this.confirm('Error', message, 'OK', '');
  }

  info(message: string) {
    return this.confirm('Information', message, 'OK', '');
  }

  onConfirm() {
    this.dialogDataSubject.next({
      visible: false,
      title: '',
      message: '',
      confirmText: 'OK',
      cancelText: 'Cancel'
    });

    this.resultSubject?.next(true);
    this.resultSubject?.complete();
  }

  onCancel() {
    this.dialogDataSubject.next({
      visible: false,
      title: '',
      message: '',
      confirmText: 'OK',
      cancelText: 'Cancel'
    });

    this.resultSubject?.next(false);
    this.resultSubject?.complete();
  }
}