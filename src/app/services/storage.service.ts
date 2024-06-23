import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }


  async createTask(params: any, isupdate: any) {
    let newArr: any = []
    const { value } = await Preferences.get({ key: 'task' });
    if(isupdate){
      newArr = params
    }else{
     
      if(value){
        let existData = JSON.parse(value)
        let checkIfIDExist = _.filter(existData, { 'id': params.id});
        params.id = checkIfIDExist.length > 0 ? params.id + 1 : params.id
        newArr = existData.concat(params)
      }else{
        newArr = [params]
      }
    }
    await Preferences.set({
      key: "task",
      value: JSON.stringify(newArr),
    });
  }

  async getTask() {
    const { value } = await Preferences.get({ key: 'task' });
    return new Promise((resolve, reject) => {
      resolve(value)
    })

  }

  async removeTask() {
    await Preferences.remove({ key: 'task' });
  }
  
}


