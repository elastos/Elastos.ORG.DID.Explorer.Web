import React from 'react';
class NoPage extends React.Component {
	
    render() {
    	const lang = this.props.lang
    	return (
    		<div style={{"fontSize":"40px","marginTop":"100px","textAlign":"center"}}>
				404
			</div>
    	)
    }
}

export default NoPage;