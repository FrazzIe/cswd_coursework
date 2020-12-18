<template>
	<v-app>
		<v-app-bar fixed app>
			<nuxt-link to="/" class="pointer" tag="v-toolbar-title">
				Book Catalog
			</nuxt-link>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<v-btn elevation="0" to="/books/all" nuxt exact>
					<v-icon left>mdi-book-open-variant</v-icon>
					ALL BOOKS
				</v-btn>
				<template v-if="isAuthenticated">
					<v-btn elevation="0" to="/books/history" nuxt exact>
						<v-icon left>mdi-history</v-icon>
						MY HISTORY
					</v-btn>
					<v-btn elevation="0" to="/books/interests" nuxt exact>
						<v-icon left>mdi-thumbs-up-down</v-icon>
						MY INTERESTS
					</v-btn>
					<v-menu v-model="accountMenu" :close-on-content-click="false" :nudge-width="200" offset-y bottom rounded="0">
						<template v-slot:activator="{ on, attrs }">
							<v-btn elevation="0" v-bind="attrs" v-on="on">
								<v-icon left>mdi-account</v-icon>
								{{ loggedInUser.name }}
							</v-btn>
						</template>

						<v-card elevation="0" tile>
							<v-list>
								<v-list-item>
									<v-list-item-content>
										<v-list-item-title>{{ loggedInUser.name }}</v-list-item-title>
										<v-list-item-subtitle>{{ capitalise(loggedInUser.scope) }}</v-list-item-subtitle>
									</v-list-item-content>

									<v-list-item-action>
										<v-btn icon color="error" @click="logout">
											<v-icon>mdi-exit-to-app</v-icon>
										</v-btn>
									</v-list-item-action>
								</v-list-item>
							</v-list>
						</v-card>
					</v-menu>
				</template>
				<template v-else>
				</template>
			</v-toolbar-items>
		</v-app-bar>
		<v-main>
			<v-container>
				<nuxt />
			</v-container>
		</v-main>
	</v-app>
</template>

<style>
	.pointer {
		cursor: pointer;
	}
</style>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
	data: () => ({
		accountMenu: false,
	}),
	computed: {
		...mapGetters(["isAuthenticated", "loggedInUser"]),
	},
	methods: {
		capitalise(str) {
			if (typeof str !== "string")
				return "";
			return str.charAt(0).toUpperCase() + str.slice(1);
		},
		logout() {
			this.$auth.logout().then(() => {				
				
			}).catch((error) => {
				console.log(error.message);
			});
		},
	}
}
</script>