import React, { Component } from 'react';

import './Header.css';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			postreq: '',
			postres: ''
		}
	}

	render() {
		return (
			<div className="header">
				{/* <h4 className="center">Handwriting recognition using a deep learning neural network</h4> */}
			</div>
		)
	}
}

export default Header