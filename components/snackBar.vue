<template>
	<v-snackbar v-model="snack" :color="snackColor" absolute bottom right elevation="24" text :timeout="6000">
		{{ snackMessage }}

		<template v-slot:action="{ closeSnack }">
			<v-btn icon v-bind="closeSnack" @click="snack = false">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</template>
	</v-snackbar>
</template>

<script>
export default {
	data: () => ({
		snack: false,
	}),
	props: {
		snackMessage: {
			type: String,
			required: true,
			default: "",
		},
		snackColor: {
			type: String,
			required: true,
			default: "error"
		}
	},
	watch: {
		snackMessage(val) {
			if (val.length > 1)
				this.snack = true;
		},
		snack(val) {
			if (val === false)
				this.$emit("update:snackMessage", "");
		}
	}
}
</script>