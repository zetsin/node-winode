'use strict'

const EventEmitter = require('events')

const libSDL2 = require('node-SDL2')
const SDL_clipboard = libSDL2('SDL_clipboard')

class clipboard extends EventEmitter {
	constructor() {
		super()
	}
	hasText() {
		return !!SDL_clipboard.SDL_HasClipboardText()
	}

	get text() {
		return SDL_clipboard.SDL_GetClipboardText()
	}
	set text(value) {
		value = (value || '').toString()
		SDL_clipboard.SDL_SetClipboardText(value)
	}
}

module.exports = new clipboard