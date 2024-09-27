import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IEnvironment } from 'src/app/models/interfaces/i-environment';
import { IFence } from 'src/app/models/interfaces/i-fence';
import { IGround } from 'src/app/models/interfaces/i-ground';
import { IProject } from 'src/app/models/interfaces/i-project';
import { GardenService } from 'src/app/services/garden.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.scss']
})
export class CreateNewProjectComponent implements OnInit {
  public createProjectForm: FormGroup = new FormGroup({});
  public validationErrors: string[] | undefined;

  public name: string = '';
  public width: number | undefined;
  public depth: number | undefined;
  public groundChoice: IGround | undefined;
  public fenceChoice: IFence | undefined;
  public environmentChoice: IEnvironment | undefined;

  public groundList: IGround[] = [];
  public environmentList: IEnvironment[] = [];
  public fenceList: IFence[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { template: IProject },
    public dialogRef: MatDialogRef<CreateNewProjectComponent>,
    private gardenService: GardenService,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.gardenService.getGrounds().subscribe(
      (groundList: IGround[]) => {
        this.groundList = groundList;
        this.groundChoice = groundList[0];
      },
      error => {
        console.error('Error loading grounds: ', error);
      }
    );

    await this.gardenService.getFences().subscribe(
      (fenceList: IFence[]) => {
        this.fenceList = fenceList;
        this.fenceChoice = fenceList[0];
      },
      error => {
        console.error('Error loading fences: ', error);
      }
    );

    await this.gardenService.getEnvironments().subscribe(
      (environmentList: IEnvironment[]) => {
        this.environmentList = environmentList;
        this.environmentChoice = environmentList[0];
      },
      error => {
        console.error('Error loading environments: ', error);
      }
    );

    this.initializeForm();
  }

  public async create() {
    const createProjectValues = { ...this.createProjectForm.value };

    if (!createProjectValues || !this.groundChoice || !this.environmentChoice || !this.fenceChoice) return;

    const project: IProject = {
      name: createProjectValues.name,
      width: createProjectValues.width,
      depth: createProjectValues.depth,
      ground: this.groundChoice,
      environment: this.environmentChoice,
      fence: this.fenceChoice,
      entrances: []
    }

    this.projectService.createProject(project).subscribe({
      next: () => {
        this.toastr.success('New project successfully added');
        this.dialogRef.close();
      },
      error: error => {
        this.validationErrors = error;
        this.toastr.error('Error creating project', error);
      }
    });

    this.dialogRef.close();
  }

  public cancel() {
    this.dialogRef.close();
  }

  public setGround(ground: IGround): void {
    this.groundChoice = ground;
  }

  public setFence(fence: IFence): void {
    this.fenceChoice = fence;
  }

  public setEnvironment(environment: IEnvironment): void {
    this.environmentChoice = environment;
  }

  private initializeForm() {
    this.createProjectForm = this.formBuilder.group({
      name: ['', Validators.required],
      width: ['', [
        Validators.required,
        Validators.min(5),
        Validators.max(300)]],
      depth: ['', [
        Validators.required,
        Validators.min(5),
        Validators.max(300)]]
    });
  }
}
