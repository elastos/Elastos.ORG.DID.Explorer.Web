import React from 'react';
import './Header.css';
import Button from './elements/Button';
import {Link} from 'react-router-dom';
import { Input } from 'antd';
import logoimg from '../public/images/logo.png';
import { getHeight } from '../request/request';
import { Icon } from 'antd';
class About extends React.Component {
	constructor(props){
        super(props);
        const width = document.body.clientWidth;
        const showMenu = (width > 760) ? true : false;
        this.state={
        	height:"...",
            showMenu:showMenu,
            showLangMenu:"none",
            iconType:"caret-down"
        }
        this.onKeyDown = this.onKeyDown.bind(this);
        this.search_block = this.search_block.bind(this);
        this.search_txid = this.search_txid.bind(this);
        this.search_did = this.search_did.bind(this);
        this.search_did_property = this.search_did_property.bind(this);
        this.onClick = this.onClick.bind(this);
        this.changeLang = this.changeLang.bind(this);
        this.showLanguage = this.showLanguage.bind(this);
        this.hideLanguage = this.hideLanguage.bind(this);
        
    }
    componentWillMount (){
        getHeight().then((data)=>{
        	this.setState({
        		height : data[0].height
        	})
        })
    }
    onKeyDown(event){
		const txt = event.target.value;
		if(txt === "") return;
        if(event.keyCode === 13)  event.target.value = "";
    	const reg_height = /^[0-9]*$/;
    	reg_height.test(txt) && this.search_block(event,txt);
    	txt.length === 64 && this.search_txid(event,txt);
    	txt.length === 34 && this.search_did(event,txt);
    	/:/.test(txt) && txt.indexOf(":") === 34 && this.search_did_property(event,txt);
        
         
    }
    search_block(event,txt) {
  		//event.keyCode == "13" && this.setState({redirect: true,path:"/height/"+txt}) ;
  		event.keyCode === 13 && (window.location.href = "/#/height/"+txt);
  		
    }
    search_txid(event,txt) {
    	event.keyCode === 13 && (window.location.href = "/#/txinfo/"+txt);
    }
    search_did(event,txt) {
    	event.keyCode === 13 && (window.location.href = "/#/properties_list/"+txt);

    }
    search_did_property(event,txt) {
    	const did = txt.substring(0,txt.indexOf(":"));
    	const property = txt.substring(txt.indexOf(":") + 1);
    	event.keyCode === 13 && (window.location.href = "/#/did/"+did+"/property_history/"+property);
    }
    onClick (){
         const width = document.body.clientWidth;
         if(width < 760){
            let status = this.state.showMenu;
            status = status ? false : true;
            this.setState({showMenu:status});
        }
    }
    showLanguage(e){
        this.setState({showLangMenu:"block",iconType:"caret-up"});
    }
    hideLanguage(e){
       
        this.setState({showLangMenu:"none",iconType:"caret-down"});
    }
    changeLang(event){
        localStorage.setItem("lang",event.target.type);
        this.props.onChange("change_language",event.target.type);
        this.setState({showLangMenu:"none",iconType:"caret-down"});
        this.onClick ();
        var div = document.getElementsByClassName("ant-pagination-options-quick-jumper");
        if (event.target.type === "en" && typeof div[0] != "undefined") {
            div[0].childNodes[0].data = "Goto" 
        }
        if(event.target.type === "cn" && typeof div[0] != "undefined"){
            div[0].childNodes[0].data = "跳转" 
        }
    }
    render() {
    	const { showMenu, showLangMenu, iconType} = this.state;
        const {lang} = this.props.info;
    	return (
    		<div className = "navbar">
    			<div className = "nav_container">
    				<div className="navbarHeader">
                        <Button onClick = {this.onClick}/>
			            <Link className = "navbarBrand" to="/">
			            <img src = {logoimg} alt="logo"/>
			            <span>{lang.DID_BlockChain_Explorer}</span>
			            </Link>
			        </div>
			         <div className = "navbarCollapse">
			        	{showMenu &&<ul className="navbarNav">
			        		<li className="navScope" onClick={this.onClick}>
			                    <Link to={'/blocks'}> {lang.block}</Link>
			                </li>
			                <li className="navScope" onClick={this.onClick}>
			                    <Link to={'/list'}> {lang.transactions}</Link>
			                </li>		         
			            </ul> }
			            <div className="navbarHeight">
				           {lang.block_height}：{this.state.height}
						</div>
                        {showMenu &&
                        <div className="navbarMenu">
                            <div className="navbarLang" onMouseOver={this.showLanguage} onMouseOut = {this.hideLanguage}>
                                <span>Language</span> 
                                <ul style={{"display":showLangMenu}}>
                                   <li onClick={this.changeLang} type="en">English</li>
                                   <li onClick={this.changeLang} type="cn">中文</li>
                                </ul>
                            </div>
                            <Icon type={iconType} />
                        </div>}
                        
			            <div className="navbarRight">
						   <Input placeholder={lang.searchPlaceholder} onKeyDown = {this.onKeyDown}/>
						</div>
			        </div>
                   
    			</div>
    		</div>
    	)
    }
}

export default About;