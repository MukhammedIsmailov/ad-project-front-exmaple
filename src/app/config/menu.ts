// tslint:disable-next-line:no-shadowed-variable
import { ConfigModel } from '../core/interfaces/config';

// tslint:disable-next-line:no-shadowed-variable
export class MenuConfig implements ConfigModel {
	public config: any = {};

	constructor() {
		this.config = {
			header: {
				self: {},
				items: [
					{
						title: 'Push',
						root: true,
						icon: 'flaticon-alarm',
						toggle: 'click',
						translate: 'MENU.PUSH',
					},
				]
			},
			aside: {
				self: {},
				items: [
					{
						buttonTitle: 'Send push',
						icon: 'flaticon-file',
						page: '/send-push',
						translate: 'MENU.SEND_PUSH'
					},
					{
						title: 'Dashboard',
						desc: 'Dashboard',
						root: true,
						icon: 'flaticon-line-graph',
						page: '/',
						translate: 'MENU.DASHBOARD'
					},
					{
						title: 'Analytics',
						desc: 'Analytics',
						root: true,
						icon: 'flaticon-line-graph',
						page: '/analytics',
						translate: 'MENU.ANALYTICS'
					},
					{
						title: 'Services',
						desc: 'Services',
						root: true,
						icon: 'flaticon-presentation',
						page: '/services',
						translate: 'MENU.SERVICES'
					},
					{
						title: 'Service campaigns',
						desc: 'Service campaigns',
						root: true,
						icon: 'flaticon-list',
						page: '/service-campaigns',
						translate: 'MENU.SERVICE_CAMPAIGNS'
					},
					{
						title: 'My campaigns',
						desc: 'My campaigns',
						root: true,
						icon: 'flaticon-web',
						page: '/my-campaigns',
						translate: 'MENU.MY_CAMPAIGNS'
					},
					 {
					 	title: 'My sites',
					 	root: true,
					 	bullet: 'dot',
					 	icon: 'flaticon-interface-7',
					 },
					 // {
					 // 	title: 'Automation',
					 // 	root: true,
					 // 	bullet: 'dot',
					 // 	page: '/automation',
					 //    icon: 'flaticon-rocket',
					 // }
				]
			}
		};
	}
}
