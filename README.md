# セル・オートマトンのVue.js 実装

https://ja.vuejs.org/examples/#cells を参考に

## 参考にするソースの研究

Cell.vueに自身の状態をもたせるのではなく、
仮想VRAM形式とし、仮想VRAMをstore.js としている
Cell.vue とは仮想VRAMを共有し、xy座標は親コンポーネントからプロパティ経由で最低限の情報を渡している

## コンウェイのライフゲーム
https://ja.wikipedia.org/wiki/%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B2%E3%83%BC%E3%83%A0
誕生
  死んでいるセルに隣接する生きたセルがちょうど3つあれば、次の世代が誕生する。
生存
  生きているセルに隣接する生きたセルが2つか3つならば、次の世代でも生存する。
過疎
  生きているセルに隣接する生きたセルが1つ以下ならば、過疎により死滅する。
過密
  生きているセルに隣接する生きたセルが4つ以上ならば、過密により死滅する。

ものすごい形の新種の移動物体が見つかったようです。
https://twitter.com/1Hassium/status/1666384674300792832?cxt=HBwWgMDUrYmCmKAuAAAA&cn=ZmxleGlibGVfcmVjcw%3D%3D&refsrc=email

## その他、詰まったところなど

- 2023\06\2023-06-12-145632.txt|1| = [js][vue] js では変化前後の値をconsole.logできない？→yes→観察したいならデバッガーを使え
- リアクティブ値の配列を作業用配列にコピーする再に、リアクティブ付きの値のコピーをしてしまうと作業用の書き換えの際にオリジナルを破壊してしまうので、理アクティビティーなしの値をコピーする必要があった。
    ```
	let next = JSON.parse(JSON.stringify(cells)) // リアクティブなしの値のみをコピー（ディープコピー）
    ```
