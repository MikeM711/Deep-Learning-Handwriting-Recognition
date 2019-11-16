import React, { Component } from 'react';
import axios from 'axios'

import './Header.css';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			postreq: '',
			postres: ''
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async handleSubmit(e) {
		// send information to the backend
		e.preventDefault()
		console.log(this.state.postreq, "sent to the backend!")
		// From: http://127.0.0.1:8000/handwriting/test/'
		var response = await axios.post('handwriting/', {
			react_data: this.state.postreq
		})
		// console.log(response)
		this.setState({
			postres: response.data
		})
	}
	
	handleInputChange = e => {
		this.setState({
			postreq: e.target.value
		})
	}


	render() {
		return (
			<div className="header">
				<h4 className="center">Hello world from header component!</h4>
				<div className="postrequest">
					<div className="row">
						<div className="input-field col s6">
							<form className="col s12">
								<input id="last_name" type="text" className="validate" onChange={this.handleInputChange} />
								<label htmlFor="last_name"></label>
							</form>
							<button className="waves-effect waves-light btn" onClick={this.handleSubmit}>button</button>
						</div>
					</div>
					<h4>Resonse: {this.state.postres}</h4>
				</div>

			</div>
		)
	}
}

export default Header