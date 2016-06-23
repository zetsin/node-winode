var winode = require('../lib/winode')
var app = winode.app
var window = winode.window

app.on('before-quit', function (event) {
	// event.preventDefault()
})


var win = window()
win.on('close', function() {
	app.quit()
})
win.setOpacity()

// window.showMessageBox({
// 	buttons: [
// 		{
// 			text: 'text',
// 		},
// 		{
// 			text: 'text2',
// 		}
// 	],
// 	colors: {
// 		background: 0x1
// 	}
// }, function(button, index) {
// 	console.log(index)
// })
// window.showSimpleMessageBox('刘小花hello', 'world', 'error', win)

// setInterval(function() {
// 	console.log(win.isVisible())
// })

// var win2 = window()