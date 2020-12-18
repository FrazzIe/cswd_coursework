<template>
	<v-row>
		<v-col cols="12">
			<v-autocomplete v-model="selectedBook" :items="searchResults" filled :loading="search.loading" :search-input.sync="bookSearch" solo placeholder="Search for a book" prepend-inner-icon="mdi-book-search" return-object hide-details hide-selected hide-no-data clearable :filter="searchFilter" item-text="title" cache-items>
				<template v-slot:append-outer>
					<v-menu v-model="search.filters.menu" :close-on-content-click="false" :nudge-width="200" offset-y bottom rounded="0">
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon v-bind="attrs" v-on="on">
								<v-icon >mdi-filter</v-icon>
							</v-btn>
						</template>

						<v-card elevation="0" tile>
							<v-list>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>Filters</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list>

							<v-divider></v-divider>

							<v-list>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>Title</v-list-item-title>
									</v-list-item-content>

									<v-list-item-action>
										<v-switch v-model="search.filters.title"></v-switch>
									</v-list-item-action>
								</v-list-item>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>Author</v-list-item-title>
									</v-list-item-content>

									<v-list-item-action>
										<v-switch v-model="search.filters.author"></v-switch>
									</v-list-item-action>
								</v-list-item>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>Category</v-list-item-title>
									</v-list-item-content>

									<v-list-item-action>
										<v-switch v-model="search.filters.category"></v-switch>
									</v-list-item-action>
								</v-list-item>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>ISBN13</v-list-item-title>
									</v-list-item-content>

									<v-list-item-action>
										<v-switch v-model="search.filters.isbn"></v-switch>
									</v-list-item-action>
								</v-list-item>
							</v-list>
						</v-card>
					</v-menu>
				</template>
				<template v-slot:item="{ item }">
					<v-list-item-avatar tile>
						<book-cover :isbn="item.isbn" size="S"></book-cover>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title>{{ item.title }} ({{ item.year }})</v-list-item-title>
						<v-list-item-subtitle>{{ item.authors }} &mdash; {{ item.category }}</v-list-item-subtitle>
					</v-list-item-content>
				</template>
			</v-autocomplete>
		</v-col>
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
	auth: false,
	data: () => ({
		search: {
			loading: false,
			items: [],
			filters: {
				title: true,
				author: true,
				category: true,
				isbn: true,
				menu: false,
			}
		},
		selectedBook: null,
		bookSearch: null,
		books: [],
	}),
	computed: {
		...mapGetters(["isAuthenticated", "loggedInUser"]),
		searchResults() {
			return this.search.items;
		}
	},
	watch: {
		bookSearch(val) {
			if (this.search.items.length > 0)
				return;
			if (this.search.loading)
				return;
			if (!val)
				return;
			if (val.length < 4)
				return;

			this.search.loading = true;

			this.$axios.$get(`/api/search/${val}`).then(resp => {
				console.log(resp);
				this.search.items = resp;
			}).catch(err => {
				console.log(err);
			})
			.finally(() => this.search.loading = false);
		},
		selectedBook(val) {
			if (!val)
				return;
			if (!val.isbn)
				return;

			this.$router.push({	path: "/books/" + val.isbn });
		}
	},
	methods: {
		searchFilter(item, queryText, itemText) {
			if (this.search.filters.title && item.title.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1)
				return true;
			if (this.search.filters.author && item.authors.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1)
				return true;
			if (this.search.filters.category && item.category.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1)
				return true;
			if (this.search.filters.isbn && item.isbn.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1)
				return true;

			return false;
		},
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
