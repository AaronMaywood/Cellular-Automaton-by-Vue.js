import { reactive } from 'vue'

export const ROWS = 5;
export const COLS = 5;

export const cells = reactive([
	// Blinker - https://ja.wikipedia.org/wiki/%E6%8C%AF%E5%8B%95%E5%AD%90_(%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B2%E3%83%BC%E3%83%A0)
	[0,0,0,0,0],
	[0,0,0,0,0],
	[0,1,1,1,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
	/*
	[1,1,0],
	[1,0,0],
	[0,0,0],
	// ↓の次のコマでは以下のようになるべき
	// [1,1,0],
	// [1,1,0],	// 真ん中が1になる
	// [0,0,0],
	*/
])

// 呼び出されれば、次のコマを計算する
// setIntervalやWindow.requestAnimationFrame()で定期更新することを想定している
export function update(){
	// TODO ↓最適化する
	// current がreactive ではいけない、↓のアルゴリズムでリアルタイムに壊してしまう。
	let current = [[],[],[],[],[]]
	// copy array
	for(let y = 0 ; y < ROWS ; y++){
		for(let x = 0 ; x < COLS ; x++){
			current[x][y] = cells[x][y] ? 1 : 0
		}
	}
	/*
	これだとバグる
	const current = Array.from(cells)
	*/

	// calc old -> next
	for(let y = 0 ; y < ROWS ; y++){
		for(let x = 0 ; x < COLS ; x++){
			const power = upper(x,y) + bottom(x,y) + left(x,y) + right(x,y)
				+ ul(x,y) + ur(x,y)
				+ bl(x,y) + br(x,y)
			switch(power){
				// 過疎
				// 生きているセルに隣接する生きたセルが1つ以下ならば、過疎により死滅する。
				case 0:
				case 1:
					current[x][y] = 0
					break;
				// 生存
				// 生きているセルに隣接する生きたセルが2つか3つならば、次の世代でも生存する。
				case 2:
					// かわらず(ない→ない、ある→ある)
					break;
				// 誕生
				// 死んでいるセルに隣接する生きたセルがちょうど3つあれば、次の世代が誕生する。
				case 3:
					current[x][y] = 1
					break;
				case 4:
					// 過密
					// 生きているセルに隣接する生きたセルが4つ以上ならば、過密により死滅する。
					current[x][y] = 0
					break;
			}
		}
	}

	// copy new tick
	for(let y = 0 ; y < ROWS ; y++){
		for(let x = 0 ; x < COLS ; x++){
			cells[x][y] = current[x][y]
		}
	}
}

function upper(x,y){
	if(y <= 0){
		return 0
	}
	return cells[x][y-1]
}

function bottom(x,y){
	if(y >= ROWS-1){
		return 0
	}
	return cells[x][y+1]
}

function right(x,y){
	if(x >= COLS-1){
		return 0
	}
	return cells[x+1][y]
}

function left(x,y){
	if(x <= 0){
		return 0
	}
	return cells[x-1][y]
}

function ul(x,y){
	if(y <= 0){
		return 0
	}
	if(x <= 0){
		return 0
	}
	return cells[x-1][y-1]
}

function ur(x,y){
	if(y <= 0){
		return 0
	}
	if(x >= COLS-1){
		return 0
	}
	return cells[x+1][y-1]
}

function bl(x,y){
	if(y >= ROWS-1){
		return 0
	}
	if(x <= 0){
		return 0
	}
	return cells[x-1][y+1]
}

function br(x,y){
	if(y >= ROWS-1){
		return 0
	}
	if(x >= COLS-1){
		return 0
	}
	return cells[x+1][y+1]
}
