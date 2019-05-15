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
								<li><span>Report</span></li>
								<li><span>Elastos.org</span></li>
								<li>
									<div className="tips">Create an EApp</div>
									<span>Developer</span></li>
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