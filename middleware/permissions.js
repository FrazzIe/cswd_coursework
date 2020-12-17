//@nuxtjs/auth/lib/core/utilities.js
const routeOption = (route, key, value, checkArray = false) => {
	return route.matched.some(m => {
		if (process.client) {
			// Client
			if (checkArray) {
				return Object.values(m.components).some(
					component => component.options && component.options[key] && component.options[key].includes(value)
				)				
			} else {
				return Object.values(m.components).some(
					component => component.options && component.options[key] === value
				)
			}
		} else {
			// SSR
			if (checkArray) {
				return Object.values(m.components).some(component =>
					Object.values(component._Ctor).some(
						ctor => ctor.options && ctor.options[key] && ctor.options[key].includes(value)
					)
				)
			} else {
				return Object.values(m.components).some(component =>
					Object.values(component._Ctor).some(
						ctor => ctor.options && ctor.options[key] === value
					)
				)
			}
		}
	})
}

const getMatchedComponents = (route, matches = false) => {
	return [].concat.apply([], route.matched.map(function (m, index) {
		return Object.keys(m.components).map(function (key) {
			matches && matches.push(index)
			return m.components[key]
		})
	}))
}

export default function (context) {
	//Disable middleware if auth if disabled or guest mode is enabled or permissions check is disabled
	if (routeOption(context.route, "auth", false) || routeOption(context.route, "auth", "guest") || routeOption(context.route, "permissions", false)) {
		return;
	}

	//Disable middleware if no route was matched to allow 404/error page
	const matches = [];
	const Components = getMatchedComponents(context.route, matches);
	if (!Components.length) {
		return;
	}

	//Disable middleware if not logged in
	if (!context.$auth.$state.loggedIn) {
		return;
	}

	const user = context.$auth.$state.user;

	//Check if user has permission scope, redirect if not
	if (!user.scope || !routeOption(context.route, "permissions", user.scope, true)) {
		context.$auth.redirect("home");
	}
}