import React, { Component } from "react";
import P5Wrapper from "react-p5-wrapper";
import axios from "axios";

// import testImage from './testImage.png'
import plusCircle from '../../images/plus_circle.svg'
import minusCircle from '../../images/minus_circle.svg'
import trashIcon from '../../images/trash_icon.svg'
import undoIcon from '../../images/undo_icon.svg'

import "./Canvas.css";

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawing: [],
			submitted: false,
			prediction: "",
			canvasLength: localStorage.getItem('width') || 300,
			minLength: 300,
			maxLength: 2000,
			drawings: [],
			predictionProgress: '',
			predBtnCountdown: 0
		};
		this.sketch = this.sketch.bind(this);
		this.fileUploadHandler = this.fileUploadHandler.bind(this);
	}

	// upload handler
	async fileUploadHandler(img) {

		this.setState({
			predictionProgress: 'Your handwriting is being predicted, please wait...',
		})

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
		fd.append("image", file);

		var response = await axios.post("handwriting/", fd, {
			headers: {
				"content-type": "multipart/form-data"
			}
		});

		this.setState({
			prediction: response.data,
			predictionProgress: '',
		});

		const secCountdown = function () {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve()
				}, 1000)
			})
		}

		async function init() {
			try {
				await secCountdown()
			}
			catch (err) {
				console.log('error: ', err)
			}
		}

		let time = 5

		this.setState({
			predBtnCountdown: time
		})

		do {
			await init()
			time--
			this.setState({
				predBtnCountdown: time
			})
			
		} while(time > 0)
		
	}

	// sketch function
	sketch = p => {
		var canvas;
		var drawings = this.state.drawings;

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
			// Dev note: If there are touch problems (ie: tablets that are larger than expected - can't write with them), we can use a different callback for touchStarted and mousePressed instead of the same callback and figuring what device is being used based on window size - but instead, figure out if it were "touched" or "mouse pressed" by the functions provided below
			canvas = p.createCanvas(this.state.canvasLength, 200);
			p.noStroke();
			canvas.mousePressed(p.startPath);
			canvas.touchStarted(p.startPath)
			canvas.mouseReleased(p.endPath);
			canvas.touchEnded(p.endPath)
		};

		p.startPath = () => {
			isDrawing = true;
			currentPath = [];
			drawings.push(currentPath);
			this.setState({
				drawings: drawings
			})

			// Get canvas from html
			var canvasHTML = document.getElementById("defaultCanvas0");

			// Prevent scrolling when touching the canvas
			document.body.addEventListener("touchstart", function (e) {
				if (e.target === canvasHTML) {
					console.log('inside touchstart')
					e.preventDefault();
				}
			}, { passive: false });
			document.body.addEventListener("touchend", function (e) {
				if (e.target === canvasHTML) {
					// console.log('inside touched') // may delete this and touchmove
					e.preventDefault();
				}
			}, { passive: false });
			document.body.addEventListener("touchmove", function (e) {
				if (e.target === canvasHTML) {
					e.preventDefault();
				}
			}, { passive: false });

		};

		p.endPath = () => {
			isDrawing = false;
		};

		p.draw = () => {
			// Dev note: P5 does not use touchX or touchY - they use mouse coordinates
			var px = p.mouseX
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
			}
			// re-define drawings to be the state
			drawings = this.state.drawings
			//Shows the current drawing if there any data in drawing array
			for (let i = 0; i < drawings.length; i++) {
				let path = drawings[i];
				if (drawings[i].length !== 0) {
					p.beginShape();
					for (let j = 0; j < path.length; j++) {
						// p.strokeWeight(20);
						p.strokeWeight(15)
						p.stroke(255);
						p.noFill()

						if (window.innerWidth <= 760) {
							// for mobile
							p.vertex(path[j].x2, path[j].y2);
						} else {
							// for desktop
							p.line(path[j].x1, path[j].y1, path[j].x2, path[j].y2);
						}
					}
					p.endShape();
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
		if (e.target.value !== '') {
			localStorage.setItem('drawings', JSON.stringify(this.state.drawings))
			const valuePX = e.target.value
			const width = Number(valuePX.slice(0, valuePX.length - 2))
			console.log(width)

			localStorage.setItem('width', width);
			console.log('canvasLength', this.state.canvasLength)
			window.location.reload();
		}
	}

	handleSubmitPrediction = e => {
		e.preventDefault();
		this.setState({
			submitted: true
		});
	};

	handleOnClickDelete = e => {
		this.setState({
			drawings: [],
			prediction: ''
		})
	}

	handleOnClickUndo = e => {
		let drawings = this.state.drawings
		drawings = drawings.slice(0, drawings.length - 1)
		this.setState({
			drawings: drawings,
		})
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

		const disablePredBtn = this.state.predictionProgress === '' 
			&& this.state.predBtnCountdown === 0 ? false : true

		const predCountdown = this.state.predBtnCountdown === 0 ? '' : `: ${this.state.predBtnCountdown}`

		return (
			<div className="canvas">
				<div className="toolbar">
					<img className="trashIcon"
						src={trashIcon}
						alt=""
						onClick={this.handleOnClickDelete}>
					</img>

					<img className="undoIcon"
						src={undoIcon}
						alt=""
						onClick={this.handleOnClickUndo}>
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
				</div>

				<div className="p5-canvas">
					<P5Wrapper className="P5Wrapper" sketch={this.sketch} />
				</div>

				<button
					className="btn waves-effect waves-light blue darken-1 submit-prediction"
					type="submit"
					name="action"
					onClick={this.handleSubmitPrediction}
					disabled={disablePredBtn}
				>Predict{predCountdown}</button>

				{this.state.predictionProgress ? (
					<div className="waiting-for-prediction">
						<h5>{this.state.predictionProgress}</h5>
						<div className="progress">
							<div className="indeterminate blue darken-1"></div>
						</div>
					</div>
				) : (
						<h5 className="prediction-result">Prediction: {this.state.prediction}</h5>
					)}
			</div>
		);
	}
}

export default Canvas;
