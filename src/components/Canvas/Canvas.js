import React, { Component } from 'react';
import sketch from './sketch';
// import SketchClass from './sketchClass'
import P5Wrapper from 'react-p5-wrapper';

import './Canvas.css';

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawing: [],
			stateSketch: sketch,
			isDrawing: false
		};
	}

	onMouseDownHandle = (event) => {
		this.setState({
			isDrawing: true
		})
		console.log('mouse down', event)
		console.log(event.pageX)
	}

	onMouseUpHandle = (event) => {
		this.setState({
			isDrawing: false
		})
	}

	onMouseMoveHandle = (event) => {
		if(this.state.isDrawing === true) {
			console.log('X:', event.pageX)
			console.log('Y:', event.pageY)
		}
	}

	render() {
		return (
			<div className="canvas">
				<h4 className="center">canvas mine here</h4>
					<br/>
					<br/>
					<br/>
					<br/>
				<div className="p5-canvas"
					onMouseDown = {this.onMouseDownHandle}
					onMouseMove = {this.onMouseMoveHandle}
					onMouseUp = {this.onMouseUpHandle}
					>

					<P5Wrapper className="P5Wrapper"
						sketch={this.state.stateSketch} 
						drawing={this.state.drawing} 
					/>

				</div>
				
			</div>
		)
	}
}

export default Canvas