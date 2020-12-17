class Permission {
	#groups = [];	
	#permissions = {};

	constructor() {
		this.#groups = ["admin", "user"];
		this.#permissions = {
			//permission = [groups],
		};
	}

	check(group, perm) {
		if (!this.#groups.includes(group))
			return false
		if (!this.#permissions[perm])
			return false
		
		return this.#permissions[perm].includes(group);
	}
}

module.exports = new Permission();