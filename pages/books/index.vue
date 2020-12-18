<template>
	<v-row>
		<v-col cols="12" v-if="books.length > 0" :key="index">
			<v-row>
				<v-col>
					<h2>Books (<span class="font-weight-bold">{{ books.length }}</span>)</h2>
				</v-col>
			</v-row>
			<v-row justify="space-between">
				<template v-for="(item, index) in books">
					<v-col :key="index" sm="6" md="3" lg="3" xl="3">
						<v-card class="book-content" :to="`/books/${item.isbn}`" nuxt>
							<book-cover :isbn="item.isbn" height="275px"></book-cover>
							<v-divider></v-divider>
							<v-card-title class="text-body-2">{{ item.title }}</v-card-title>
							<v-card-subtitle>{{ item.authors }} &mdash; {{ item.year }}</v-card-subtitle>
						</v-card>
					</v-col>
					<v-responsive :key="`width-${index}`" width="100%" v-if="index === 3">
					</v-responsive>
				</template>
			</v-row>
		</v-col>
		<v-col cols="12" v-else>
			<p class="text-center text-headline">
				No books to display!
			</p>
		</v-col>
	</v-row>
</template>

<style>
</style>

<script>
import { mapGetters } from "vuex";
import bookCover from "@/components/bookCover";

export default {
	components: {
		bookCover
	},
	middleware: "auth",
	auth: "guest",
	data: () => ({
		books: [],
	}),
	computed: {
		...mapGetters(["isAuthenticated", "loggedInUser"]),
	},
	async asyncData({ error, $axios }) {
		const books = await $axios.$get("/api/books/all").catch(err => {
			if (err.response && err.response.data && err.response.data.error)
				error({ message: err.response.data.error, statusCode: err.response.status })
		});

		return { books };
	},
}
</script>