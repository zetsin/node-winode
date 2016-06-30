'use strict'

const libgfx = require('sdl2-gfx')
const gfxPrimitives = libgfx('SDL2_gfxPrimitives')
const gfxRotozoom = libgfx('SDL2_rotozoom')
const utils = require('./utils')

const ref = require('ref')

class primitives {
	constructor(_render) {
		this._render = _render
	}

	point(x, y, rgba) {
		rgba = utils.parseRGBA(rgba)
		gfxPrimitives.pixelRGBA(this._render, +x, +y, rgba.r, rgba.g, rgba.b, rgba.a)
	}
	line(x1, y1, x2, y2, rgba, width) {
		rgba = utils.parseRGBA(rgba)
		rad = +(width || 0)
		if(width == 0) {
			gfxPrimitives.aalineRGBA(this._render, +x1, +y1, +x2, +y2, rgba.r, rgba.g, rgba.b, rgba.a)
		} else {
			gfxPrimitives.thickLineRGBA(this._render, +x1, +y1, +x2, +y2, width, rgba.r, rgba.g, rgba.b, rgba.a)
		}
	}
	rect(x1, y1, x2, y2, rgba, rad) {
		rgba = utils.parseRGBA(rgba)
		rad = +(rad || 0)
		if(rad == 0) {
			gfxPrimitives.rectangleRGBA(this._render, +x1, +y1, +x2, +y2, rgba.r, rgba.g, rgba.b, rgba.a)
		} else {
			gfxPrimitives.roundedRectangleRGBA(this._render, +x1, +y1, +x2, +y2, rad, rgba.r, rgba.g, rgba.b, rgba.a)
		}
	}
	rectFilled(x1, y1, x2, y2, rgba, rad) {
		rgba = utils.parseRGBA(rgba)
		rad = +(rad || 0)
		if(rad == 0) {
			gfxPrimitives.boxRGBA(this._render, +x1, +y1, +x2, +y2, rgba.r, rgba.g, rgba.b, rgba.a)
		} else {
			gfxPrimitives.roundedBoxRGBA(this._render, +x1, +y1, +x2, +y2, rad, rgba.r, rgba.g, rgba.b, rgba.a)
		}
	}
	ellipse(x, y, rx, ry, rgba) {
		rgba = utils.parseRGBA(rgba)
		gfxPrimitives.aaellipseRGBA(this._render, +x, +y, +rx, +ry, rgba.r, rgba.g, rgba.b, rgba.a)
	}
	ellipseFilled(x, y, rx, ry, rgba) {
		rgba = utils.parseRGBA(rgba)
		gfxPrimitives.filledEllipseRGBA(this._render, +x, +y, +rx, +ry, rgba.r, rgba.g, rgba.b, rgba.a)
	}
	pie(x, y, rad, start, end, rgba) {
		rgba = utils.parseRGBA(rgba)
		gfxPrimitives.pieRGBA(this._render, +x, +y, +rad, +start, +end, rgba.r, rgba.g, rgba.b, rgba.a)
	}
	pieFilled(x, y, rad, start, end, rgba) {
		rgba = utils.parseRGBA(rgba)
		gfxPrimitives.filledPieRGBA(this._render, +x, +y, +rad, +start, +end, rgba.r, rgba.g, rgba.b, rgba.a)
	}
	trigon(x1, y1, x2, y2, x3, y3, rgba) {
		rgba = utils.parseRGBA(rgba)
		gfxPrimitives.aatrigonRGBA(this._render, +x1, +y1, +x2, +y2, +x3, +y3, rgba.r, rgba.g, rgba.b, rgba.a)
	}
	trigonFilled(x1, y1, x2, y2, x3, y3, rgba) {
		rgba = utils.parseRGBA(rgba)
		gfxPrimitives.filledTrigonRGBA(this._render, +x1, +y1, +x2, +y2, +x3, +y3, rgba.r, rgba.g, rgba.b, rgba.a)
	}
	polygon(points, rgba) {
		if(!points || points.length < 3) {
			return
		}
		let size = ref.types.int16.size
		let vx = new Buffer(size * points.length)
		let vy = new Buffer(size * points.length)
		points.forEach((point, index) => {
			point = utils.arraylike2obj(point, 'x,y')
			vx.set(ref.alloc('int16', point.x), index * size)
			vy.set(ref.alloc('int16', point.y), index * size)
		})

		rgba = utils.parseRGBA(rgba)

		gfxPrimitives.aapolygonRGBA(this._render, vx, vy, points.length, rgba.r, rgba.g, rgba.b, rgba.a)
	}
	polygonFilled(points, rgba) {
		if(!points || points.length < 3) {
			return
		}
		let size = ref.types.int16.size
		let vx = new Buffer(size * points.length)
		let vy = new Buffer(size * points.length)
		points.forEach((point, index) => {
			point = utils.arraylike2obj(point, 'x,y')
			vx.set(ref.alloc('int16', point.x), index * size)
			vy.set(ref.alloc('int16', point.y), index * size)
		})

		rgba = utils.parseRGBA(rgba)

		gfxPrimitives.filledPolygonRGBA(this._render, vx, vy, points.length, rgba.r, rgba.g, rgba.b, rgba.a)
	}
	bezier(points, step, rgba) {
		if(!points || points.length < 3 || step < 2) {
			return
		}
		let size = ref.types.int16.size
		let vx = new Buffer(size * points.length)
		let vy = new Buffer(size * points.length)
		points.forEach((point, index) => {
			point = utils.arraylike2obj(point, 'x,y')
			vx.set(ref.alloc('int16', point.x), index * size)
			vy.set(ref.alloc('int16', point.y), index * size)
		})

		rgba = utils.parseRGBA(rgba)

		gfxPrimitives.bezierRGBA(this._render, vx, vy, points.length, step, rgba.r, rgba.g, rgba.b, rgba.a)
	}
}

class rotozoom {
	constructor(_surface) {
		this._surface = _surface
	}

	rotozoom(angle, zoomx, zoomy) {
		angle = +(angle || 0)
		zoomx = +(zoomx || 0)
		zoomy = +(zoomy || zoomx)
		gfxRotozoom.rotozoomSurfaceXY(this._surface, angle, zoomx, zoomy, 1)
	}
	zoom(zoomx, zoomy) {
		zoomx = +(zoomx || 0)
		zoomy = +(zoomy || zoomx)
		gfxRotozoom.zoomSurface(this._surface, zoomx, zoomy, 1)
	}
	shrink(factorx, factory) {
		factorx = +(factorx || 0)
		factory = +(factory || factorx)
		gfxRotozoom.shrinkSurface(this._surface, factorx, factory)
	}
	rotate90(turns) {
		turns = +(turns || 0)
		gfxRotozoom.rotateSurface90Degrees(this._surface, turns)
	}
}

module.exports = {
	primitives: primitives
}
