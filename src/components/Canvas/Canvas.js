import React, { Component } from "react";
import P5Wrapper from "react-p5-wrapper";

import "./Canvas.css";

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawing: [],
			submitted: false
		};
		this.sketch = this.sketch.bind(this);
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
				console.log(canvas);
				const img = canvas.get();
				img.save();
			}
		};
	};

	handleOnClick = e => {
		e.preventDefault();
		this.setState({
			submitted: true
		});
		console.log("submitted picture to backend");
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
					onClick={this.handleOnClick}
				>
					Submit
        </button>
			</div>
		);
	}
}

export default Canvas;
