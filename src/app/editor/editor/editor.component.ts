import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'toil-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @Input()
  readOnly: boolean;

  constructor() { }

  ngOnInit() {
  }

}
