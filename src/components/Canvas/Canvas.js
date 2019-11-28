import React, { Component } from "react";
import P5Wrapper from "react-p5-wrapper";
import axios from "axios";

// import testImage from './testImage.png'
import plusCircle from '../../images/plus_circle.svg'
import minusCircle from '../../images/minus_circle.svg'
import trashIcon from '../../images/trash_icon.svg'

import "./Canvas.css";

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawing: [],
			submitted: false,
			prediction: "",
			canvasLength: localStorage.getItem('width') || 400,
			minLength: 400,
			maxLength: 2000,
			drawings: []
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
		var drawings = this.state.drawings;

		// localStorage.setItem('drawings', [])
		var drawingStorage = localStorage.getItem('drawings')
		if (drawingStorage !== null && drawingStorage.length !== 0) {
			drawingStorage = JSON.parse(localStorage.getItem('drawings'))
			// debugger;
			for (let i = 0; i < drawingStorage.length; i++) {
				drawings.push(drawingStorage[i])
			}
		}

		var currentPath = [];
		var isDrawing = false;
		p.setup = () => {
			canvas = p.createCanvas(this.state.canvasLength, 200);
			p.noStroke();
			canvas.mousePressed(p.startPath);
			canvas.touchStarted(p.startTouchPath)
			canvas.mouseReleased(p.endPath);
		};

		p.startPath = () => {
			console.log('regular mouse started')
			isDrawing = true;
			currentPath = [];
			drawings.push(currentPath);
			this.setState({
				drawings: drawings
			})
		};

		p.startTouchPath = () => {
			console.log('touch started')

			// Get canvas from html
			var canvasHTML = document.getElementById("defaultCanvas0");

			// Prevent scrolling when touching the canvas
			document.body.addEventListener("touchstart", function (e) {
				if (e.target == canvasHTML) {
					console.log('inside touchstart')
					e.preventDefault();
				}
			}, {passive: false});
			document.body.addEventListener("touchend", function (e) {
				if (e.target == canvasHTML) {
					// console.log('inside touched') // may delete this and touchmove
					e.preventDefault();
				}
			}, {passive: false});
			document.body.addEventListener("touchmove", function (e) {
				if (e.target == canvasHTML) {
					e.preventDefault();
				}
			}, {passive: false});


			isDrawing = true;
			currentPath = [];
			drawings.push(currentPath);
			this.setState({
				drawings: drawings
			})
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
				if (drawings[i].length !== 0) {
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

	handleSizeChange = e => {
		localStorage.setItem('drawings', JSON.stringify(this.state.drawings))
		// debugger;
		const valuePX = e.target.value
		const width = Number(valuePX.slice(0, valuePX.length - 2))
		console.log(width)

		localStorage.setItem('width', width);
		console.log('canvasLength', this.state.canvasLength)
		window.location.reload();
	}

	handleSubmitPrediction = e => {
		e.preventDefault();
		this.setState({
			submitted: true
		});
		// console.log("submitted picture to backend");
	};

	handleOnClickDelete = e => {
		// e.preventDefault();
		localStorage.setItem('drawings', [])
		this.setState({
			drawings: []
		})
		window.location.reload();
	}

	handleOnClickAddSize = e => {
		localStorage.setItem('drawings', JSON.stringify(this.state.drawings))
		console.log('add on size')
		if ((Number(this.state.canvasLength) + 100) <= this.state.maxLength) {
			localStorage.setItem('width', Number(this.state.canvasLength) + 100)
			// console.log(this.state.canvasLength)
			window.location.reload();
		}
	}

	handleOnClickSubtractSize = e => {
		localStorage.setItem('drawings', JSON.stringify(this.state.drawings))
		console.log('subtract size')
		if ((Number(this.state.canvasLength) - 100) >= this.state.minLength) {
			localStorage.setItem('width', Number(this.state.canvasLength) - 100)
			// console.log(this.state.canvasLength)
			window.location.reload();
		}
	}

	render() {

		let canvasSizes = []
		const { minLength, maxLength } = this.state
		for (let i = minLength; i <= maxLength; i += 100) {
			canvasSizes.push(`${i}px`)
		}

		const sizeList = canvasSizes.map(size => {
			return (
				<option className="canvas-size-dropdown-options"
					value={size}
					key={size}>
					{size}</option>
			);
		});

		const defaultSize = `${this.state.canvasLength}px`

		return (
			<div className="canvas">
				<h4 className="">Draw something!</h4>

				<img className="trashIcon"
					src={trashIcon}
					alt=""
					onClick={this.handleOnClickDelete}>
				</img>
				<img className="plusCircle"
					src={plusCircle}
					alt=""
					onClick={this.handleOnClickAddSize}>
				</img>
				<img className="minusCircle"
					src={minusCircle}
					alt=""
					onClick={this.handleOnClickSubtractSize}>
				</img>
				<select className="browser-default size-dropdown-menu"
					onChange={this.handleSizeChange} defaultValue={defaultSize}>
					<option value=''>-- Choose A Canvas Width --</option>
					{sizeList}
				</select>


				<div className="p5-canvas">
					<P5Wrapper className="P5Wrapper" sketch={this.sketch} />
				</div>
				<button
					className="btn waves-effect waves-light"
					type="submit"
					name="action"
					onClick={this.handleSubmitPrediction}
				>Submit</button>
				<h5>Prediction: {this.state.prediction}</h5>
			</div>
		);
	}
}

export default Canvas;
