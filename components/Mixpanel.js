import mixpanel from 'mixpanel-browser';

import { MIXPANEL_TOKEN } from '@/lib/constants';

mixpanel.init(MIXPANEL_TOKEN);

let env_check = true; //process.env.NODE_ENV === 'production';

let actions = {
	identify: (id) => {
		if (env_check) mixpanel.identify(id);
	},
	alias: (id) => {
		if (env_check) mixpanel.alias(id);
	},
	track: (name, props) => {
		if (!props) {
			props = {};
		}
		if (env_check) mixpanel.track(name, props);
	},
	people: (props) => {
		if (env_check) mixpanel.people.set(props);
	},
};

export let Mixpanel = actions;
