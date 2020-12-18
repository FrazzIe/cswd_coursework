<template>
	<v-row justify="center">
		<v-col sm="12" md="12" lg="6" xl="6">
			<v-card class="elevation-12 book-view scroll-bar">
				<book-cover :isbn="book.isbn" height="400px"></book-cover>
				<v-divider></v-divider>
				<v-toolbar elevation="0">
					<v-toolbar-title>{{ book.title }}</v-toolbar-title>
					<template v-if="!hasRead">
						<v-spacer></v-spacer>
						<v-btn text color="primary" @click="markRead()">
							<v-icon left color="success">mdi-bookmark-plus</v-icon>
							MARK AS READ						
						</v-btn>
					</template>
				</v-toolbar>

				<v-card-text>
					<v-row justify="space-between" no-gutters>
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
		<v-col sm="12" md="12" lg="6" xl="6">
			<v-card class="elevation-12 book-view scroll-bar">
				<v-toolbar elevation="0">
					<v-toolbar-title>Reviews (<span class="font-weight-bold">{{ book.reviews.length }}</span>)</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-rating background-color="grey lighten-1" color="yellow accent-4" length="5" readonly size="20" :value="book.rating"></v-rating>
					<v-tooltip right>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon v-bind="attrs" v-on="on" @click="ratings.dialog = true">
								<v-icon color="info">mdi-finance</v-icon>
							</v-btn>
						</template>
						<span>Ratings distribution</span>
					</v-tooltip>
				</v-toolbar>

				<v-divider></v-divider>

				<v-list two-line class="overflow-y-auto scroll-bar book-review-list">
					<template v-for="(item, index) in book.reviews">
						<v-list-item :key="index">
							<v-list-item-content>
								<v-row align="center" no-gutters>
									<v-col>
										<span class="text--primary font-weight-bold">{{ item.username }} </span>-
										<span class="text-caption">{{ capitalise(item.group) }}</span>
									</v-col>
									<v-col>
										<v-rating class="float-right" v-model="item.rating" background-color="grey lighten-1" color="yellow accent-4" dense readonly size="18"></v-rating>
									</v-col>
								</v-row>
								<span class="text--primary book-review text-justify">{{ item.review }}</span>
								<v-list-item-subtitle>{{ formatDate(item.created_at) }}</v-list-item-subtitle>
							</v-list-item-content>
						</v-list-item>

						<v-divider v-if="index < book.reviews.length - 1" :key="`divider-${index}`"></v-divider>
					</template>
					<template v-if="book.reviews.length == 0">
						<v-card-text>
							<p class="text-center text-caption">
								No reviews to display!
							</p>
						</v-card-text>
					</template>
				</v-list>

				<v-divider></v-divider>

				<v-form ref="form" @submit.prevent="newReview">
					<v-card-text>
						<v-textarea label="Review" placeholder="Write a review..." counter v-model="input.review"
							:rules="[
								() => !!input.review || 'A review is required',
								() => !!input.review && input.review.length >= 20 || 'Review must be at least 20 characters long',
								() => !!input.review && input.review.length <= 2000 || 'Review cannot contain more than 2000 characters',
							]"
						></v-textarea>
						<span class="text-body-2">Rate</span>
						<v-rating class="float-right" v-model="input.rating" background-color="grey lighten-1" color="yellow accent-4" dense size="20"></v-rating>
					</v-card-text>

					<v-divider></v-divider>

					<v-card-actions>
						<v-btn v-if="isAuthenticated" type="submit" text color="success" :disabled="!hasRead || !canReview">
							<v-icon left v-if="!hasRead || !canReview">mdi-book-lock</v-icon>
							Review <span v-if="!hasRead">(MUST READ)</span>
						</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
			<v-dialog v-model="ratings.dialog" width="500">
				<v-card class="mx-auto text-center" max-width="600">				
					<v-sheet color="rgba(0, 0, 0, .12)">
						<v-sparkline class="pt-3" :value="bookRatings" height="100" padding="24" label-size="8" type="bar" auto-line-width stroke-linecap="square">
							<template v-slot:label="item">
								{{ item.index + 1 }} stars ({{ item.value }})
							</template>
						</v-sparkline>
					</v-sheet>
					<v-card-text>
						<div class="display-1 font-weight-thin pt-3">
							Ratings Distribution
						</div>
					</v-card-text>
				</v-card>
			</v-dialog>
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
	.book-review {
		white-space: pre-wrap;
	}
	.book-view {
		min-height: 850px;
		max-height: 850px;
		overflow-y: auto;
	}
	.book-review-list {
		min-height: 495px;
		max-height: 495px;
		overflow-y: auto;
	}
</style>

<script>
import { mapGetters } from "vuex";
import snackBar from "@/components/snackBar";
import loader from "@/components/loader";
import bookCover from "@/components/bookCover";

export default {
	components: {
		snackBar,
		loader,
		bookCover
	},
	middleware: "auth",
	auth: false,
	data: () => ({
		input: {
			review: "",
			rating: 3,
		},
		book: {
			reviews: [],
			ratings: [],
		},
		ratings: {
			dialog: false,
		},
		snack: {
			message: "",
			color: "",
		},
		loader: {
			message: "",
			show: false,
		}
	}),
	computed: {
		...mapGetters(["isAuthenticated", "loggedInUser"]),
		canReview() {
			return this.book.read === 1 && !this.book.reviewed === 0;
		},
		hasRead() {
			return this.book.read === 1;
		},
		bookRatings() {
			let ratings = [0, 0, 0, 0, 0];

			for (var i = 0; i < this.book.ratings.length; i++)
				ratings[this.book.ratings[i].rating - 1] = this.book.ratings[i].count;
			
			return ratings;
		}
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
		newReview() {
			if (this.$refs.form.validate()) {
				this.loader.message = "Creating review..";
				this.loader.show = true;

				this.$axios.$post(`/api/books/review/${this.$route.params.id}`, { data: this.input }).then((resp) => {
					this.loader.show = false;
					if (resp) {
						if (resp.error) {
							this.snack.color = "error";
							this.snack.message = resp.error;
							console.log(resp.error);
							return;
						}

						window.location.reload(true);
					}
				}).catch((error) => {
					this.loader.show = false;
					if (error.response && error.response.data && error.response.data.error) {
						console.log(error.response.data.error);
						this.snack.color = "error";
						this.snack.message = error.response.data.error;
					} else
						console.log(error.message);
				});
			}
		},
		markRead() {
			this.loader.message = "Marking as read..";
			this.loader.show = true;

			this.$axios.$post(`/api/books/read/${this.$route.params.id}`, {}).then((resp) => {
				this.loader.show = false;
				if (resp) {
					if (resp.error) {
						this.snack.color = "error";
						this.snack.message = resp.error;
						console.log(resp.error);
						return;
					}

					window.location.reload(true);
				}
			}).catch((error) => {
				this.loader.show = false;
				if (error.response && error.response.data && error.response.data.error) {
					console.log(error.response.data.error);
					this.snack.color = "error";
					this.snack.message = error.response.data.error;
				} else
					console.log(error.message);
			});
		}
	},
	validate({ params }) {
		return !isNaN(+params.id);
	},
	async asyncData({ params, error, $axios }) {
		const book = await $axios.$get(`/api/books/isbn/${+params.id}`).catch(err => {
			if (err.response && err.response.data && err.response.data.error)
				error({ message: err.response.data.error, statusCode: err.response.status })
		});

		return { book };
	},
}
</script>