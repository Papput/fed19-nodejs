import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class CafeeIndex extends React.Component {

	state = {
		cafees: [],
	}

	componentDidMount() {
		axios.get('http://localhost:3000/api/cafees')
		.then(response => {
			this.setState({
				cafees: response.data,
			});
		})
		.catch(err => {
			console.error("Error when fetching all cafees.", err);
		});
	}

	render() {
		return (
			<div id="cafee-index">
				<h1>Alla caféer</h1>

				<ul>
					{this.state.cafees.map((cafee, index) =>
						(<li className="" key={index}>
							<a className="" href="/">{cafee.name} ({cafee.id})</a>
						</li>)
					)}
				</ul>
			</div>
		)
	}
}

export default CafeeIndex;
