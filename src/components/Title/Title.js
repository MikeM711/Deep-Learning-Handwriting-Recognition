import React, { Component } from 'react';

import './Title.css';
import gitIcon from '../../images/github-icon.png'

class Title extends Component {
	constructor(props) {
		super(props);
		this.state = {
			postreq: '',
			postres: ''
		}
	}

	render() {
		return (
			<div className="title">
				<div className="main-title card-panel blue lighten-5 center">
					<h3 className="center"><b>Deep Learning Handwriting Recognition</b></h3>
					<h5 className="center">A handwriting recognition web application, using custom-trained machine learning models</h5>
					<div className="github-repo center">
						<img src={gitIcon} alt="" />
						<a className="github-link" href="https://github.com/MikeM711/Deep-Learning-Handwriting-Recognition"
						target="_blank" rel="noopener noreferrer">GitHub Repo</a>
					</div>
				</div>
				<div className="title-sub">
					
				</div>
			</div>
		)
	}
}

export default Title