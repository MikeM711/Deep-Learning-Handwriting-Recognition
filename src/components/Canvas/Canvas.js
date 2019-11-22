import React, { Component } from "react";
import P5Wrapper from "react-p5-wrapper";
import axios from "axios";
// import testImage from './testImage.png'

import "./Canvas.css";

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawing: [],
			submitted: false,
			prediction: ""
		};
		this.sketch = this.sketch.bind(this);
		this.fileUploadHandler = this.fileUploadHandler.bind(this);
	}

	// upload handler
	async fileUploadHandler(img) {
		function dataURItoBlob(dataURI) {
			// convert base64/URLEncoded data component to raw binary data held in a string
			var byteString;
			if (dataURI.split(",")[0].indexOf("base64") >= 0)
				byteString = atob(dataURI.split(",")[1]);
			else byteString = unescape(dataURI.split(",")[1]);
			// separate out the mime component
			var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
			// write the bytes of the string to a typed array
			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			return new Blob([ia], { type: mimeString });
		}

		// Get canvas from html
		var canvasInput = document.getElementById("defaultCanvas0");

		// Convert canvas image to Base64
		var canvasImg = canvasInput.toDataURL();

		// Convert the Base64 image to binary
		var file = dataURItoBlob(canvasImg);
		console.log("file: ", file);

		const fd = new FormData();
		fd.append("image", file, "someName");

		var response = await axios.post("handwriting/", fd, {
			headers: {
				"content-type": "multipart/form-data"
			}
		});

		this.setState({
			prediction: response.data
		});
	}

	// sketch function
	sketch = p => {
		var canvas;
		var drawings = [];
		var currentPath = [];
		var isDrawing = false;
		p.setup = () => {
			canvas = p.createCanvas(200, 150);
			p.noStroke();
			canvas.mousePressed(p.startPath);
			canvas.mouseReleased(p.endPath);
		};

		p.startPath = () => {
			isDrawing = true;
			currentPath = [];
			drawings.push(currentPath);
		};

		p.endPath = () => {
			isDrawing = false;
		};

		p.draw = () => {
			var px = p.mouseX;
			var py = p.mouseY;
			p.background(0);

			if (isDrawing) {
				let point = {
					x1: px,
					y1: py,
					x2: p.mouseX,
					y2: p.mouseY
				};
				currentPath.push(point);
				px = p.mouseX;
				py = p.mouseY;
			}

			//Shows the current drawing if there any data in drawing array
			for (let i = 0; i < drawings.length; i++) {
				let path = drawings[i];
				if (drawings[i].length != 0) {
					// p.beginShape();
					for (let j = 0; j < path.length; j++) {
						p.strokeWeight(20);
						p.stroke(255);
						p.line(path[j].x1, path[j].y1, path[j].x2, path[j].y2);
						// p.vertex(path[j].x2, path[j].y2);
					}
					// p.endShape();
				}
			}

			if (this.state.submitted === true) {
				console.log("we are ready to export");
				this.setState({
					submitted: false
				});
				const img = canvas.get();
				// img.save();
				// console.log(img)
				this.fileUploadHandler(img);
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
				<h4 className="center">Draw a number!</h4>
				<div className="p5-canvas">
					<P5Wrapper className="P5Wrapper" sketch={this.sketch} />
				</div>
				<button
					className="btn waves-effect waves-light"
					type="submit"
					name="action"
					onClick={this.handleOnClick}
				>Submit</button>
				<h5>Prediction: {this.state.prediction}</h5>
			</div>
		);
	}
}

export default Canvas;
