import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { StorageService } from 'src/app/services/storage.service';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {


  formGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    isCompleted: new FormControl(false)
  });

  isSubmitted: boolean = false
  id: any = 0

  constructor(private storagesrvc: StorageService,
    private modalCtrl: ModalController,
    private navparams: NavParams
  ) {
    let getListLength = this.navparams.get("tasks").length
    this.id = getListLength <= 0 ? 1 : getListLength + 1
  }

  ngOnInit() { }

  close() {
    this.modalCtrl.dismiss()
  }

  saveTask() {
    this.isSubmitted = true
    if(this.formGroup.valid){
      this.formGroup.controls["id"].setValue(this.id)
      this.storagesrvc.createTask(this.formGroup.value, false)
      this.formGroup.reset()
      this.modalCtrl.dismiss()
    }
  }

  clearForm() {
    this.formGroup.reset()
  }



}
