export default class PushMsgObject {
	private delayedTime: { after: string };
	private title: string;
	private body: string;
	private url: string;
	private icon: string;
	constructor() {
		this.delayedTime = {
			after: `5 days` // 'N days|hours|minutes'
		};
		this.title = '';
		this.body = '';
		this.url = '';
		this.icon = '';
	}
}
