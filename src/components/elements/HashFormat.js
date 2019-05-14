import React from 'react';

class HashFormat extends React.Component {
	
    render() {
    	const text = this.props.text;
    	const width = this.props.width; 
    	return (
    		<span alt = {text} title = {text}  style={{"width": width}}>{text.substr(0,7) + "..." + text.substr(-7,7)}</span>
    	)
    }
}
export default HashFormat;