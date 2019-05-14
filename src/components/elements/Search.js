import React from 'react';
import './search.css'
import search from '../../public/images/search.png'
class Search extends React.Component {
	onSerchSubmit(type,event){
        const ele =  document.getElementById("serchInput");
        const txt = ele.value;
        console.log(txt)
        if(txt === "") return;
        console.log(event.keyCode)
        let transfer = false;
        if(event.keyCode === 13 || type==="button") transfer = true;
        if(transfer)  {
            ele.value = "";
            const reg_height = /^[0-9]*$/;
            reg_height.test(txt) && (window.location.href = "/block_detail/"+txt);
            txt.length === 64 && (window.location.href = "/transaction_detail/"+txt);
            txt.length === 34 && (window.location.href = "/did_detail/"+txt);
            /:/.test(txt) && txt.indexOf(":") === 34 && this.search_did_property(event,txt);
        }
       
    }
    search_did_property(event,txt) {
        const did = txt.substring(0,txt.indexOf(":"));
        const property = txt.substring(txt.indexOf(":") + 1);
        event.keyCode === 13 && (window.location.href = "/did/"+did+"/property_history/"+property);
    }
    render() {
    	const isButton = this.props.button == "true" ? true :false;
    	return (
    		<div className="search">
                <div className="floatLeft"><img className = {"search_"+this.props.name} src={search}/></div>
                <input id="serchInput"className={"input_search input_"+this.props.name} type="text" placeholder="Search DID, Transaction, Block, DID Property" onKeyDown = {this.onSerchSubmit.bind(this,"text")}/>
                {isButton && <input className="input_button" type="button" value="SEARCH" onClick = {this.onSerchSubmit.bind(this,"button")} />}
            </div>
    	)
    }
}

export default Search;