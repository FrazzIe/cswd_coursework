import Permissions from '~/server/models/permissions.js';

export default function (ctx, inject) {
	inject('permission', Permissions);
	ctx.$permission = Permissions;
}