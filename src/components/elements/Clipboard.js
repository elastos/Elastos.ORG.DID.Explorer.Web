import React from 'react';
import ClipboardJS from 'clipboard';
class Clipboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            status : null
        }
    }
	componentDidMount (){
        const self = this;
        const clipboard = new ClipboardJS('.btn');
        clipboard.on('success', function(e) {
            self.setState({
                status:"success"
            })
            setTimeout(function(){
                self.setState({
                    status:null
                })     
            },1000)
            e.clearSelection();
        });
        clipboard.on('error', function(e) {
            self.setState({
                status:"error"
            })
        });
    }
    render() {
    	const eleId = this.props.eleId;
    	const icon = this.props.icon;
    	const style = this.props.style;
        const status = this.state.status;
        const lang = this.props.lang;
        return (
            <div style={{"display":"inline-block"}} className="clipboard">
                <img className="btn" data-clipboard-target={"#"+eleId} src={icon} title = "copy" style = {style} alt="Copy to clipboard"/>
                {status === "success" && <span style={{"fontSize":"12px","color":"#00cc99","marginLeft":"5px"}}>{lang.copy_success} ！</span>}
                {status === "error" && <span style={{"fontSize":"12px","color":"#cc0099","marginLeft":"5px"}}>{lang.copy_failed} ！</span>}
            </div>
        );
    }
}

export default Clipboard;