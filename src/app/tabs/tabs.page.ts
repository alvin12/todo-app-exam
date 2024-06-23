import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  isTaskActive: boolean = true
  isCompletedActive: boolean = false

  constructor() {}

  isActive(type: any){
    if(type === 'task'){
      this.isTaskActive = true
      this.isCompletedActive = false
    }

    if(type === 'completed'){
      this.isCompletedActive = true
      this.isTaskActive = false
    }
  }

}
