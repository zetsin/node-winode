var winode = require('../index')

winode.app.on('before-quit', function (event) {
	// event.preventDefault()
})

console.log(winode.power.info)
console.log(winode.mouse.state)
console.log(winode.keyboard.state)
winode.mouse.setCursor('hand')


var win = new winode.window
var render = win.render
var gfx = win.render.gfx

win.on('close', function() {
	winode.app.quit()
})
win.on('change', function() {
	draw()
})

var image = new winode.image(__dirname + '/QQ.png')
var font = new winode.font(__dirname + '/华文黑体.ttf')
// setInterval(draw, 1000 / 24)

function draw() {
	winode.keyboard.setTextInput([400, 400, 500, 500])

	render.copy(image.texture(render), null)

	gfx.rectFilled(100, 100, 200, 200, [0xabcdef, 100])
	gfx.ellipseFilled(600, 500, 200, 100, 0xfedcba)
	render.drawLine([
		[0, 0],
		[200, 200]
	])
	gfx.bezier([
		[300, 400],
		[200, 500],
		[700, 300]
	], 999, 0x667788)


	let text = font.blend('你好Hello', [0xaaaaaa, 0xaa], 0xffffff)
	render.cut(text.texture(render))
	render.present()

}