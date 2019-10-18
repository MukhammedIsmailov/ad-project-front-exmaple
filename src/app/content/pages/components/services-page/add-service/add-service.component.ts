import {ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {UtilsService} from "../../../../../core/services/utils.service";
import {IService} from "../../../../../core/interfaces/service";
import {ServicesService} from "../../../../../core/services/services.service";

@Component({
  selector: 'm-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  @Input() servicesInfoAddService: IService[] = [];
  @Input() loadingSpinnerAddService: boolean;
  @Input() serviceFields: Array<any>;
  @Input() subscriberFields: Array<any>;

  @Output() servicesInfoAddServiceChange = new EventEmitter<IService[]>();
  @Output() loadingSpinnerAddServiceChange = new EventEmitter<boolean>();

  public newServiceName: string = '';
  public selectedProtocol: string;
  public websiteUrl = new FormControl('', [Validators.required]);
  public validationError = {error: ''};
  public isUrlValid: boolean = false;
  public urlService: string;

  public isOptionOpen: boolean = false;
  public optionServiceArray: Array<any> = [];
  public optionServiceName: string;
  public optionServiceValue: string;

  public optionsNewService: object = {};
  public queryForShow: string;
  public queryNewService: string;

  public responseFieldsObject: any = {};

  public description: string = '';
  public title: string = '';
  public image: string = '';
  public icon: string = '';
  public redirectUrl: string;

  public newService: IService = {
    name: null,
    url: null,
    query: null,
    subscriberFields: null,
    notificationFields: null
  };

  constructor(
    public ref: ChangeDetectorRef,
    private utils: UtilsService,
    private servicesService: ServicesService
  ) {
  }

  ngOnInit() {
    this.generateResponseFieldsObject();
  }


  private detectChanges(): void {
    this.onLoadingSpinnerChange(false);
    if (!this.ref['destroyed']) {
      this.ref.detectChanges();
    }
  }

  public checkUrl(): void {
    this.utils.validatorForService(this.selectedProtocol, this.websiteUrl.value).then(
      result => {
        this.validationError = result;
        this.isUrlValid = this.validationError.error === '';
        this.detectChanges();
      }
    );
    this.detectChanges();
  }

  public addOptionToNewService(): void {
    if (this.selectedProtocol && this.websiteUrl.value && this.isUrlValid) {
      if (this.optionServiceArray.length) {

        const isHasOption = this.optionServiceArray.some(option => {
          return option[0] === this.optionServiceName || option[1] === this.optionServiceValue
        });

        if (!isHasOption) {
          this.validationError.error = "";
          this.optionServiceArray.push([this.optionServiceName, this.optionServiceValue]);
          this.optionServiceName = null;
          this.optionServiceValue = this.subscriberFields[0];
        } else {
          this.validationError.error = "Duplicate options"
        }
      } else {
        this.optionServiceArray.push([this.optionServiceName, this.optionServiceValue]);
        this.optionServiceName = null;
        this.optionServiceValue = this.subscriberFields[0];
      }
      this.createQueryNewService();
    } else {
      this.validationError.error = "No protocol selected and no URL entered"
    }
  }

  public validateAddServiceData(): void {
    if (this.optionServiceName.length)
      this.optionServiceName = this.optionServiceName.replace(/\s+/g, '');
  }

  public removeOptionFromNewService(): void {
    this.optionServiceArray.pop();
    this.createQueryNewService();
  }

  public createQueryNewService(): void {
    this.queryNewService = null;
    this.newService.url = this.selectedProtocol + this.websiteUrl.value;
    if (this.selectedProtocol && this.websiteUrl.value) {
      this.newService.url = this.selectedProtocol + this.websiteUrl.value;
      this.queryNewService = `${this.newService.url}`;

      const reg = /[A-Za-z0-9]/g;
      for (let i = 0; i < this.queryNewService.length; i++) { // if entered incorrect URL
        const lastCharInQuery = this.queryNewService.slice(-1);
        if (lastCharInQuery.search(reg) === -1)
          this.queryNewService = this.queryNewService.slice(0, -1);
      }

      if (this.queryNewService.indexOf('?') === -1) {
        this.queryNewService += '?';
      } else {
        if (this.queryNewService[this.queryNewService.length - 1] !== '?') {
          this.queryNewService += '&'
        }
      }

      this.queryForShow = this.queryNewService;

      if (this.optionServiceArray.length) {
        this.optionServiceArray.forEach(option => {
          this.queryForShow += `${option[0]}={${option[1]}}&`;
        });
      }
    }
  }

  public clearPolesAddService(): void {
    this.queryNewService = null;
    this.queryForShow = '';
    this.validationError.error = '';
    this.newServiceName = '';
    this.websiteUrl = new FormControl('', [Validators.required]);
    this.selectedProtocol = null;
    this.optionServiceName = '';
    this.optionServiceValue = '';
    this.optionServiceArray = [];
    this.optionsNewService = {};
    this.isOptionOpen = false;
    this.generateResponseFieldsObject();
  }

  private setServiceUrl(): void {
    this.urlService = this.websiteUrl.value.split('?')[0];
  }

  public generateOptionsNewService(): void {
    this.optionServiceArray.forEach(option => {
      this.optionsNewService[option[0]] = option[1];
    });
  }

  // service fields

  private generateResponseFieldsObject(): void {
    this.serviceFields.forEach(field => {
      this.responseFieldsObject[field] = '';
    });
  }

  public validatorResponseFields(field: string): void {
    this.responseFieldsObject[field] = this.responseFieldsObject[field].replace(/\s+/g, '');
  }

  private isResponseFieldEmpty(): boolean {
    return Object.entries(this.responseFieldsObject).some(responseField => {
      const [key, value] = responseField;
      return value === '';
    });
  }

  public addNewService(): void {
    this.onLoadingSpinnerChange(true);
    this.createQueryNewService();
    const isServiceNameValid = (this.newServiceName.replace(/\s+/g, '').length) !== 0;
    const isCreatedService = this.servicesInfoAddService.some(service =>
      service.name === this.newServiceName
    );
    if (this.isUrlValid && isServiceNameValid) {
      this.setServiceUrl();
      if (!isCreatedService) {
        this.generateOptionsNewService();
        this.newService.name = this.newServiceName;
        this.newService.url = this.urlService;
        this.newService.query = this.queryNewService;
        this.newService.subscriberFields = this.optionsNewService;

        if(!this.isResponseFieldEmpty()){
          this.newService.notificationFields = this.responseFieldsObject;
          this.servicesService.addNewService(this.newService).subscribe((newService: any) => {
            this.servicesInfoAddService.push(newService);
            this.detectChanges();
            this.clearPolesAddService();
          });
        } else {
          this.validationError.error = 'Please fill in the service response fields';
          this.detectChanges();
        }
      } else {
        this.validationError.error = 'Duplicate service';
        this.detectChanges();
      }
    } else {
      this.validationError.error = 'Incorrect service data';
      this.detectChanges();
    }
  }

  public onLoadingSpinnerChange(model: boolean) {
    this.loadingSpinnerAddService = model;
    this.loadingSpinnerAddServiceChange.emit(model);
  }

}
