import React from 'react';
import { getPropertiesFromDid, getAddressFromTxid } from '../request/request';
import './didDetail.css';
import U from 'urlencode';
import Search from './elements/Search';
import Clipboard from './elements/Clipboard';
import iconCopy from '../public/images/icon-copy.svg';
import iconDeprecated from '../public/images/icon-deprecated.svg';
import iconNormal from '../public/images/icon-normal.svg';
class DidDetail extends React.Component {
	constructor(props){
        super(props);
        this.state = {
	        did : "",
	        properties:[],
            address:"..."
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
            console.log(properties)
            this.setState({
                properties:properties
            })
            if(properties.length > 0 ){
                const getAddress = await getAddressFromTxid(properties[0].txid)
                console.log(getAddress)
                this.setState({
                    address:getAddress[0].address
                })
            }
            

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
    	const {properties,did, address } = this.state;
    	const lang = this.props.lang;
        const propertyHtml = properties.map((property,k) => {
            if( k % 2 == 0){return(
                <li  key={k}>
                    {property.property_key ? (<div style={{"width":"50%","display":"inline-block","verticalAlign":"top"}}>
                        <span className="detail_key wordBreak">{ property.property_key} <a href={"/history/"+did+"/"+U(property.property_key)} className="did_history">{lang.history}</a></span>
                        <span className="detail_value wordBreak">{ property.property_value}</span>
                        {property.property_key_status === 1 ? (
                            <span className="detail_status" ><img src={iconNormal} alt="iconNormal"/>{lang.normal}</span>
                            ) :(
                            <span className="detail_status" style={{"color":"#E25757"}}><img src={iconDeprecated} alt="iconDeprecated"/>{lang.deprecated} </span>
                            )}
                    </div>)
                :("") }
                    {  properties[k+1] && properties[k+1].property_key ? (
                        <div style={{"width":"50%","display":"inline-block","verticalAlign":"top"}}>
                        <span className="detail_key wordBreak">{ properties[k+1].property_key} <a href={"/history/"+did+"/"+U(properties[k+1].property_key)} className="did_history">{lang.history}</a></span>
                        <span className="detail_value wordBreak">{ properties[k+1].property_value}</span>
                        {properties[k+1].property_key_status === 1 ? (
                            <span className="detail_status" ><img src={iconNormal} alt="iconNormal"/>{lang.normal}</span>
                            ) :(
                            <span className="detail_status" style={{"color":"#E25757"}}><img src={iconDeprecated} alt="iconDeprecated"/> {lang.deprecated}</span>
                            )}
                        </div>
                    ):""}
                </li>
            )}
            
        });



        return (
            <div className="container">
            	<div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.ela_did_detail}</span></div>
                    <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>
                </div>
                <div className="did_title">
                	<span>DID: ela:</span><span  id="foo">{did}</span> 
                    <Clipboard lang = {lang} eleId = "foo" icon = {iconCopy} style={{"marginBotton":"5px","padding":"3px"}}/>
                </div>
                <div className="did_content">
                	<ul>
                		<li>
                			<span className="detail_key wordBreak">{lang.public_key}</span>
                			<span  className="detail_value wordBreak">{properties.length > 0 ? properties[0].public_key : '...'}</span>
                		</li>
                	</ul>
                </div>
                <div className="did_content">
                    <ul>
                        <li>
                            <span className="detail_key wordBreak">{lang.address}</span>
                            <a style={{"color":"rgb(49, 181, 157)"}} href = {"/address_info/"+address}><span  className=" wordBreak">{address}</span></a>
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