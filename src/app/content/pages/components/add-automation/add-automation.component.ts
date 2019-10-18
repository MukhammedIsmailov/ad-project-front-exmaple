import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { UserService } from '../../../../core/services/user.service';
import PushMsgObject from '../../../../core/models/PushMsgObject';
import {Router} from '@angular/router';

@Component({
	selector: 'm-add-automation',
	templateUrl: './add-automation.component.html',
	styleUrls: ['./add-automation.component.scss']
})
export class AddAutomationComponent implements OnInit {
	public time: boolean = false;
	public websites: any;
	public selectedWebsiteId: string;
	public label: string;
	public firstMsg: any = {
		delayedTime: {
			immediately: !this.time, // Only for first PushMsg. If true dismiss next field
			after: `5 days` // 'N days|hours|minutes'
		},
		title: '',
		body: '',
		url: '',
		icon: ''
	};
	public msgArray: any = [];
	public isAllValid = true;

	constructor(private statisticsService: StatisticsService,
				private userService: UserService,
				private router: Router,
				public ref: ChangeDetectorRef,
	) {
	}

	ngOnInit() {
		this.statisticsService.getTotalStatistics().subscribe((data: any) => {
			this.websites = data.websites;
			this.ref.detectChanges();
		});
	}

	addPushMsg() {
		this.msgArray.push(new PushMsgObject());
	}

	onMsgChange($event, i, isFirst) {
		const targetName = $event.target.name;
		const targetValue = $event.target.value;

		if (isFirst) {
			if (targetName === 'time') return;
			if (targetName === 'number' || targetName === 'shift') {
				const after = this.firstMsg.delayedTime.after.split(' ');
				if (targetName === 'number') {
					after[0] = targetValue;
				} else {
					after[1] = targetValue;
				}
				this.firstMsg.delayedTime.after = after.join(' ');
			} else {
				this.firstMsg[targetName] = targetValue;
			}
		} else {
			const msg = this.msgArray[i];
			if (targetName === 'number' || targetName === 'shift') {
				const after = msg.delayedTime.after.split(' ');
				if (targetName === 'number') {
					after[0] = targetValue;
				} else {
					after[1] = targetValue;
				}
				msg.delayedTime.after = after.join(' ');
			} else {
				msg[targetName] = targetValue;
			}
		}
	}

	deleteMsgFromArray(index) {
		this.msgArray.splice(index, 1);
	}

	saveAutomation(needStart?) {
		const data = {
			websiteId: this.selectedWebsiteId,
			label: this.label,
			notifications: [this.firstMsg, ...this.msgArray],
			// browserLang: '',
			status: needStart ? 'active' : 'new'
		};
		const dataValues = Object.values(data);
		for (const prop of dataValues) {
			if (prop) continue;
			else {
				this.isAllValid = false;
			}
		}
		if (this.isAllValid) {
			this.userService.createAutomation(data).subscribe(response => {
				console.log('--> response', response);
				// if (response === 200) this.router.navigate(['/automation']);
			});
		}
		this.ref.detectChanges();
		setTimeout(() => {
			this.isAllValid = true;
			this.ref.detectChanges();
		}, 2000);
	}
}
