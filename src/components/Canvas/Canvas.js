import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';

import './Canvas.css';

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawing: [],
		};
		this.sketch = this.sketch.bind(this);
	}

	// sketch function
	sketch = (p) => {
		let canvas;
		let drawing = [];
		p.setup = () => {
			canvas = p.createCanvas(200, 200);
			p.noStroke();
		}

		p.draw = () => {
			p.background(0);

			if (p.mouseIsPressed) {
				var point = {
					x: p.mouseX,
					y: p.mouseY
				}
				drawing.push(point)
			}

			p.beginShape();
			p.stroke(255);
			p.strokeWeight(4);
			p.noFill();
			for (var i = 0; i < drawing.length; i++) {
				p.vertex(drawing[i].x, drawing[i].y)
			}
			p.endShape();
		}
	}

	render() {
		return (
			<div className="canvas">
				<h4 className="center">canvas here</h4>
				<div className="p5-canvas">
					<P5Wrapper className="P5Wrapper"
						sketch={this.sketch}/>
				</div>
			</div>
		)
	}
}

export default Canvas