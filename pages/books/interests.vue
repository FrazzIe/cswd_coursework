<template>
	<v-row>
		<v-col cols="12">
			<v-card>
				<v-toolbar elevation="0">
					<v-toolbar-title>Interests</v-toolbar-title>
				</v-toolbar>
				<v-divider></v-divider>
				<v-list>
					<v-subheader>Based on your history</v-subheader>
					<v-list-item-group>
						<v-list-item v-for="(item, index) in historyInterests" :key="index">
							<v-list-item-content>
								{{ item.category }}
							</v-list-item-content>
						</v-list-item>
					</v-list-item-group>
				</v-list>
				<v-divider></v-divider>
				<v-subheader>Your picks</v-subheader>
				<v-list>
					<v-list-item-group>
						<v-list-item v-for="(item, index) in userInterests" :key="index">
							<v-list-item-content>
								{{ item.category }}
							</v-list-item-content>
							<v-list-item-action>
								<v-icon color="error" @click="removeInterest(item.category)">mdi-bookmark-remove</v-icon>
							</v-list-item-action>
						</v-list-item>
					</v-list-item-group>
				</v-list>
				<v-divider></v-divider>
				<v-subheader>New interest</v-subheader>
				<v-form ref="form" @submit.prevent="newInterest()">
					<v-card-text>
						<v-select solo label="Available interests" placeholder="Choose an interest" :items="availableInterests" v-model="input.interest"
							:rules="[
								() => !!input.interest || 'An interest is required',
							]"
						></v-select>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn type="submit" text color="primary">ADD INTEREST</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-col>
	</v-row>
</template>

<style>
</style>

<script>
import { mapGetters } from "vuex";
import snackBar from "@/components/snackBar";
import loader from "@/components/loader";

export default {
	components: {
		snackBar,
		loader
	},
	middleware: "auth",
	auth: true,
	data: () => ({
		input: {
			interest: null,
		},
		interests: {
			current: [],
			available: [],
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
		...mapGetters(["loggedInUser"]),
		historyInterests() {
			return this.interests.current.filter((item) => item.interest === 0);
		},
		userInterests() {
			return this.interests.current.filter((item) => item.interest === 1);
		},
		availableInterests() {
			let available = [];

			for (var i = 0; i < this.interests.available.length; i++)
				available.push(this.interests.available[i].category);
			
			return available;
		}
	},
	methods: {
		newInterest() {
			if (this.$refs.form.validate()) {
				this.loader.message = "Adding interest..";
				this.loader.show = true;

				this.$axios.$post(`/api/books/interest/add`, { data: this.input }).then((resp) => {
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
		removeInterest(interest) {
			this.loader.message = "Removing interest..";
			this.loader.show = true;

			this.$axios.$post(`/api/books/interest/remove`, { data: { interest: interest} }).then((resp) => {
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
		},
	},
	async asyncData({ error, $axios }) {
		const interests = await $axios.$get("/api/books/interests").catch(err => {
			if (err.response && err.response.data && err.response.data.error)
				error({ message: err.response.data.error, statusCode: err.response.status })
		});

		return { interests };
	},
}
</script>