<template>
	<v-row justify="center" align="center">
		<v-col sm="7" md="6" lg="5" xl="5">
			<template v-if="isAuthenticated">
				<h3 class="text-center">Hello {{ loggedInUser.name }}</h3>
			</template>
			<template v-else>
				<h3 class="text-center">Welcome</h3>
			</template>
		</v-col>
	</v-row>
</template>

<style>
</style>

<script>
import { mapGetters } from "vuex";

export default {
	middleware: "auth",
	data: () => ({

	}),
	computed: {
		...mapGetters(["isAuthenticated", "loggedInUser"]),
	},
	methods: {
	}
}
</script>
