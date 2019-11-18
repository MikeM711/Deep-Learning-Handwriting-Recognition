import React, { Component } from "react";
import P5Wrapper from "react-p5-wrapper";
import axios from 'axios';
// import toBlob from 'canvas-toBlob';
import testImage from './testImage.png'

import "./Canvas.css";

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawing: [],
			submitted: false,
			prediction: ''
		};
		this.sketch = this.sketch.bind(this);
		this.fileUploadHandler = this.fileUploadHandler.bind(this)
	}

	// upload handler
	async fileUploadHandler(img) {
		console.log('inside fileuploadhandler')
		// console.log('hey we have the image', img)
		// var canvas = document.getElementById('defaultCanvas0');
		// var dataURL = canvas.toDataURL();
		console.log('testImage', testImage)
		
		var blob = new Blob([JSON.stringify(testImage, null, 2)], {type : 'application/json'});

		console.log('blob', blob)

		// console.log('[1]', testImage[1])
		const fd = new FormData()
		fd.append('image', blob, 'someName');

		var response = await axios.post('handwriting/', fd)
		// console.log('response: ', response, {
		// 	headers: {
		// 		'content-type': 'multipart/form-data'
		// 	}
		// })

		console.log('response: ', response)
		this.setState({
			prediction: response.data
		})
		// console.log('canvas id element', canvas)

		// this function makes things super slow...
		// actually now it's fast 90% of the time what...

		// canvas.toBlob(function (blob) {
		// 	saveAs(blob, "your-image.jpg");
		// 	console.log('sup', blob)
		// });

		// console.log('final canvas', canvas, typeof canvas)

		// img = img.toBlob()
		// const fd = new FormData();
		// // academind - "React Image Upload Made Easy" - report progress @ 6:50 in video
		// fd.append('image', img, 'the_name_the_file_has')
		// var response = await axios.post('handwriting/', fd)

		// console.log(response)

	}

	// sketch function
	sketch = p => {
		var canvas;
		var drawing = [];
		var currentPath = [];
		var isDrawing = false;
		p.setup = () => {
			canvas = p.createCanvas(200, 200);
			p.noStroke();
			canvas.mousePressed(p.startPath);
			canvas.mouseReleased(p.endPath);
		};

		p.startPath = () => {
			isDrawing = true;
			currentPath = [];
			drawing.push(currentPath);
		};

		p.endPath = () => {
			isDrawing = false;
		};

		p.draw = () => {
			p.background(0);

			if (isDrawing) {
				var point = {
					x: p.mouseX,
					y: p.mouseY
				};
				currentPath.push(point);
			}

			p.stroke(255);
			p.strokeWeight(8);
			p.noFill();
			for (var i = 0; i < drawing.length; i++) {
				var path = drawing[i];
				p.beginShape();
				for (var j = 0; j < path.length; j++) {
					p.vertex(path[j].x, path[j].y);
				}
				p.endShape();
			}

			if (this.state.submitted === true) {
				console.log("we are ready to export");
				this.setState({
					submitted: false
				});
				// console.log(canvas);
				const img = canvas.get();
				// img.save();
				// console.log(img)
				this.fileUploadHandler(img)
			}
		};
	};

	handleOnClick = e => {
		e.preventDefault();
		this.setState({
			submitted: true
		});
		// console.log("submitted picture to backend");
	};

	render() {
		return (
			<div className="canvas">
				<h4 className="center">canvas here</h4>
				<div className="p5-canvas">
					<P5Wrapper className="P5Wrapper" sketch={this.sketch} />
				</div>
				<button
					className="btn waves-effect waves-light"
					type="submit"
					name="action"
					onClick={this.handleOnClick}> Submit</button>
				<p>Canvas Response: {this.state.prediction}</p>
			</div>
		);
	}
}

export default Canvas;
