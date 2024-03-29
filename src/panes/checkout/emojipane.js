const emojipane = v = new vp.View();
v.name = Object.keys({'emojipane':0}).pop();
v.designSize = 640*400;
v.minX = 0; v.maxX = 0;
v.minY = 0; v.maxY = 0;
v.gadgets.push(v.swipeGad = new vp.SwipeGadget(v));
v.swipeGad.actionFlags = vp.GAF_SWIPEABLE_UPDOWN | vp.GAF_SCROLLABLE_UPDOWN;
v.gadgets.push(v.gridGad = g = new vp.Gadget(v));
	g.actionFlags = vp.GAF_CLICKABLE;
	g.x = 0; g.y = 0;
	g.clickFunc = function(e) {
		const g = this, v = g.viewport;
		let i = Math.floor((e.x+v.userX*v.viewScale)/v.w*v.gridX);
		let j = Math.floor((e.y+v.userY*v.viewScale)/v.w*v.gridX);
		if (i+j*v.gridX < emojiData.length) {
			vp.popRoot();
			if (this.viewport.callback) this.viewport.callback.call(undefined, emojiData[i+j*v.gridX].label);
		}
	}
v.layoutFunc = function() {
	const v = this;

	let w = Math.round(Math.sqrt(100 * v.sw / v.sh));
	if (w != v.lastBuilt) {
		v.lastBuilt = w;
		let i=0, j=0, x=w, y=0;
		let data = [];
		const nx = 57, ny = 57;
		let category = '';
		for (let e of emojiData) {
//			if (category != '' && e.category != category && i>0) {
//				i=0; j++;
//				data.splice(data.length,0, data[data.length-4],data[data.length-3],data[data.length-2],data[data.length-1], );
//				data.splice(data.length,0, i,j+1,e.x/nx,(e.y+1)/ny, );
//			}
			let u = e.x+1, v = e.y+1;
			data.splice(data.length,0, i,j+1,e.x/nx,v/ny, i,j,e.x/nx,e.y/ny, );
			data.splice(data.length,0, i+1,j+1,u/nx,v/ny, i+1,j,u/nx,e.y/ny, );
			y = j+1;
			i++; if (i>=w) {
				i=0; j++;
//				data.splice(data.length,0, data[data.length-4],data[data.length-3],data[data.length-2],data[data.length-1], );
				data.splice(data.length,0, data[data.length-4],data[data.length-3],data[data.length-2],data[data.length-1], i,j+1,e.x/nx,(e.y+1)/ny, );
//				data.splice(data.length,0, i,j+1,e.x/nx,(e.y+1)/ny, i,j,e.x/nx,e.y/ny, );
			}
			category = e.category;
		}
		this.gridX = x;
		this.gridY = y;
		emojiPoints = data;
		buildShapes();
	}
	v.maxX = v.sw;
	v.maxY = this.gridY * v.sw/v.gridX;
	if (v.swipeGad) v.swipeGad.layout.call(v.swipeGad);

	let g = v.gridGad;
	g.w = v.sw; g.h = v.maxY;
	g.autoHull();
}
v.renderFunc = function() {
	drawThemeBackdrop(this, config.themeColors);
	const v = this;
	const m = mat4.create();

/*
	if (0) {
		mat4.identity(m);
		mat4.translate(m,m, [0, 0, 0]);
		mat4.scale(m,m, [50, 50, 1]);
		useProg4();
		gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uProjectionMatrix'), false, v.mat);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uModelViewMatrix'), false, m);
		gl.uniform4fv(gl.getUniformLocation(prog4, 'overallColor'),
			new Float32Array([1,1,1,1]));
	  gl.bindTexture(gl.TEXTURE_2D, emojiTex);
//		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.drawArrays(typ4.tomato, beg4.tomato, len4.tomato);
	}
*/

	{
		mat4.identity(m);
		mat4.translate(m,m, [0, 0, 0]);
		mat4.scale(m,m, [v.sw/v.gridX, v.sw/v.gridX, 1]);
		useProg4();
		gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uProjectionMatrix'), false, v.mat);
		gl.uniformMatrix4fv(gl.getUniformLocation(prog4, 'uModelViewMatrix'), false, m);
		gl.uniform4fv(gl.getUniformLocation(prog4, 'overallColor'),
			new Float32Array([1,1,1,1]));
	  gl.bindTexture(gl.TEXTURE_2D, emojiTex);
//		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.drawArrays(typ4.emojis, beg4.emojis, len4.emojis);
	}

};
