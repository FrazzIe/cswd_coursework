<template>
	<v-row justify="center" align="center">
		<v-col sm="7" md="6" lg="5" xl="4">
			<v-card class="elevation-12" tile>

			</v-card>
		</v-col>
	</v-row>
</template>

<style>
</style>

<script>
import { mapGetters } from "vuex";

export default {
	data: () => ({

	}),
	computed: {
		...mapGetters(["loggedInUser"]),
	},
	methods: {

	},
	validate({ params }) {
		return !isNaN(+params.id);
	},
	async asyncData({ params, error, $axios }) {
		const book = await $axios.$get(`/api/books/${+params.id}`).catch(err => {
			if (err.response && err.response.data && err.response.data.error)
				error({ message: err.response.data.error, statusCode: err.response.status })
		});

		return { book };
	},
}
</script>