import { Component, Input } from '@angular/core';

/**
 * Displays the Flowbster Editor.
 *
 * @example
 * <toil-editor [readOnly]="true"></toil-editor>
 */
@Component({
  selector: 'toil-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

  /**
   * Decides if the Editor is going to be read only.
   */
  @Input()
  readOnly: boolean;

}
