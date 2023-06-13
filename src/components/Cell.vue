<script setup>
import { cells } from '../store.js'

const props = defineProps({
	c: Number,
	r: Number
})
</script>

<template>
	<div>
		{{ cells[c][r] }}
	</div>
</template>

