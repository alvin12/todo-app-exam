import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { AddComponent } from '../modal/add/add.component';
import * as _ from 'lodash';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  formGroup = new FormGroup({
    id: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    isCompleted: new FormControl(false)
  });

  id: any = 0
  todoList: any = []
  tempTodoList: any = []
  idsList: any = []
  searchTask: any
  isNewTodo: boolean = true

  constructor(private modalCtrl: ModalController,
    private storagesrvc: StorageService,
    private toastController: ToastController) { }

  ionViewDidEnter() {
    this.getTask()
  }

  findTask() {
    let titleHasResult = this.todoList.filter((item: any) => String(item.title).startsWith(this.searchTask.toLowerCase()))
    let descriptionHasResult = this.todoList.filter((item: any) => String(item.description).startsWith(this.searchTask.toLowerCase()))
    if(this.searchTask){
      if(titleHasResult.length > 0){
        this.todoList = titleHasResult
      }else{
        this.todoList = descriptionHasResult
      }
    }else{
      this.getTask()
    }
  }

  async openTask() {
    if(this.tempTodoList.length <= 15){
      const modal = await this.modalCtrl.create({
        component: AddComponent,
        cssClass: "half-modal-popup",
        componentProps: { tasks: this.tempTodoList }
      });
  
      modal.onDidDismiss()
        .then(resp => {
          this.getTask()
        })
      modal.present();
    }else{
      this.presentToast()
    }
  }


  getTask() {
    this.storagesrvc.getTask()
      .then((resp: any) => {

        let newList: any = []
        let newTempList: any = []
        if (resp) {
          this.isNewTodo = false
          resp = JSON.parse(resp)
          newTempList = resp
          resp.forEach((element: any) => {
            if (!element.isCompleted || element.isCompleted === null) {
              newList.push(element)
            }
          });
          this.todoList = newList ? newList.reverse() : []
        }else{
          this.isNewTodo = true
        }
        this.tempTodoList = newTempList
      })
  }

  taskCompleted() {
    let newList: any = []
    this.todoList.forEach((element: any) => {
      if (element.isCompleted === false || element.isCompleted === null) {
        newList.push(element)
      }
    });
  }

  checkboxClick(ids: any) {
    const idxOf = this.todoList.map((e: any) => e.id).indexOf(ids.id);
    this.todoList.splice(idxOf, 1);

    this.tempTodoList.forEach((element: any) => {
      if (element.id === ids.id) {
        ids.isCompleted = !ids.isCompleted ? true : false
      }
    });
    this.storagesrvc.createTask(this.tempTodoList, true)
  }

    
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Task's exceeds the maximum number of task",
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-toast-danger'
    });

    await toast.present();
  }


}
