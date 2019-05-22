import React from 'react';
import './footer.css'
import logo from '../public/images/logo_f.png' ;
class Footer extends React.Component {
	
    render() {
    	const lang = this.props.lang;
    	return (
    		<div className="footer">
				<div className="container">
					<div className="footer_content_left floatLeft">
						<img src={logo} alt="logo"/>
						<span>{lang.DID_BlockChain_Explorer}</span>

					</div>
					<div className="footer_content_right floatRight">
						<div className="link">
							<ul>
								{/*<li><a href="/reporting" target="_blank"><span>Report</span></a></li>*/}
								<li><a href="https://www.elastos.org/" target="_blank"><span>Elastos.org</span></a></li>
								<li>
									<div className="tips">Create an EApp</div>
									<a href="https://developer.elastos.org/" target="_blank"><span>Developer</span></a>
								</li>
							</ul>
						</div>
						<div className="copyright">Copyright © 2017 Elastos Foundation. All Rights Reserved.</div>

					</div>
				</div>
			</div>
    	)
    }
}

export default Footer;