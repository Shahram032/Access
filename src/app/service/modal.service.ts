import { Injectable, Output, TemplateRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  @Output() onHide: EventEmitter<any> = new EventEmitter();

  modalStack: BsModalRef[] = [];
  modalNames: string[] = [];
  resault: Map<string, Object> = new Map();

  openModal(name: string, template: TemplateRef<any>,object: Object) {
    this.modalStack.push(
      this.modalService.show(template, {
        backdrop: true,
        ignoreBackdropClick: true,
        keyboard: false,
        class: 'modal-lg',
      })
    );
    this.modalNames.push(name);
    this.modalService.onHide.subscribe(() => {
      object = this.resault.get(name)!;
      this.onHide.emit(this.resault.get(name));
      this.resault.delete(name);
    });
  }

  closeModal(name: string, object: Object) {
    this.modalStack.pop()?.hide();
    this.resault.set(name, object);
    this.modalNames.pop();
  }

  constructor(private modalService: BsModalService) {}
}
