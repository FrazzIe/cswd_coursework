<template>
	<v-row>
		<v-col cols="12">
			<v-row>
				<v-col>
					<h2>Book History</h2>
				</v-col>
			</v-row>
			<v-row justify="space-between">
				<template v-for="(item, index) in books">
					<v-col :key="index" sm="12" md="6" lg="6" xl="6">
						<v-card class="book-history scroll-bar">
							<book-cover :isbn="item.isbn" height="300px"></book-cover>
							<v-card-text>
								<v-row justify="space-between" no-gutters>
									<v-col sm="6">
										<p class="text-subtitle-1 font-weight-black">
											<span class="text-subtitle-2">Author(s)</span>
											<br/>
											{{ item.authors }}
											<br/>
											<span class="text-subtitle-2">ISBN-13</span>
											<br/>
											{{ item.isbn }}
										</p>
									</v-col>
									<v-col sm="6">
										<p class="text-subtitle-1 font-weight-black">
											<span class="text-subtitle-2">Category</span>
											<br/>
											{{ item.category }}
											<br/>
											<span class="text-subtitle-2">Release date</span>
											<br/>
											{{ item.year }}
										</p>
									</v-col>
									<v-col cols="12">
										<span class="text-subtitle-2">Description</span>
										<p class="text-justify">{{ item.description }}</p>
									</v-col>
								</v-row>
							</v-card-text>
						</v-card>
					</v-col>
					<v-responsive :key="`width-${index}`" width="100%" v-if="index === 3">
					</v-responsive>
				</template>
			</v-row>
		</v-col>
	</v-row>
</template>

<style>
	.book-history {
		max-height: 650px;
		min-height: 650px;
		overflow: auto;
	}
</style>

<script>
import { mapGetters } from "vuex";
import bookCover from "@/components/bookCover";

export default {
	components: {
		bookCover
	},
	data: () => ({

	}),
	computed: {
		...mapGetters(["loggedInUser"]),
	},
	async asyncData({ error, $axios }) {
		const books = await $axios.$get("/api/books/history").catch(err => {
			if (err.response && err.response.data && err.response.data.error)
				error({ message: err.response.data.error, statusCode: err.response.status })
		});

		return { books };
	},
}
</script>