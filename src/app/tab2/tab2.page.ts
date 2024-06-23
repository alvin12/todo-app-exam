import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  todoList: any = []
  tempTodoList: any = []
  searchTask: any
  isNewTodo: boolean = true
  forUpdateList: any = []

  constructor(private storagesrvc: StorageService,
    private toastController: ToastController
  ) { }

  ionViewDidEnter() {
    this.getTask()
  }

  findTask() {
    // let resultTitle = _.filter(this.tempTodoList, {title: this.searchTask.toLowerCase()});
    let titleHasResult = this.todoList.filter((item: any) => String(item.title).startsWith(this.searchTask.toLowerCase()))
    let descriptionHasResult = this.todoList.filter((item: any) => String(item.description).startsWith(this.searchTask.toLowerCase()))
    if (this.searchTask) {
      if (titleHasResult.length > 0) {
        this.todoList = titleHasResult
      } else {
        this.todoList = descriptionHasResult
      }
    } else {
      this.getTask()
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
            if (element.isCompleted === true) {
              newList.push(element)
            }
          });
          this.todoList = newList ? newList.reverse() : []
        } else {
          this.isNewTodo = true
        }
        this.tempTodoList = newTempList
        console.log("todoList", this.todoList)
      })
  }

  checkboxClick(ids: any) {
    // const idxOf = this.todoList.map((e: any) => e.id).indexOf(ids.id);
    // this.todoList.splice(idxOf, 1);
    this.todoList.forEach((element: any) => {
      if (element.id === ids.id) {
        ids.isCompleted = !ids.isCompleted ? true : false
      }
    });
  }

  removeTask() {
    let isNeedToRemove = this.todoList.filter((item: any) => !item.isCompleted)
    this.tempTodoList.forEach((element: any, idx: number, object: any) => {
      isNeedToRemove.forEach((element_ : any, idx_ : number, object_: any) => {
        if(element.id == element_.id){
          object.splice(idx, 1)
        }
      });
    });
    this.storagesrvc.createTask(this.tempTodoList, true)
    let msg = {
      msg : isNeedToRemove.length > 1 ?  "Removing item's from todo's..." :  "Removing item from todo's...",
      type_: 'remove'
    }
    this.presentToast(msg)
    setTimeout(() => {
      this.getTask()
    }, 3000)
  }

  pushToPending() {
    let isMovingToPending = this.todoList.filter((item: any) => !item.isCompleted)
    this.tempTodoList.forEach((element: any) => {
      isMovingToPending.forEach((element_ : any, idx_ : number, object_: any) => {
        if(element.id == element_.id){
          element.isCompleted = false
        }
      });
    });
    console.log("isMovingToPending", this.tempTodoList)
    this.storagesrvc.createTask(this.tempTodoList, true)
    let msg = {
      msg : "Setting back to todo's...",
      type_: 'return'
    }
    this.presentToast(msg)
    setTimeout(() => {
      this.getTask()
    }, 3000)

  }
  
  async presentToast(msg: any) {
    const toast = await this.toastController.create({
      message: msg.msg,
      duration: 3000,
      position: 'bottom',
      cssClass: msg.type_ === 'return' ? 'custom-toast-primary' : 'custom-toast-danger '
    });

    await toast.present();
  }

}
