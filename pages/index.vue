<template>
	<v-row>
		<template v-for="(item, index) in books">
			<v-col cols="12" v-if="item.data.length > 0" :key="index">
				<v-row>
					<v-col>
						<h2>{{ item.title }}</h2>
					</v-col>
				</v-row>
				<v-row justify="space-between">
					<template v-for="(book, index) in item.data">
						<v-col :key="index" sm="6" md="3" lg="3" xl="3">
							<v-card class="book-content" :to="`/books/${book.isbn}`" nuxt>
								<book-cover :isbn="book.isbn" height="275px"></book-cover>
								<v-divider></v-divider>
								<v-card-title class="text-body-2">{{ book.title }}</v-card-title>
								<v-card-subtitle>{{ book.authors }} &mdash; {{ book.year }}</v-card-subtitle>
							</v-card>
						</v-col>
						<v-responsive :key="`width-${index}`" width="100%" v-if="index === 3">
						</v-responsive>
					</template>
				</v-row>
			</v-col>
		</template>
	</v-row>
</template>

<style>
	.book-content {
		max-height: 400px;
		min-height: 400px;
		overflow: hidden;
	}
</style>

<script>
import { mapGetters } from "vuex";
import bookCover from "@/components/bookCover";

export default {
	components: {
		bookCover
	},
	middleware: "auth",
	data: () => ({
		books: [],
	}),
	computed: {
		...mapGetters(["isAuthenticated", "loggedInUser"]),
	},
	methods: {
	},
	async asyncData({ error, $axios }) {
		const books = await $axios.$get("/api/books").catch(err => {
			if (err.response && err.response.data && err.response.data.error)
				error({ message: err.response.data.error, statusCode: err.response.status })
		});

		return { books };
	},
}
</script>
