'use strict'

const libSDL2 = require('node-SDL2')
const SDL_surface = libSDL2('SDL_surface')

const SDL_image = require('sdl2-image')('SDL_image')

const utils = require('./utils')

const ref = require('ref')

class image {
	constructor(file) {
		this._texture = null
		
		this._surface = SDL_image.IMG_Load(file)
		this.file = file
	}

	free() {
		SDL_surface.SDL_FreeSurface(this._surface)
	}
	texture(_render) {
		this._texture = this._texture || _render.createTextureFromSurface(this._surface)
		return this._texture
	}
}

module.exports = image