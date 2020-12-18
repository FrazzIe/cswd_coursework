<template>
	<v-row justify="center" align="center">
		<v-col sm="7" md="5" lg="4" xl="3">
				<v-card class="elevation-12" tile>
					<v-toolbar class="transparent" flat dense>
						<nuxt-link to="/" class="pointer" tag="v-toolbar-title">
							<v-icon left>mdi-home</v-icon>
							Techreads
						</nuxt-link>
					</v-toolbar>

					<v-divider></v-divider>
					<v-form ref="form" @submit.prevent="login">
						<v-card-text>						
							<v-text-field prepend-icon="mdi-account" label="Username" v-model="input.username" 
								:rules="[
									() => !!input.username || 'A username is required',
									() => !!input.username && input.username.length <= 30 || 'Username must be less than 30 characters',
									usernameCheck,
								]" counter="30"></v-text-field>
							<v-text-field type="password" prepend-icon="mdi-lock" label="Password" v-model="input.password"
								:rules="[
									() => !!input.password || 'A password is required',
									() => !!input.password && input.password.length >= 8 || 'Password must be at least 8 characters long',
									passwordCheck,
								]"
							></v-text-field>						
						</v-card-text>
						
						<v-divider></v-divider>

						<v-card-actions>
							<v-btn color="primary" text @click="register">Register</v-btn>
							<v-spacer></v-spacer>
							<v-btn type="submit" color="success" text>Login</v-btn>
						</v-card-actions>
					</v-form>
				</v-card> 
		</v-col>
		<snack-bar :snack-message.sync="snack.message" :snack-color="snack.color"></snack-bar>
		<loader :message="loader.message" :show="loader.show"></loader>
	</v-row>
</template>

<style>
</style>

<script>
import snackBar from "@/components/snackBar";
import loader from "@/components/loader";

export default {
	components: {
		snackBar,
		loader,
	},
	layout: "auth",
	middleware: "auth",
	auth: "guest",
	data: () => ({
		input: {
			username: "",
			password: "",
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
	methods: {
		login() {
			if (this.$refs.form.validate()) {
				this.loader.message = "Logging in..";
				this.loader.show = true;

				this.$auth.loginWith("local", { data: this.input }).then((resp) => {

					console.log(resp);
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
		register() {
			if (this.$refs.form.validate()) {
				this.loader.message = "Registering..";
				this.loader.show = true;

				this.$axios.post("/api/auth/register", { data: this.input }).then((resp) => {
					this.loader.show = false;
					if (resp) {
						if (resp.error) {
							this.snack.color = "error";
							this.snack.message = resp.error;
							console.log(resp.error);
							return;
						}

						this.login();
					}
				}).catch((error) => {
					this.loader.show = false;
					if (error.response && error.response.data && error.response.data.error) {
						console.log(error.response.data.error);
						this.snack.color = "error";
						this.snack.message = error.response.data.error;
					} else
						console.log(error.message);
				})
			}
		},
		usernameCheck() {
			const pattern = /^(?=.{1,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
			return pattern.test(this.input.username) || "Invalid username";
		},
		passwordCheck() {
			const uppercase = /(?=.*?[A-Z])/;
			const lowercase = /(?=.*?[a-z])/;
			const number = /(?=.*?[0-9])/;
			const special = /(?=.*?[#?!@$%^&*-])/;

			if (!uppercase.test(this.input.password))
				return "Password must contain at least one uppercase letter";
			if (!lowercase.test(this.input.password))
				return "Password must contain at least one lowercase letter";
			if (!number.test(this.input.password))
				return "Password must contain at least one number";
			if (!special.test(this.input.password))
				return "Password must contain at least one special character";

			return true;
		}
	}
}
</script>
