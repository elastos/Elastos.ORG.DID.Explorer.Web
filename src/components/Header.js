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
        this.state={
            showLangMenu:"none",
            iconType:iconDown
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
    render() {
    	const {showLangMenu, iconType} = this.state
    	const path = this.props.match.path;
    	return (
    		<div className="header">
				<nav className="navbar navbar-fixed-top">
					<div className="container container_header">
						<div className="navbar-header">
							<div className="logo floatLeft" >
								<div className="floatLeft"><img src={logo}/></div>
								<div className="floatLeft"><Link to={'/'}>DID Explorer</Link></div>
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
									<Link to={'/transactions'}>Transactions</Link>
								</li>
								<li className={path=='/blocks' ? 'menu_active' : undefined}>
									<Link to={'/blocks'}> Blocks</Link>
								</li>
								<li className={path=='/eapps' ? 'menu_active' : undefined}>
									<Link to={'/eapps'}> EApps</Link>
								</li>
								<li className="language" onMouseOver={this.showLanguage} onMouseOut = {this.hideLanguage}>
									<div><img alt="lang_en" src={lang_en}/><span style={{"paddingRight":"0px"}}>English</span><img src={iconType}/></div>
									<div style={{"display":showLangMenu}}>
										<ul className="lang_sel">
											<li><img alt="lang_en" src={lang_en}/><span>English</span></li>
											<li><img alt="lang_cn" src={lang_cn}/><span>简体中文</span></li>
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