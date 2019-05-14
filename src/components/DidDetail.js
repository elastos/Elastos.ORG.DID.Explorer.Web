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
    	const lang = this.props.lang;
    	
    	/*const propertyHtml = properties.map((property,k) => {
    		if(property.property_key){
				return(
	        		<tr className="ant-table-row ant-table-row-level-0 " data-row-key="1" key={k} >
		        		<td width="20%"><span>{property.property_key}</span></td>
		        		<td width="20%"><span>{property.property_value}</span></td>
		        		<td width="20%"><span>{this.timestampToTime(property.block_time)}</span></td>
		        		<td width="30%"><span>{property.txid}</span></td>
		        		<td width="10%"><Link to={'/did/'+did+'/property_history/'+property.property_key}><span>{lang.details}</span></Link></td>
					</tr>
	        	)
    		}else{
          return("");
        }
        });*/
        return (
            <div className="container">
            	<div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>ELA DID Detail</span></div>
                    <div className = "list_search"><Search button="false" name="list"/></div>
                </div>
                <div className="did_title">
                	<span>DID: ela: AUJXj1kaA1zy4gRYLjC7faucjodaBx1W19</span>
                	<img src={iconCopy} alt="iconCopy"/>

                </div>
                <div className="did_content">
                	<ul>
                		<li>
                			<span className="detail_key">Public Key</span>
                			<span className="detail_value">{did}</span>
                		</li>
                	</ul>
                </div>
                <div className="did_content">
                	<ul>
                		<li>
                			<div>
                				<p className="detail_key">Nickname</p>
                				<p className="detail_value">abcefgkjaskldfajlkaskldfjasl;kfd;asal</p>
                				<span className="detail_status"><img src={iconNormal} alt="iconNormal"/>Normal</span>
                			</div>
                			<div>
                				<p className="detail_key">Phone number</p>
                				<p className="detail_value">+86 123 963 2365 </p>
                				<span className="detail_status" style={{"color":"#E25757"}}><img src={iconDeprecated} alt="iconDeprecated"/>Deprecated</span>
                			</div>

                		</li>
                		<li>
                			<div>
                				<p className="detail_key">Wallet Address</p>
                				<p className="detail_value">0xelakjajnksdjfnklsfjdls</p>
                				<span className="detail_status"><img src={iconNormal} alt="iconNormal"/>Normal</span>
                			</div>
                			<div>
                				<p className="detail_key"></p>
                				<p className="detail_value"></p>
                				<span className="detail_status"></span>
                			</div>

                		</li>

                	</ul>


                </div>   
				
            </div>
        );
    }
}

export default DidDetail;