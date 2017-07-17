import React, { Component } from 'react';
import { connect } from 'react-redux';
import { togglePlay, changeBpm, togglePad } from '../actions';
import Pads from '../components/Pads';
import Controls from '../components/Controls';
import '../App.css';

class App extends Component {
	constructor() {
		super();
		this.audioCx = new (window.AudioContext || window.webkitAudioContext)();
		this.gain = this.audioCx.createGain();
		this.gain.connect(this.audioCx.destination);
		this.gain.gain.value = 1;
		this.frequencies = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392];
		this.state = {
			pos: 0
		}
		this.togglePlaying = this.togglePlaying.bind(this);
		this.changeBpm = this.changeBpm.bind(this);
	}
	togglePlaying(playing) {
		if (playing) {
			clearInterval(this.timerId);
		} else {
			this.setTimer();
		}
	}
	tick() {
		let pos = this.state.pos;
		pos++;
		if (pos > 7) {
			pos = 0;
		}
		this.setState({ pos: pos });
		this.checkPad();
	}
	checkPad() {
		this.props.pads.forEach((row, rowIndex) => {
			row.forEach((pad, index) => {
				if (index === this.state.pos && pad === 1) {
					this.playSound(rowIndex);
				};
			})
		});
	}
	playSound(rowIndex) {
		let freq = this.frequencies[rowIndex];
		let node = this.audioCx.createOscillator();
		let currentTime = this.audioCx.currentTime;
		node.frequency.value = freq;
		node.detune.value = 0;
		node.type = 'sine';
		node.connect(this.gain);
		node.start(currentTime);
		node.stop(currentTime + 0.2);
	}
	calculateTempo(bpm) {
		return 60000 / bpm;
	}
	changeBpm(bpm) {
		if (this.props.playing) {
			clearInterval(this.timerId);
			this.setTimer();
		}
	}
	setTimer() {
		this.timerId = setInterval(() => this.tick(), this.calculateTempo(this.props.bpm));
	}
	componentWillReceiveProps(nextProps, prevProps) {
		if (nextProps.playing !== this.props.playing) {
			this.togglePlaying(this.props.playing);
		}
		if (nextProps.bpm !== this.props.bpm) {
			this.changeBpm(nextProps.bpm);
		}
	}
	render() {
		return (
		    <div className="App">
		        <Controls 
		        	bpm={this.props.bpm} 
		        	handleChange={this.props.changeBpm} 
		        	playing={this.props.playing} 
		        	togglePlaying={this.props.togglePlaying} />
		        <Pads 
		        	pos={this.state.pos} 
		        	pads={this.props.pads} 
		        	toggleActive={this.props.togglePad} />
		        <p className="link">
		        	<a href="https://github.com/unlikenesses/react-sequencer-redux">View the code on GitHub</a>
		        </p>
		    </div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		playing: state.controls.playing,
		bpm: state.controls.bpm,
		pads: state.main.pads
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		togglePlaying: () => {
			dispatch(togglePlay());
		},
		changeBpm: (bpm) => {
			dispatch(changeBpm(bpm));
		},
		togglePad: (row, col) => {
			dispatch(togglePad(row, col));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);