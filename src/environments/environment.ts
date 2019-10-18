// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	isMockEnabled: false, // You have to switch this, when your real back-end is done
	// baseURL: 'https://notification.dunice.net/api',
	baseURL: 'http://localhost:5000/api',
	defaultImg: 'https://notification.dunice.net/public/images/default-web-icon.png',
	defaultPushImageUrl: 'https://notification.dunice.net/public/images/default-web-icon.png;',
	defaultUserImg: 'https://notification.dunice.net/uploads/default-user-icon.png',
};
