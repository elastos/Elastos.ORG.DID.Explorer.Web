import React from 'react';
import { getPropertiesFromDid } from '../request/request';
import './didDetail.css'
import Search from './elements/Search'
import iconCopy from '../public/images/icon-copy.svg'
import iconDeprecated from '../public/images/icon-deprecated.svg'
import iconNormal from '../public/images/icon-normal.svg'
class DidDetail extends React.Component {
	constructor(props){
        super(props);
        this.state = {
	        did : "",
	        properties:[]
        }
    }
    componentWillMount (){
    	const did = this.props.match.params.did;
    	this.setState({
            did:did
        })
        this.GetInfo(did);
    }
    GetInfo = async (did) => {
        try{
            const properties = await getPropertiesFromDid(did);
            this.setState({
                properties:properties
            })

        }catch(err){
          console.log(err)
        }
    }

     componentWillReceiveProps(nextProps) {
     	const did = nextProps.match.params.did;
        this.setState({
            did : did
        })
        this.GetInfo(did);
    }
     timestampToTime(timestamp) {
      let date = new Date(timestamp * 1000);
      let Y = date.getFullYear();
      let M = date.getMonth()+1;
      let D = date.getDate() ;
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      return Y + '-' +
      (M < 10 ? '0'+ M : M ) + '-' + 
      (D < 10 ? '0'+ D : D ) + ' ' + 
      (h < 10 ? '0'+ h : h ) + ':' + 
      (m < 10 ? '0'+ m : m ) + ':' + 
      (s < 10 ? '0'+ s : s );
    }
    render() {
    	const { properties, did } = this.state;
        console.log(properties)
    	const lang = this.props.lang;

        const propertyHtml = properties.map((property,k) => {
            if(property.property_key){
                return(
                    
                    <li style={{"width":"50%","display":"inline-block"}} key={k}>
                            <span className="detail_key wordBreak">{ property.property_key}</span>
                            <span className="detail_value wordBreak">{ property.property_value}</span>
                            {property.property_key_status === 1 ? (
                                <span className="detail_status" ><img src={iconNormal} alt="iconNormal"/>Normal</span>
                                ) :(
                                <span className="detail_status" style={{"color":"#E25757"}}><img src={iconDeprecated} alt="iconDeprecated"/> Deprecated</span>
                                )}
                            
                        </li>
                )
            }else{
          return("");
        }
        });



        return (
            <div className="container">
            	<div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.ela_did_detail}</span></div>
                    <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>
                </div>
                <div className="did_title">
                	<span>DID: ela: {did}</span>
                	<img src={iconCopy} alt="iconCopy"/>

                </div>
                <div className="did_content">
                	<ul>
                		<li>
                			<span className="detail_key wordBreak">{lang.public_key}</span>
                			<span className="detail_value wordBreak">{did}</span>
                		</li>
                	</ul>
                </div>
                <div className="did_content">
                	<ul>
                        {propertyHtml}
                	</ul>


                </div>   
				
            </div>
        );
    }
}

export default DidDetail;