'use client';

import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN =
	process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || process.env.MIXPANEL_TOKEN;

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
