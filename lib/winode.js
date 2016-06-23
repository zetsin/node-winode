var EventEmitter = require('events')
var util = require('util')

var SDL2 = require('node-SDL2')
var SDL = SDL2('SDL')
var SDL_events = SDL2('SDL_events')
var SDL_video = SDL2('SDL_video')
var SDL_messagebox = SDL2('SDL_messagebox')

var ref = require('ref')
var Canvas = require('Canvas')

var globals = {
	event: false,
	wins: new windows()
}

function app(options) {
	var self = this
	if (!(self instanceof app)) {
		return new app(options)
	}
	EventEmitter.call(self)


	if(globals.inited) {
		return
	}

	options = options || {}
	options.flags = options.flags || 0

	if(SDL.SDL_Init(options.flags) != 0) {
		self.quit()
		return
	}

	this.on('_event', function(event) {
		if (event.type == SDL_events.SDL_EventType.SDL_QUIT){
			// self.quit()
		}
	})

	;(function forever() {
		globals.event = ref.alloc(SDL_events.SDL_Event)
		var pending = SDL_events.SDL_PollEvent(globals.event)
		if(pending){
			globals.event = globals.event.deref()

			if(globals.event.type >= SDL_events.SDL_EventType.SDL_WINDOWEVENT && globals.event.type <= SDL_events.SDL_EventType.SDL_MOUSEWHEEL) {
				var win = globals.wins.retrive(globals.event.window.windowID)
				if(win) {
					win.emit('_event', globals.event)
				}
			} else {
				self.emit('_event', globals.event)
			}
		}

		if(pending) {
			process.nextTick(forever)
		} else {
			setTimeout(forever)
		}
	})()
}
util.inherits(app, EventEmitter)
app.prototype.quit = function() {
	var self = this

	preventDefault(self, 'before-quit', function() {
		self.exit()
	})
}
app.prototype.exit = function(exitCode){
	var self = this

	preventDefault(self, 'will-quit', function() {
		SDL.SDL_Quit()
		process.exit(exitCode)
	})
}

function windows () {
	if (!(this instanceof windows)) {
		return new windows()
	}
	this.wins = {}
}
windows.prototype.create = function(id, win) {
	this.wins[id] = win
}
windows.prototype.retrive = function(id) {
	return this.wins[id]
}
windows.prototype.delete = function(id) {
	delete this.wins[id]
}
windows.prototype.forEach = function(callback) {
	var self = this
	callback = callback || function() {}
	Object.keys(this.wins).forEach(function(key) {
		callback(self.wins[key])
	})
}

globals.app = exports.app = new app


function window (options) {
	var self = this
	if (!(self instanceof window)) {
		return new window(options)
	}
	EventEmitter.call(self)

	options = options || {}
	options.title = options.title || 'Winode'
	options.x = options.x || 0x1FFF0000
	options.y = options.y || 0x1FFF0000
	options.width = options.width || 640
	options.height = options.height || 480

	var instance = SDL_video.SDL_CreateWindow(options.title, options.x, options.y, options.width, options.height, 0x00000020)
	var id = SDL_video.SDL_GetWindowID(instance)
	Object.defineProperties(self, {
		_instance: {
			get: function() {
				return instance
			}
		},
		_closable: {
			get: function() {
				return !!(self.closable || true)
			},
			set: function() {
				self.closable = !!value
			}
		},
		id: {
			get: function() {
				return id
			},
			enumable: true
		}
	})
	globals.wins.create(id, self)

	self.on('_event', function(event) {
		if(event.type == SDL_events.SDL_EventType.SDL_WINDOWEVENT) {
			var evt = event.window.event
			if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_SHOWN) {
				self.emit('show')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_HIDDEN) {
				self.emit('hide')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_EXPOSED) {
				// console.log('exposed')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_MOVED) {
				self.emit('move', event.window.data1, event.window.data2)
				self.emit('moved', event.window.data1, event.window.data2)
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_RESIZED) {
				self.emit('resize', event.window.data1, event.window.data2)
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_SIZE_CHANGED) {
				self.emit('transform')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_MINIMIZED) {
				self.emit('minimize')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_MAXIMIZED) {
				self.emit('maximize')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_RESTORED) {
				self.emit('restore')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_ENTER) {
				self.emit('enter')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_LEAVE) {
				self.emit('leave')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_FOCUS_GAINED) {
				self.emit('focus')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_FOCUS_LOST) {
				self.emit('blur')
			}
			else if(evt == SDL_video.SDL_WindowEventID.SDL_WINDOWEVENT_CLOSE) {
				self.close()
			}
		}
		else if(event.type == SDL_events.SDL_EventType.SDL_WINDOWEVENT) {

		}
		else if(event.type == SDL_events.SDL_EventType.SDL_WINDOWEVENT) {
			
		}
		else if(event.type == SDL_events.SDL_EventType.SDL_WINDOWEVENT) {
			
		}
		else if(event.type == SDL_events.SDL_EventType.SDL_WINDOWEVENT) {
			
		}
		else if(event.type == SDL_events.SDL_EventType.SDL_WINDOWEVENT) {
			
		}
		else if(event.type == SDL_events.SDL_EventType.SDL_WINDOWEVENT) {
			
		}
	})

}
util.inherits(window, EventEmitter)
window.prototype.close = function() {
	var self = this
	if(!self.isClosable()) {
		return
	}
	preventDefault(self, 'close', function() {
		self.destroy()
	})
}
window.prototype.destroy = function() {
	SDL_video.SDL_DestroyWindow(this._instance)
	globals.wins.delete[self.id]
	self.emit('closed')
}
window.prototype.focus = function() {
	SDL_video.SDL_RaiseWindow(this._instance)
}
window.prototype.isFocus = function() {
	return this.id == window.getFocusedWindow().id
}
window.prototype.isGrabbed = function() {
	return !!SDL_video.SDL_GetGrabbedWindow(this._instance)
}
window.prototype.show = function() {
	this.showInactive()
	this.focus()
}
window.prototype.showInactive = function() {
	SDL_video.SDL_ShowWindow(this._instance)
}
window.prototype.hide = function() {
	SDL_video.SDL_HideWindow(this._instance)
}
window.prototype.isVisible = function() {
	return !!(SDL_video.SDL_GetWindowFlags(this._instance) & SDL_video.SDL_WindowFlags.SDL_WINDOW_SHOWN)
}
window.prototype.maximize = function() {
	SDL_video.SDL_MaximizeWindow(this._instance)
}
window.prototype.unmaximize = function() {
	if(this.isMaximized()) {
		this.restore()
	}
}
window.prototype.isMaximized = function() {
	return !!(SDL_video.SDL_GetWindowFlags(this._instance) & SDL_video.SDL_WindowFlags.SDL_WINDOW_MAXIMIZED)
}
window.prototype.minimize = function() {
	SDL_video.SDL_MinimizeWindow(this._instance)
}
window.prototype.unMinimize = function() {
	if(this.isMinimized()) {
		this.restore()
	}
}
window.prototype.isMinimized = function() {
	return !!(SDL_video.SDL_GetWindowFlags(this._instance) & SDL_video.SDL_WindowFlags.SDL_WINDOW_MINIMIZED)
}
window.prototype.restore = function() {
	SDL_video.SDL_RestoreWindow(this._instance)
}
window.prototype.setFullScreen = function(flag) {
	if(flag == true) {
		flag = SDL_video.SDL_WindowFlags.SDL_WINDOW_FULLSCREEN
	} else if(flag == false) {
		flag = 0
	} else {
		flag = SDL_video.SDL_WindowFlags.SDL_WINDOW_FULLSCREEN_DESKTOP
	}
	SDL_video.SDL_SetWindowFullscreen(flag)
}
window.prototype.isFullScreen = function() {
	return !!(SDL_video.SDL_GetWindowFlags(this._instance) & SDL_video.SDL_WindowFlags.SDL_WINDOW_FULLSCREEN)
}
window.prototype.setBounds = function(options) {
	this.setSize(options.width, options.height)
	this.setPosition(options.x, options.y)
}
window.prototype.getBounds = function() {
	var position = this.getPosition()
	var size = this.getSize()
	return arrlike({
		x: position.x,
		y: position.y,
		width: size.width,
		height: size.height
	})
}
window.prototype.setSize = function(width, height) {
	var size = this.getSize()

	width = parseInt(width) || size[0]
	height = parseInt(height) || size[1]

	SDL_video.SDL_SetWindowSize(this._instance, width, height)
}
window.prototype.getSize = function() {
	var width = ref.alloc('int')
	var height = ref.alloc('int')
	SDL_video.SDL_GetWindowSize(this._instance, width, height)
	return arrlike({
		width: width.deref(), 
		height: height.deref()
	})
}
windows.prototype.setMinimumSize = function(width, height) {
	var size = this.getSize()

	width = parseInt(width) || size[0]
	height = parseInt(height) || size[1]

	SDL_video.SDL_SetWindowMinimumSize(this._instance, width, height)

}
windows.prototype.getMinimumSize = function() {
	var width = ref.alloc('int')
	var height = ref.alloc('int')
	SDL_video.SDL_GetWindowMinimumSize(this._instance, width, height)
	return arrlike({
		width: width.deref(), 
		height: height.deref()
	})
}
windows.prototype.setMaximumSize = function(width, height) {
	var size = this.getSize()

	width = parseInt(width) || size[0]
	height = parseInt(height) || size[1]

	SDL_video.SDL_SetWindowMaximumSize(this._instance, width, height)

}
windows.prototype.getMaximumSize = function() {
	var width = ref.alloc('int')
	var height = ref.alloc('int')
	SDL_video.SDL_GetWindowMaximumSize(this._instance, width, height)
	return arrlike({
		width: width.deref(), 
		height: height.deref()
	})
}
window.prototype.setResizable = function(resizable) {

}
window.prototype.isResizable = function() {
	return !!(SDL_video.SDL_GetWindowFlags(this._instance) & SDL_video.SDL_WindowFlags.SDL_WINDOW_RESIZABLE)
}
window.prototype.setMovable = function(movable) {

}
window.prototype.isMovable = function() {

}
window.prototype.setMinimizable = function(minimizable) {

}
window.prototype.isMinimizable = function() {

}
window.prototype.setMaximizable = function(maximizable) {

}
window.prototype.isMaximizable = function() {

}
window.prototype.setFullScreenable = function(fullScreenable) {

}
window.prototype.isFullScreenable = function() {

}
window.prototype.setClosable = function(closable) {
	this._closable = closable
}
window.prototype.isClosable = function() {
	return this._closable
}
window.prototype.setAlwaysOnTop = function(flag) {
}
window.prototype.isAlwaysOnTop = function() {
}
window.prototype.center = function() {
	this.setPosition(0x2FFF0000, 0x2FFF0000)
}
window.prototype.setPosition = function(x, y) {
	var position = this.getPosition()

	x = parseInt(x) || position[0]
	y = parseInt(y) || position[1]

	SDL_video.SDL_SetWindowPosition(this._instance, x, y)
}
window.prototype.getPosition = function() {
	var x = ref.alloc('int')
	var y = ref.alloc('int')
	SDL_video.SDL_GetWindowPosition(this._instance, x, y)
	return arrlike({
		x: x.deref(), 
		y: y.deref()
	})
}
window.prototype.setTitle = function(title) {
	SDL_video.SDL_SetWindowTitle(this._instance, title.toString())
}
window.prototype.getTitle = function() {
	return SDL_video.SDL_GetWindowTitle(this._instance)
}
window.prototype.setBordered = function(flag) {
	SDL_video.SDL_SetWindowBordered(this._instance, !!flag)
}
window.prototype.getBorder = function() {
	var top = ref.alloc('int')
	var left = ref.alloc('int')
	var bottom = ref.alloc('int')
	var right = ref.alloc('int')
	SDL_video.SDL_GetWindowBordersSize(this._instance, top, left, bottom, right)
	return arrlike({
		top: top.deref(), 
		left: left.deref(), 
		bottom: bottom.deref(), 
		right: right.deref()
	})
}
window.prototype.setOpacity = function(opacity) {
	// opacity = parseFloat(opacity) || 0
	// SDL_video.SDL_SetWindowOpacity(this._instance, opacity)
}
window.prototype.getOpacity = function() {
	// var opacity = ref.alloc('int')
	// SDL_video.SDL_GetWindowOpacity(this._instance, opacity)
	// return opacity.deref()
}
window.prototype.setModal = function(win) {
	if(win && win._instance) {
		SDL_video.SDL_SetWindowModalFor(win._instance, this._instance)
	}
}

window.getAllWindows = function() {
	return Object.keys(globals.wins).map(function(key) { return globals.wins[key] })
}
window.getFocusedWindow = function() {
	var instance = SDL_video.SDL_GL_GetCurrentWindow()
	var id = SDL_video.SDL_GetWindowID(instance)
	return globals.wins[id]
}
window.getGrabbedWindow = function() {
	var instance = SDL_video.SDL_GetGrabbedWindow()
	var id = SDL_video.SDL_GetWindowID(instance)
	return globals.wins[id]
}
window.fromId = function(id) {
	return globals.wins[id]
}
window.showMessageBox = function(opts, callback) {
	opts = opts || {}

	opts.type = opts.type
	if(opts.type == 'error') {
		opts.type = SDL_messagebox.SDL_MessageBoxFlags.SDL_MESSAGEBOX_ERROR
	} else if(opts.type == 'warning') {
		opts.type = SDL_messagebox.SDL_MessageBoxFlags.SDL_MESSAGEBOX_WARNING
	} else {
		opts.type = SDL_messagebox.SDL_MessageBoxFlags.SDL_MESSAGEBOX_INFORMATION
	}

	opts.window = opts.window
	if(opts.window && opts.window._instance) {
		opts.window = opts.window._instance
	} else {
		opts.window = null
	}

	opts.title = opts.title ? opts.title.toString() : ''
	opts.message = opts.message ? opts.message.toString() : ''

	opts.buttons = opts.buttons || []
	var num = opts.buttons.length
	var size = SDL_messagebox.SDL_MessageBoxButtonData.size
	var mbbd = new Buffer(num * size)
	mbbd.type = SDL_messagebox.SDL_MessageBoxButtonData

	opts.buttons.forEach(function(button, index) {
		var type = button.flag
		if(type == 'yes') {
			type = SDL_messagebox.SDL_MessageBoxButtonFlags.SDL_MESSAGEBOX_BUTTON_RETURNKEY_DEFAULT
		} else if(type = 'cancel') {
			type = SDL_messagebox.SDL_MessageBoxButtonFlags.SDL_MESSAGEBOX_BUTTON_ESCAPEKEY_DEFAULT
		} else {
			type = 0
		}
		ref.set(mbbd, index * size, new SDL_messagebox.SDL_MessageBoxButtonData({
			flags: type,
			buttonid: index,
			text: button.text ? button.text.toString() : ''
		}))
	})

	// opts.colors = opts.colors || {}
	// var mbcs = new SDL_messagebox.SDL_MessageBoxColorScheme
	// mbcs.colors[0].r = opts.colors.background & 0xFF
	// mbcs.colors[0].g = opts.colors.background & 0xFF00
	// mbcs.colors[0].b = opts.colors.background & 0xFF0000
	// mbcs.colors[1].r = opts.colors.text & 0xFF
	// mbcs.colors[1].g = opts.colors.text & 0xFF00
	// mbcs.colors[1].b = opts.colors.text & 0xFF0000
	// mbcs.colors[2].r = opts.colors.buttonBorder & 0xFF
	// mbcs.colors[2].g = opts.colors.buttonBorder & 0xFF00
	// mbcs.colors[2].b = opts.colors.buttonBorder & 0xFF0000
	// mbcs.colors[3].r = opts.colors.buttonBackground & 0xFF
	// mbcs.colors[3].g = opts.colors.buttonBackground & 0xFF00
	// mbcs.colors[3].b = opts.colors.buttonBackground & 0xFF0000
	// mbcs.colors[4].r = opts.colors.buttonSelected & 0xFF
	// mbcs.colors[4].g = opts.colors.buttonSelected & 0xFF00
	// mbcs.colors[4].b = opts.colors.buttonSelected & 0xFF0000

	var mbd = new SDL_messagebox.SDL_MessageBoxData({
		flags: opts.type,
		window: opts.window,
		title: opts.title,
		message: opts.message,
		numbuttons: num,
		buttons: mbbd,
		colorScheme: null
	})

	var id = ref.alloc('int')
	SDL_messagebox.SDL_ShowMessageBox(mbd.ref(), id)
	id = id.deref()
	callback(opts.buttons[id], id)
}
exports.window = window


function preventDefault(emitter, event, callback) {
	callback = callback || function() {}
	var prevent = false

	emitter.listeners(event).forEach(function(listener) {
		listener.call(emitter, {
			preventDefault: function() {
				prevent = true
			}
		})
	})
	if(!prevent) callback()
}

function arrlike(obj) {
	Object.keys(obj).forEach(function(value, index) {
		obj[index] = obj[value]
	})
	return obj
}
