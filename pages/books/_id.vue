<template>
	<v-row justify="center">
		<v-col sm="7" md="6" lg="5" xl="5">
			<v-card class="elevation-12">
				<book-cover :isbn="book.isbn" height="400px"></book-cover>
				<v-divider></v-divider>
				<v-card-title>{{ book.title }}</v-card-title>
				<v-card-text>
					<v-row justify="space-between">
						<v-col sm="6">
							<p class="text-subtitle-1 font-weight-black">
								<span class="text-subtitle-2">Author(s)</span>
								<br/>
								{{ book.authors }}
								<br/>
								<span class="text-subtitle-2">ISBN-13</span>
								<br/>
								{{ book.isbn }}
							</p>
						</v-col>
						<v-col sm="6">
							<p class="text-subtitle-1 font-weight-black">
								<span class="text-subtitle-2">Category</span>
								<br/>
								{{ book.category }}
								<br/>
								<span class="text-subtitle-2">Release date</span>
								<br/>
								{{ book.year }}
							</p>
						</v-col>
						<v-col cols="12">
							<span class="text-subtitle-2">Description</span>
							<p class="text-justify">{{ book.description }}</p>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-col>

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