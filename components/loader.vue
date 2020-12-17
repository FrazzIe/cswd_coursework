<template>
	<v-dialog v-model="show" persistent :width="300" hide-overlay>
		<v-card tile>
			<v-card-text class="text-xs-center">
				{{ message }}
				<v-progress-linear indeterminate color="primary" class="mb-0"></v-progress-linear>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props: {
		message: {
			type: String,
			required: true,
			default: "Loading..",
		},
		show: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
};
</script>