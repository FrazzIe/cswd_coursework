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
		<v-col sm="7" md="6" lg="5" xl="5">
			<v-card class="elevation-12">
				<v-toolbar>
					<v-toolbar-title>Reviews</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-rating background-color="grey lighten-1" color="warning" empty-icon="mdi-star-outline" full-icon="mdi-star" half-icon="mdi-star-half-full" half-increments length="5" readonly size="20" :value="book.rating"></v-rating>
				</v-toolbar>

				<v-divider></v-divider>

				<v-list two-line class="overflow-y-auto scroll-bar" max-height="418">
					<template v-for="(item, index) in book.reviews">
						<v-list-item :key="index">
							<v-list-item-content>
								<v-list-item-title>{{ item.username }} - <span class="text-caption">{{ capitalise(item.group) }}</span></v-list-item-title>
								<span class="text--primary review">{{ item.review }}</span>
								<v-list-item-subtitle>{{ formatDate(item.created_at) }}</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>

						<v-divider v-if="index < book.reviews.length - 1" :key="`divider-${index}`"></v-divider>
					</template>
				</v-list>

				<v-divider></v-divider>

				<v-form ref="form" @submit.prevent="newComment">
					<v-card-text>
						<v-textarea label="Review" placeholder="Write a review..." counter v-model="input.review"
							:rules="[
								() => !!input.review || 'A review is required',
								() => !!input.review && input.review.length >= 20 || 'Review must be at least 20 characters long',
								() => !!input.review && input.review.length <= 2000 || 'Review cannot contain more than 2000 characters',
							]"
						></v-textarea>
					</v-card-text>

					<v-divider></v-divider>

					<v-card-actions>
						<template>
							<v-btn type="submit" text color="success">Review</v-btn>
						</template>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-col>
	</v-row>
</template>

<style>
	.scroll-bar::-webkit-scrollbar-track
	{
		-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);
		background-color: #F5F5F5;
	}
	.scroll-bar::-webkit-scrollbar
	{
		display: block;
		height: 6px;
		width: 6px;
		background-color: #F5F5F5;
	}
	.scroll-bar::-webkit-scrollbar-thumb
	{
		-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
		background-color: #555;
	}
	.review {
		white-space: pre-wrap;
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
		input: {
			review: "",
			rating: "",
		},
		book: {},
	}),
	computed: {
		...mapGetters(["loggedInUser"]),
	},
	methods: {
		formatDate(unix) {
			return new Date(unix * 1000).toUTCString();
		},
		capitalise(str) {
			if (typeof str !== "string")
				return "";
			return str.charAt(0).toUpperCase() + str.slice(1);
		},
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