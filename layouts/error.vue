<template>
	<v-app dark>
		<h1 v-if="errorName">
			{{ errorName }}: {{ error.message }}
		</h1>
		<h1 v-else>
			{{ otherError }}: {{ error.message }}
		</h1>
	</v-app>
</template>

<script>
export default {
	layout: 'empty',
	props: {
		error: {
			type: Object,
			default: null
		}
	},
	data () {
		return {
			errors: {
				404: "404 Not Found",
				500: "Internal Server Error",
				403: "Access Denied",
			},
			otherError: "An error occurred",
		}
	},
	computed: {
		errorName() {
			if (this.errors[this.error.statusCode])
				return this.errors[this.error.statusCode]
			else
				return false;
		}
	},
	head () {
		const title = this.errorName ? this.errorName : this.otherError;
			
		return { title }
	}
}
</script>

<style scoped>
	h1 {
		font-size: 20px;
	}
</style>
