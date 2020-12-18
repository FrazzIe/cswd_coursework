<template>
	<v-img :src="picture" :max-height="height" contain></v-img>
</template>

<script>
import placeholder from "@/assets/cover-placeholder.jpg";

export default {
	data: () => ({
		picture: placeholder
	}),
	props: {
		isbn: {
			type: String,
			required: true,
			default: "",
		},
		height: {
			type: String,
			required: false,
			default: "300px",
		},
		size: {
			type: String,
			required: false,
			default: "M",
		}
	},
	mounted() {
		let img = new Image();
		let url = `http://covers.openlibrary.org/b/isbn/${this.isbn}-${this.size}.jpg?default=false`

		img.src = url;
		img.onload = () => this.picture = url;
		img.onerror = () => this.picture = placeholder;
	}
}
</script>