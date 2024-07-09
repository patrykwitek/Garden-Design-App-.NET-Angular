import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/models/interfaces/project';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.scss']
})
export class CreateNewProjectComponent {
  name: string = '';
  width: number | undefined;
  depth: number | undefined;

  constructor(
    public dialogRef: MatDialogRef<CreateNewProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { template: Project }
  ) { }

  public create() {
    if (this.name && this.width && this.depth) {
      const project: Project = {
        name: this.name,
        width: this.width,
        depth: this.depth
      }

      this.dialogRef.close(project);
    }
  }

  public cancel() {
    this.dialogRef.close();
  }
}
