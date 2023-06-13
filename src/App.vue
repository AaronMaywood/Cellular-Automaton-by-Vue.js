<script setup>
import { ROWS, COLS, cells, update } from './store.js'
import Cell from './components/Cell.vue'

let counter = 0
function nextTick(timestamp) {
	if(counter++>20){
		update();
		counter = 0
	}
	requestAnimationFrame(nextTick);
}

requestAnimationFrame(nextTick);
</script>

<template>
	<table>
		<tr v-for="y in cells[0].length">
			<td v-for="x in cells.length">
				<Cell :c="x-1" :r="y-1"></Cell>
			</td>
		</tr>
	</table>
</template>

<style scoped>
</style>
