import React from 'react';
import {Link} from 'react-router-dom';
import './header.css';
import logo from '../public/images/logo.png';
import iconDown from '../public/images/icon-down.png';
import iconUp from '../public/images/icon-up.png';
import lang_cn from '../public/images/lang_cn.svg';
import lang_en from '../public/images/lang_en.svg';
class Header extends React.Component {
	constructor(props){
        super(props);
        const lang = localStorage.getItem("lang");
        this.state={
            showLangMenu:"none",
            iconType:iconDown,
            lang_img:(lang === "cn") ? lang_cn : lang_en
        }
        this.showLanguage = this.showLanguage.bind(this);
        this.hideLanguage = this.hideLanguage.bind(this);
    }
    showLanguage(){
        this.setState({showLangMenu:"block",iconType:iconUp});
    }
    hideLanguage(){
        this.setState({showLangMenu:"none",iconType:iconDown});
    }
    changeLang(type){
    	console.log("changeLang")
    	console.log(type)
        localStorage.setItem("lang",type);
        this.props.onChange("change_language",type);
        this.setState({showLangMenu:"none",iconType:iconDown,lang_img:( type==="en" ? lang_en : lang_cn)});
    }
    render() {
    	const {showLangMenu, iconType, lang_img} = this.state
    	const path = this.props.match.path;
    	const lang = this.props.lang
    	return (
    		<div className="header">
				<nav className="navbar navbar-fixed-top">
					<div className="container container_header">
						<div className="navbar-header">
							<div className="logo floatLeft" >
								<div className="floatLeft"><img src={logo}/></div>
								<div className="floatLeft"><Link to={'/'}>{lang.DID_BlockChain_Explorer}</Link></div>
							</div>
							 <span className="sr-only">Toggle navigation</span>
					            <span className="icon-bar"></span>
					            <span className="icon-bar"></span>
					            <span className="icon-bar"></span>
						</div>
						<div id="navbar" className="menu collapse navbar-collapse">
							<ul className="nav navbar-nav">
								<li className={path=='/ela_did' ? 'menu_active' : undefined}>
									<Link to={'/ela_did'}>ELA DID</Link>
								</li>
								<li className={path=='/transactions' ? 'menu_active' : undefined}>
									<Link to={'/transactions'}>{lang.transactions}</Link>
								</li>
								<li className={path=='/blocks' ? 'menu_active' : undefined}>
									<Link to={'/blocks'}>{lang.block} </Link>
								</li>
								<li className={path=='/eapps' ? 'menu_active' : undefined}>
									<Link to={'/eapps'}> EApps</Link>
								</li>
								<li className="language" onMouseOver={this.showLanguage} onMouseOut = {this.hideLanguage}>
									<div><img alt="lang_img" src={lang_img}/><span style={{"paddingRight":"0px"}}>{lang.language}</span><img src={iconType}/></div>
									<div style={{"display":showLangMenu}}>
										<ul className="lang_sel">
											<li onClick={this.changeLang.bind(this,"en")} type="en"><img  alt="lang_en" src={lang_en}/><span>English</span></li>
											<li onClick={this.changeLang.bind(this,"cn")} type="cn"><img  alt="lang_cn" src={lang_cn}/><span>简体中文</span></li>
										</ul>
									</div>
								</li>
									
							</ul>
						</div>
					</div>
				</nav>
			</div>
    	)
    }
}

export default Header;