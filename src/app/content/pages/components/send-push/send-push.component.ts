import {ChangeDetectorRef, Component, OnInit, Inject, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import {StatisticsService} from '../../../../core/services/statistics.service';
import {UserService} from '../../../../core/services/user.service';
import * as moment from 'moment';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import {environment} from '../../../../../environments/environment';
import COUNTRIES_CODES from './countries-codes.json';

interface ICountryList {
  countryCode: string;
  country: string;
  count: number | string;
  text: string;
}

@Component({
  selector: 'm-send-push',
  templateUrl: './send-push.component.html',
  styleUrls: ['./send-push.component.scss'],
  animations: [
    trigger('openClose', [
      state('true', style({height: 'auto'})),
      state('false', style({height: '0', overflow: 'hidden'})),
      transition('false <=> true', animate(500))
    ])
  ],
})
export class SendPushComponent implements OnInit {
  // Emit an event when a file has been picked. Here we return the file itself
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  @ViewChild('image')
  @ViewChild('icon')
  Image: ElementRef;
  Icon: ElementRef;
  imageChangedEvent: any = '';
  iconChangedEvent: any = '';
  croppedImage: any = '';
  croppedIcon: any = '';
  iconSource: any = '';
  source: any = '';
  isOpen: boolean = false;
  private MAX_IMAGE_SIZE = 204800;
  private COUNTRIES_CODES: object = COUNTRIES_CODES;
  public isImageValid: boolean = true;
  public isIconValid: boolean = true;
  public websites: any;
  public notification: any;
  public selectedWebsite: any;
  public selectedWebsiteObj: any;
  public selectedValue: string = '';
  public countOfAllSubscribers: number = 0;
  public defaultPushImageUrl: string = environment.defaultPushImageUrl;

  public openedSegment: boolean = false;
  public openedSaveFilterDialog: boolean = false;

  public checkedDuplicate: boolean = false;
  public checkedDateDelay: boolean = false;
  public checkedSendingAtIntervals: boolean = false;

  public duplicateCount: number = 1;

  public delayedDate: any = new Date();
  public dateForRequest: any = new Date();
  public dateForShow: any = moment().format('lll');

  public numberIntervals: number = 2;
  public showInterval: string = '12 hours';

  public showErrorDate: boolean = false;
  public errorMessageText: string;

  public filters: any = [];
  public selectedFilter: any = {
    _id: '0',
    label: '',
    region: [],
    language: [],
    subscriptionDate: [moment().subtract(1, 'month'), moment()],
    browser: [],
    os: [],
    operator: [],
  };

  public defaultFilter: any = {
    _id: '0',
    label: '',
    region: [],
    language: [],
    subscriptionDate: [moment().subtract(1, 'month'), moment()],
    browser: [],
    os: [],
    isNew: true
  };

  public minDate: any;

  public fromDate: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
  };

  public toDate: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  public selectedDate: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  public selectedTime: any = {
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  };


  public regionsList: object[] = [];
  public selectedRegions: ICountryList[] = [];
  public operatorsList: string[] = [];
  public languages: string[] = [];
  public browsers: string[] = [];
  public osystems: string[] = [];
  public newFilterName: string = '';

  public operatorSelectorSettings: object = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 7,
    allowSearchFilter: true,
  };

  public regionSelectorSettings: object = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 7,
    allowSearchFilter: true,
    idField: 'countryCode',
  };

  public languageSelectorSettings: object = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 7,
    allowSearchFilter: true,
  };

  constructor(
    private statisticsService: StatisticsService,
    private userService: UserService,
    public ref: ChangeDetectorRef,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dom: DomSanitizer
  ) {
    this.notification = {
      title: '',
      text: '',
      link: '',
      image: ''
    };
    this.selectedWebsite = '';
  }

  ngOnInit() {
    this.statisticsService.getTotalStatistics().subscribe((data: any) => {

      this.websites = data.websites.reduce((accum, website) => {
        if (website.subscribers.length)
          accum.push(website);
        return accum;
      }, []);
      this.countOfAllSubscribers = this.websites.reduce((count, website) => {
        return count + website.subscribers.length;
      }, 0);
      this.ref.detectChanges();
    });

    this.getFilters();
    this.minDate = this.getMinDate();
  }

  fileChangeEvent(event: any): void {
    if (event.target.name === 'icon') {
      this.iconChangedEvent = event;
    } else {
      this.imageChangedEvent = event;
    }
  }

  imageCropped(event: any): void {
    this.croppedImage = event.file;
    this.source = this.dom.bypassSecurityTrustUrl(URL.createObjectURL(this.croppedImage));
  }

  iconCropped(event: any): void {
    this.croppedIcon = event.file;
    this.iconSource = this.dom.bypassSecurityTrustUrl(URL.createObjectURL(this.croppedIcon));
  }

  getFilters(): void {
    this.statisticsService.getFilters().subscribe((data: any) => {

      this.filters = data;
      if (this.filters) {
        this.filters = this.filters.map((item) => {

          const subscriptionDate = item.subscriptionDate.map((dateString) => {
            return new Date(dateString);
          });
          const language = (item.language) ? item.language : [];
          const region = (item.region) ? item.region : [];
          return {
            ...item,
            language,
            subscriptionDate,
            region
          };
        });
      } else {
        this.filters = [];
      }
      this.filters.unshift(this.defaultFilter);
      this.selectedFilter = this.filters[0];
      this.selectedRegions = this.selectedFilter.region;
      this.ref.detectChanges();
    }, error => {

    });
  }

  setAllRegions(allRegions: object, subscriber: any): object {
    const count = allRegions[subscriber.region.country] ? allRegions[subscriber.region.country].count + 1 : 1;
    const countryName = `${this.COUNTRIES_CODES[subscriber.region.country]}`;
    allRegions[subscriber.region.country] = {
      countryCode: subscriber.region.country,
      count,
      countryName,
      text: `${subscriber.region.country} - ${countryName} (${count})`,
    };
    return allRegions;
  }

  setRegionsList(allRegions): Array<any> {
    return Object.keys(allRegions).reduce((acc, key) => {
      acc.push({...allRegions[key]});
      return acc;
    }, []);
  }

  onSelectWebsite(websiteID: string): void {
    if (websiteID === 'All websites') {
      this.selectedWebsiteObj = this.websites;
      this.selectedWebsite = this.websites.map(website => website._id);
    } else {
      this.selectedWebsiteObj = [this.websites.find(website => website._id === websiteID)];
      this.selectedWebsite = [websiteID];
    }
    this.languages = [];
    this.browsers = [];
    this.regionsList = [];
    this.osystems = [];
    this.operatorsList = [];
    const dates = [];
    let allRegions = {};
    this.selectedWebsiteObj.forEach(selectedWebsite => {
      if (selectedWebsite.subscribers) {
        selectedWebsite.subscribers.forEach((subscriber) => {
          if (subscriber.language && !this.languages.includes(subscriber.language)) {
            this.languages.push(subscriber.language);
          }
          if (subscriber.region) {
            allRegions = this.setAllRegions(allRegions, subscriber);
          }
          if (subscriber.browser && !this.browsers.includes(subscriber.browser)) {
            this.browsers.push(subscriber.browser);
          }
          if (subscriber.os && !this.osystems.includes(subscriber.os)) {
            this.osystems.push(subscriber.os);
          }
          if (subscriber.date) {
            dates.push(new Date(subscriber.date));
          }
          if (subscriber.operator && !this.operatorsList.includes(subscriber.operator)) {
            this.operatorsList.push(subscriber.operator);
          }
        });
        this.regionsList = this.setRegionsList(allRegions);
      }
    });
    this.ref.detectChanges();
  }

  onSelectRegion(): void {
    this.selectOperatorsByRegion(this.selectedRegions);
  }

  onDeSelectRegion(): void {
    this.selectOperatorsByRegion(this.selectedRegions);
  }

  onSelectAllRegions(region): void {
    this.selectOperatorsByRegion(region);
  }

  onDeSelectAllRegions(region): void {
    this.selectOperatorsByRegion(region);
  }

  selectOperatorsByRegion(regions: Array<any>): void {
    this.selectedFilter.operator = [];
    this.operatorsList = [];
    if (regions.length > 0) {
      const regionsCodes = regions.map(region => region.countryCode);
      this.selectedWebsiteObj.forEach(selectedWebsite => {
        if (selectedWebsite.subscribers) {
          selectedWebsite.subscribers.forEach((subscriber) => {
            if (regionsCodes.includes(subscriber.region.country)
              && subscriber.operator
              && !this.operatorsList.includes(subscriber.operator)) {
              this.operatorsList.push(subscriber.operator);
            }
          });
        }
      });
    } else {
      this.selectedWebsiteObj.forEach(selectedWebsite => {
        if (selectedWebsite.subscribers) {
          selectedWebsite.subscribers.forEach((subscriber) => {
            if (subscriber.operator && !this.operatorsList.includes(subscriber.operator)) {
              this.operatorsList.push(subscriber.operator);
            }
          });
        }
      });
    }
  }

  onSelectFilter(filterID: string): void {
    this.selectedFilter = this.filters.find((item) => item._id === filterID);
    let allRegions = {};
    this.selectedWebsiteObj.forEach(selectedWebsite => {
      if (selectedWebsite.subscribers) {
        selectedWebsite.subscribers.forEach((subscriber) => {
          if (subscriber.region && this.selectedFilter.region.includes(subscriber.region)) {
            allRegions = this.setAllRegions(allRegions, subscriber);
          }
        });
        this.selectedRegions = this.setRegionsList(allRegions);
      }
    });
    if (this.selectedFilter.subscriptionDate[0]) {
      this.fromDate = {
        year: this.selectedFilter.subscriptionDate[0].getFullYear(),
        month: this.selectedFilter.subscriptionDate[0].getMonth() + 1,
        day: this.selectedFilter.subscriptionDate[0].getDate(),
      };
    } else {
      this.fromDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      };
    }

    if (this.selectedFilter.subscriptionDate[1]) {
      this.toDate = {
        year: this.selectedFilter.subscriptionDate[1].getFullYear(),
        month: this.selectedFilter.subscriptionDate[1].getMonth() + 1,
        day: this.selectedFilter.subscriptionDate[1].getDate(),
      };
    } else {
      this.toDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      };
    }
    this.ref.detectChanges();
  }

  decrementDuplicateCount(): void {
    this.duplicateCount -= 1;
    this.validateDuplicateCount(this.duplicateCount);
  }

  incrementDuplicateCount(): void {
    this.duplicateCount += 1;
    this.validateDuplicateCount(this.duplicateCount);
  }

  validateDuplicateCount(count: number): void {
    if (count < 1)
      this.duplicateCount = 1;
    if (count > 5)
      this.duplicateCount = 5;
  }

  decrementNumberIntervals(): void {
    this.numberIntervals -= 1;
    this.validateNumberIntervals(this.numberIntervals);
    this.calculateInterval();
  }

  incrementNumberIntervals(): void {
    this.numberIntervals += 1;
    this.validateNumberIntervals(this.numberIntervals);
    this.calculateInterval();
  }

  validateNumberIntervals(number: number): void {
    if (number < 2)
      this.numberIntervals = 2;
    if (number > 48)
      this.numberIntervals = 48;
    this.calculateInterval();
  }

  calculateInterval(): void {
    const oneDay: number = 1440; //1440 minutes - one day
    const intervalInMinutes: number = Math.round(oneDay / this.numberIntervals);

    if (intervalInMinutes < 60) {
      this.showInterval = `${intervalInMinutes} minutes`
    } else {
      const intervalHours = Math.floor(intervalInMinutes / 60);
      const intervalMinutes = intervalInMinutes - intervalHours * 60;
      if (intervalHours !== 1)
        this.showInterval = `${intervalHours} hours ${intervalMinutes} minutes`;
      else
        this.showInterval = `${intervalHours} hour ${intervalMinutes} minutes`;
    }
  }

  clearAndClose(): void {
    this.notification = {
      title: '',
      text: '',
      link: '',
      image: '',
      delayedDate: '',
      duplicateCount: 1,
      numberIntervals: null
    };
    this.clearImage();
    this.clearIcon();
    this.duplicateCount = 1;
    this.numberIntervals = 2;
    this.showInterval = '12 hours';
    this.checkedDuplicate = false;
    this.checkedDateDelay = false;
    this.checkedSendingAtIntervals = false;
    this.isOpen = false;
    this.showNotificaion('Push has been sent!!!', 'Close');
    this.ref.detectChanges();
  }

  sendPush(): void {
    if (this.checkedDateDelay) {
      this.notification.delayedDate = this.dateForRequest.toISOString();
    }
    if (this.checkedSendingAtIntervals) {
      this.notification.numberIntervals = this.numberIntervals;
    }
    this.notification.duplicateCount = this.duplicateCount;
    this.selectedFilter.region = this.selectedRegions.map(({countryCode}) => countryCode);
    const sendingFilter = this.openedSegment ? this.selectedFilter : null;

    if (this.selectedWebsite) {
      const pushImage = new FormData();
      if (this.croppedImage || this.croppedIcon) {
        if (this.croppedImage.size && this.croppedImage.size >= this.MAX_IMAGE_SIZE) {
          this.isImageValid = false;
          this.ref.detectChanges();
        } else {
          pushImage.append('notificationImage ', this.croppedImage);
        }
        if (this.croppedIcon) {
          pushImage.append('notificationIcon ', this.croppedIcon);
        }
        this.userService.uploadIcon(pushImage)
          .subscribe(response => {
            if (this.croppedImage && this.croppedIcon) {
              this.notification.image = response.filePath;
              this.notification.icon = response.iconPath;
            } else if (this.croppedImage) {
              this.notification.image = response.filePath;
            } else {
              this.notification.icon = response.filePath;
            }
            Promise.all(
              this.selectedWebsite.map((selectedWebsite => {
                return this.userService.sendPush(selectedWebsite, this.notification, sendingFilter)
                  .subscribe(response => response);
              })))
              .then(() => {
                this.clearAndClose();
              });
          });
      } else {
        Promise.all(
          this.selectedWebsite.map((selectedWebsite => {
            return this.userService.sendPush(selectedWebsite, this.notification, sendingFilter)
              .subscribe(response => response);
          })))
          .then(response => {
            this.clearAndClose();
          });
      }
    }
  }

  private showNotificaion(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  clearImage(): void {
    this.croppedImage = '';
    this.Image.nativeElement.value = '';
    this.source = '';
    this.imageChangedEvent = '';
    this.ref.detectChanges();
  }

  clearIcon(): void {
    this.croppedIcon = '';
    this.Image.nativeElement.value = '';
    this.iconSource = '';
    this.iconChangedEvent = '';
    this.ref.detectChanges();
  }

  pickerClicked(): void {
    this.changeDate();
  }

  dateSelected(): void {
    this.changeDate();
  }

  changeDate(): void {
    this.dateForRequest = this.formJSDate(this.selectedDate, this.selectedTime);
    this.dateForShow = moment(this.dateForRequest).format('lll');
    this.ref.detectChanges();
  }

  formJSDate(dateObj, timeObj): object {
    const formattedDate = new Date();
    formattedDate.setFullYear(dateObj.year);
    formattedDate.setMonth(dateObj.month - 1);
    formattedDate.setDate(dateObj.day);
    if (timeObj) {
      formattedDate.setHours(timeObj.hour);
      formattedDate.setMinutes(timeObj.minute);
    }
    return formattedDate;
  }

  toDateSelected(event: any): void {
    this.selectedFilter.subscriptionDate[1] = this.formJSDate(this.toDate, null);
  }

  fromDateSelected(event: any): void {
    this.selectedFilter.subscriptionDate[0] = this.formJSDate(this.fromDate, null);
  }

  getMinDate(): object {
    const data = new Date();
    const month = data.getUTCMonth() + 1;
    const day = data.getUTCDate();
    const year = data.getUTCFullYear();
    return {year: year, month: month, day: day}
  }

  saveFilter(): void {
    this.selectedFilter.region = this.selectedRegions.map(({countryCode}) => countryCode);
    this.statisticsService.saveFilter(this.selectedFilter).subscribe(() => {
      this.openedSaveFilterDialog = false;
      this.newFilterName = '';
      this.defaultFilter = {
        _id: '0',
        label: '',
        region: [],
        language: [],
        subscriptionDate: [new Date(), new Date()],
        browser: [],
        os: [],
        isNew: true
      };
      this.getFilters();
    }, (err) => {
      console.log(err);
    });
  }

  segmentedCheckClicked(): void {
    if (!this.openedSegment) {

    }
  }

  changedBrowserCheckbox(event: any, browser: any): void {
    if (event.checked) {
      this.selectedFilter.browser.push(browser);
    } else {
      this.selectedFilter.browser = this.selectedFilter.browser.filter((item) => item !== browser);
    }
    this.ref.detectChanges();
  }

  changedOSCheckbox(event: any, os: any): void {
    if (event.checked) {
      this.selectedFilter.os.push(os);
    } else {
      this.selectedFilter.os = this.selectedFilter.os.filter((item) => item !== os);
    }
    this.ref.detectChanges();
  }


  openSaveFilterDialog(): void {
    this.openedSaveFilterDialog = true;
    this.newFilterName = this.selectedFilter.label;
  }

  clickedSaveFilter(): void {
    if (this.newFilterName) {
      this.selectedFilter.label = this.newFilterName;
      this.saveFilter();
    }
  }

  clickedUndoFilterSave(): void {
    this.openedSaveFilterDialog = false;
    this.newFilterName = '';
  }

  clickedDeleteFilter(): void {
    if (this.selectedFilter._id) {
      this.statisticsService.deleteFilter(this.selectedFilter._id).subscribe((res) => {
        this.getFilters();
      }, error1 => {

      });
    }
  }

  isArrayContainsValue(array, value): number {
    return (array.indexOf(value) + 1);
  }

}


