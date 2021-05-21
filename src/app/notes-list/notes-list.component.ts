import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IListBoxItem, IItemsMovedEvent } from "../dual-list-box";
import {
  moveItemInArray,
  CdkDragDrop,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-notes-list",
  templateUrl: "./notes-list.component.html",
  styleUrls: ["./notes-list.component.scss"]
})
export class NotesListComponent {
  public newNote: string = " ";
  // array of items to display in left box
  @Input() set availables(items: Array<{}>) {
    this.availableItems = [
      ...(items || []).map((item: {}, index: number) => ({
        value: item[this.valueField].toString(),
        text: item[this.textField]
      }))
    ];
  }
  // array of items to display in right box
  @Input() set selects(items: Array<{}>) {
    this.selectedItems = [
      ...(items || []).map((item: {}, index: number) => ({
        value: item[this.valueField].toString(),
        text: item[this.textField]
      }))
    ];
  }
  // field to use for value of option
  @Input() valueField = "id";
  // field to use for displaying option text
  @Input() textField = "name";
  // text displayed over the available items list box
  @Input() availableText = "Available items";
  // text displayed over the selected items list box
  @Input() selectedText = "Selected items";
  // set placeholder text in available items list box
  @Input() availableFilterPlaceholder = "Filter...";
  // set placeholder text in selected items list box
  @Input() selectedFilterPlaceholder = "Filter...";

  // event called when items are moved between boxes, returns state of both boxes and item moved
  @Output() itemsMoved: EventEmitter<IItemsMovedEvent> = new EventEmitter<
    IItemsMovedEvent
  >();

  availableItems: Array<IListBoxItem> = [];
  selectedItems: Array<IListBoxItem> = [];
  listBoxForm: FormGroup;

  constructor(public fb: FormBuilder) {
    this.listBoxForm = this.fb.group({
      availableSearchInput: [""],
      selectedSearchInput: [""]
    });
  }

  public addSubList(array) {
    array.length = 1;
  }
  removeSublist(array) {
    console.log(array);
    array.length = 0;
  }

  order(index: number, up: boolean) {
    if (up) {
      // move up
      if (index === 0) {
        console.log("do nothing");
      } else {
        const temp = this.accordions[index - 1];
        this.accordions[index - 1] = this.accordions[index];
        this.accordions[index] = temp;
      }
    } else {
      if (index == this.accordions.length) {
        console.log("do nothing");
      } else {
        const temp = this.accordions[index + 1];
        this.accordions[index + 1] = this.accordions[index];
        this.accordions[index] = temp;
      }
    }
  }

  panelOpenState = true;

  accordions = [
    {
      title: "Play in footbal",
      subAccordion: [
        {
          title: "Ukraine - Russia"
        },
        {
          title: "USA - Brazil"
        }
      ]
    },
    {
      title: "Home clean",
      subAccordion: [
        {
          title: "Clear room"
        },
        {
          title: "Make food"
        }
      ]
    }
  ];

  deleteItem(i) {
    if (i > -1) {
      this.accordions.splice(i, 1);
    }
  }

  addItem(value, array, event) {
    array.push({ title: value, subAccordion: [] });
    console.log(event);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.accordions, event.previousIndex, event.currentIndex);
  }
}
