import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IGround } from 'src/app/models/interfaces/i-ground';
import { IProject } from 'src/app/models/interfaces/i-project';
import { GardenService } from 'src/app/services/garden.service';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.scss']
})
export class CreateNewProjectComponent implements OnInit {
  public name: string = '';
  public width: number | undefined;
  public depth: number | undefined;
  public isPl: boolean | undefined;

  private groundList: IGround[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { template: IProject },
    public dialogRef: MatDialogRef<CreateNewProjectComponent>,
    private gardenService: GardenService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    const currentLang = this.translateService.currentLang;
    this.isPl = (currentLang == 'pl');
  }

  public async create() {
    await this.gardenService.getGrounds().subscribe(
      (groundList: IGround[]) => {
        this.groundList = groundList;
      },
      error => {
        console.error('Error loading grounds', error);
      }
    );

    if (this.name && this.width && this.depth) {
      const project: IProject = {
        name: this.name,
        width: this.width,
        depth: this.depth,
        ground: this.groundList[0]
      }

      this.dialogRef.close(project);
    }
  }

  public cancel() {
    this.dialogRef.close();
  }
}
