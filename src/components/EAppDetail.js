import React from 'react';
import './eappDetail.css';
import Search from './elements/Search'
import Clipboard from './elements/Clipboard';
import iconCopy from '../public/images/icon-copy.svg'
import iconLeft from '../public/images/icon-left.svg'
import mark_l from '../public/images/mark_l.png'
import privacy from '../public/images/icon-privacy.svg'
import notice from '../public/images/icon-notice.svg'
class EappDetail extends React.Component {
	
    render() {
        const lang = this.props.lang
        const app_name = this.props.match.params.app_name;
        const app_id = this.props.match.params.app_id;
        console.log(app_name)
    	return (
    		<div className="container">
            	<div className = "list_top" >
                    <div className = "list_title"><a href="/eapps"><img src={iconLeft} alt="back" style={{"marginBottom":"2px","marginRight":"10px"}}/><span style={{"fontSize":"14px"}}>{lang.back}</span></a></div>
                    <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>
                </div>
                <div className="eapp_content">
                	<div className="eapp_profile">
                		<div><img src={mark_l} alt="profile"/></div>
                		<div>
                			<p className="eapp_name">{app_name}</p>
                			<p className="eapp_did">
                            <span>elaappid:</span><span id="foo" className="wordBreak">{app_id}</span>
                            <Clipboard lang = {lang} eleId = "foo" icon = {iconCopy} style={{"marginBotton":"5px","padding":"3px"}}/>
                            </p>
                			<ul className="eapp_nav">
                				<li className = "status"><a href = "/notification"><img src={privacy} alt="privacy"/> <span>{lang.privacy}</span></a></li>
                				<li className = "notice"><a href = "/notification"><img src={notice} alt = "notice"/> <span>{lang.notification}</span></a></li>
                				<li><a href="/more"><span>{lang.more}...</span></a></li>
                			</ul>
                		</div>
                		<div>
                			{/*<a href="/website" style={{"textDecoration":"none"}}>*/}
                                <span className="webbutton" style={{"background":"#ccc"}}>{lang.website}</span>
                            {/* </a> */}
                		</div>

                	</div>

                </div>
                <div className="ant-table ant-table-default ant-table-scroll-position-left" style={{"marginTop":"40px"}}>
                    <div className="ant-table-content">
                        <div className="ant-table-body">
                            <table className="transaction_list_table">
                                <thead className="ant-table-thead">
                                    <tr>
                                        <th className="">
                                            <div>{lang.attribute}</div>
                                        </th>
                                        <th className="">
                                            <div>{lang.value}</div>
                                        </th>
                                        
                                    </tr>
                                </thead>
                                <tbody className="ant-table-tbody">
                                     {/*<tr className="ant-table-row ant-table-row-level-0 table_tr1" data-row-key="1">
                                        <td style={{"width":"50%"}}>{lang.size}</td>
                                        <td style={{"width":"50%"}}>20 MB</td>
                                     </tr>
                                     <tr className="ant-table-row ant-table-row-level-0 table_tr1" data-row-key="1">
                                        <td style={{"width":"50%"}}>{lang.eapp_url}</td>
                                        <td style={{"width":"50%"}}><a href="https://eladapp.com/" style={{"color":"#31B59D"}}>https://eladapp.com/app</a></td>
                                     </tr>
                                     <tr className="ant-table-row ant-table-row-level-0 table_tr1" data-row-key="1">
                                        <td style={{"width":"50%"}}>Signature</td>
                                        <td style={{"width":"50%"}}>akksdnjujsadfujkgnak;awiere;awlka;sdlkfsa;ldkfasjl;f</td>
                                     </tr>*/}
                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                </div> 
				
            </div>
    	)
    }
}

export default EappDetail;