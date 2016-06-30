'use strict'

const EventEmitter = require('events')
const util = require('util')

const libSDL2 = require('node-SDL2')
const SDL = libSDL2('SDL')
const SDL_events = libSDL2('SDL_events')
const SDL_mouse = libSDL2('SDL_mouse')

const SDL_image = require('sdl2-image')('SDL_image')

const wins = require('./windows')
const utils = require('./utils')
const font = require('./font')
const clipboard = require('./clipboard')

const ref = require('ref')

const globals = {
	filter: () => {}
}

class app extends EventEmitter {
	constructor(flags) {
		super()

		flags = flags || (0x00000020)

		if(SDL.SDL_Init(flags) != 0) {
			this.quit()
			return
		}
		SDL_image.IMG_Init(SDL_image.IMG_InitFlags.IMG_INIT_JPG | SDL_image.IMG_InitFlags.IMG_INIT_PNG | SDL_image.IMG_InitFlags.IMG_INIT_TIF | SDL_image.IMG_InitFlags.IMG_INIT_WEBP)
		font.init()

		this.on('_event', (event) => {
			if (event.type == SDL_events.SDL_EventType.SDL_QUIT){
				this.quit()
			}
			else if(event.type == SDL_events.SDL_EventType.SDL_CLIPBOARDUPDATE) {
				clipboard.emit('update')
			}
			else if(event.type == SDL_events.SDL_EventType.SDL_DROPFILE) {
				this.emit('drop', event.drop.file)
			}
		})

		globals.filter = SDL_events.SDL_EventFilter.toPointer((data, event) => {
			event = event.deref()

			if(event.type >= SDL_events.SDL_EventType.SDL_WINDOWEVENT && event.type <= SDL_events.SDL_EventType.SDL_MOUSEWHEEL) {
				let win = wins.retrive(event.window.windowID)
				if(win) {
					win.emit('_event', event)
				}
			} else {
				this.emit('_event', event)
			}
		})
		SDL_events.SDL_AddEventWatch(globals.filter, null)

		;(function forever() {
			let event = ref.alloc(SDL_events.SDL_Event)
			let pending = SDL_events.SDL_PollEvent(event)
			if(pending) {
				setImmediate(forever)
			} else {
				setTimeout(forever)
			}
		})()
	}

	quit() {
		utils.preventDefault(this, 'before-quit', () => {
			this.exit()
		})
	}

	hide() {
		wins.forEach((win) => {
			win.hide()
		})
	}

	show() {
		wins.forEach((win) => {
			win.show()
		})
	}

	exit(exitCode) {
		utils.preventDefault(this, 'will-quit', () => {
			font.quit()
			SDL_image.IMG_Quit()
			SDL.SDL_Quit()
			process.exit(exitCode)
		})
	}
}

module.exports = new app()
