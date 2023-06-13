import { reactive } from 'vue'

export const ROWS = 9;
export const COLS = 16;

export const cells = reactive([
	// ペンタデカスロン
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,1,0,0,0,0],
	[0,0,0,0,1,0,0,0,0],
	[0,0,0,0,1,0,0,0,0],
	[0,0,0,0,1,0,0,0,0],
	[0,0,0,0,1,0,0,0,0],
	[0,0,0,0,1,0,0,0,0],
	[0,0,0,0,1,0,0,0,0],
	[0,0,0,0,1,0,0,0,0],
	[0,0,0,0,1,0,0,0,0],
	[0,0,0,0,1,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	/*
	// Clock 4x4 - https://ja.wikipedia.org/wiki/%E6%99%82%E8%A8%88_(%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B2%E3%83%BC%E3%83%A0)
	[0,1,0,0,0],
	[0,0,1,1,0],
	[1,1,0,0,0],
	[0,0,1,0,0],
	[0,0,0,0,0],
	*/
	/*
	// Blinker 3x3 - https://ja.wikipedia.org/wiki/%E6%8C%AF%E5%8B%95%E5%AD%90_(%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B2%E3%83%BC%E3%83%A0)
	[0,0,0,0,0],
	[0,0,0,0,0],
	[0,1,1,1,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
	*/
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
	// リアクティブなしの値のみをコピー（ディープコピー）
	// ディープコピーの方法はこちらを参照
	// https://developer.mozilla.org/ja/docs/Glossary/Deep_copy
	let next = JSON.parse(JSON.stringify(cells))
	/* ↑の一行は↓に相当
	let next
	{
		// 新しい状態を記録するための next[COLS][ROWS]  を準備する
		// 
		// ↓だとリアクティブ値をコピーしてしまい、上書きで元データを破壊してしまう
		// const next = Array.from(cells)
		// したがって配列をコピーする
		//
		// Array[COLS][ROWS] を初期化し、
		next = Array.from(Array(COLS).keys()).map(
			(i) => Array.from(Array(ROWS).keys()).map(
				(i) => ''
			)
		)
		// 内容をコピー
		for(let y = 0 ; y < ROWS ; y++){
			for(let x = 0 ; x < COLS ; x++){
				next[x][y] = cells[x][y] ? 1 : 0
			}
		}
	}
	*/

	// calc old -> next
	for(let y = 0 ; y < ROWS ; y++){
		for(let x = 0 ; x < COLS ; x++){
			// 上下左右斜めの計８方向を読み取る
			const power = upper(x,y) + bottom(x,y) + left(x,y) + right(x,y)
				+ ul(x,y) + ur(x,y)
				+ bl(x,y) + br(x,y)
			switch(power){
				// 過疎
				// 生きているセルに隣接する生きたセルが1つ以下ならば、過疎により死滅する。
				case 0:
				case 1:
					next[x][y] = 0
					break;
				// 生存
				// 生きているセルに隣接する生きたセルが2つか3つならば、次の世代でも生存する。
				case 2:
					// かわらず(ない→ない、ある→ある)
					break;
				// 誕生
				// 死んでいるセルに隣接する生きたセルがちょうど3つあれば、次の世代が誕生する。
				case 3:
					next[x][y] = 1
					break;
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
					// 過密
					// 生きているセルに隣接する生きたセルが4つ以上ならば、過密により死滅する。
					next[x][y] = 0
					break;
			}
		}
	}

	// 計算した最新情報を現在の値に反映
	// →cellsはリアクティブ値なので画面上の表示も更新される
	for(let y = 0 ; y < ROWS ; y++){
		for(let x = 0 ; x < COLS ; x++){
			cells[x][y] = next[x][y]
		}
	}
}

function upper(x,y){
	if(y <= 0){ return 0 }
	return cells[x][y-1]
}

function bottom(x,y){
	if(y >= ROWS-1){ return 0 }
	return cells[x][y+1]
}

function right(x,y){
	if(x >= COLS-1){ return 0 }
	return cells[x+1][y]
}

function left(x,y){
	if(x <= 0){ return 0 }
	return cells[x-1][y]
}

function ul(x,y){
	if(y <= 0){ return 0 }
	if(x <= 0){ return 0 }
	return cells[x-1][y-1]
}

function ur(x,y){
	if(y <= 0){ return 0 }
	if(x >= COLS-1){ return 0 }
	return cells[x+1][y-1]
}

function bl(x,y){
	if(y >= ROWS-1){ return 0 }
	if(x <= 0){ return 0 }
	return cells[x-1][y+1]
}

function br(x,y){
	if(y >= ROWS-1){ return 0 }
	if(x >= COLS-1){ return 0 }
	return cells[x+1][y+1]
}
