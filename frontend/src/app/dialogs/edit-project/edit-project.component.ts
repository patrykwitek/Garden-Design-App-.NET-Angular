import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IEnvironment } from 'src/app/models/interfaces/i-environment';
import { IFence } from 'src/app/models/interfaces/i-fence';
import { IGround } from 'src/app/models/interfaces/i-ground';
import { IProject } from 'src/app/models/interfaces/i-project';
import { GardenService } from 'src/app/services/garden.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent {
  public editProjectForm: FormGroup = new FormGroup({});
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
    public dialogRef: MatDialogRef<EditProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project: IProject },
    private formBuilder: FormBuilder,
    private gardenService: GardenService,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.gardenService.getGrounds().subscribe(
      (groundList: IGround[]) => {
        this.groundList = groundList;
      },
      error => {
        console.error('Error loading grounds: ', error);
      }
    );

    await this.gardenService.getFences().subscribe(
      (fenceList: IFence[]) => {
        this.fenceList = fenceList;
      },
      error => {
        console.error('Error loading fences: ', error);
      }
    );

    await this.gardenService.getEnvironments().subscribe(
      (environmentList: IEnvironment[]) => {
        this.environmentList = environmentList;
      },
      error => {
        console.error('Error loading environments: ', error);
      }
    );

    this.groundChoice = this.data.project.ground;
    this.fenceChoice = this.data.project.fence;
    this.environmentChoice = this.data.project.environment;

    this.initializeForm();
  }

  public async edit() {
    const editProjectValues = { ...this.editProjectForm.value };

    if (!editProjectValues || !this.groundChoice || !this.environmentChoice || !this.fenceChoice) return;

    const project: IProject = {
      id: this.data.project.id,
      name: editProjectValues.name,
      width: editProjectValues.width,
      depth: editProjectValues.depth,
      ground: this.groundChoice,
      environment: this.environmentChoice,
      fence: this.fenceChoice,
      entrances: []
    }

    this.projectService.editProject(project).subscribe({
      next: () => {
        this.editProjectForm.reset(editProjectValues);
        this.toastr.success('Project successfully edited');
      },
      error: error => {
        this.validationErrors = error;
        this.toastr.error('Error editing the project: ', error);
      }
    });
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
    this.editProjectForm = this.formBuilder.group({
      name: [this.data.project.name, Validators.required],
      width: [this.data.project.width, [
        Validators.required,
        Validators.min(5),
        Validators.max(300)]],
      depth: [this.data.project.depth, [
        Validators.required,
        Validators.min(5),
        Validators.max(300)]]
    });
  }
}
