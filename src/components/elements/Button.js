import React from 'react';
import './Button.css'
class Button extends React.Component {
    render() {
        return (
                <div  className="button" onClick = {this.props.onClick} >menu</div>
        );
    }
}

export default Button;