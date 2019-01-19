import React from 'react';
import { getPropertiesFromDid } from '../request/request';
import {Link} from 'react-router-dom';
import './PropertiesList.css'
class PropertiesList extends React.Component {
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
    	
    	const propertyHtml = properties.map((property,k) => {
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
        });
        return (
            <div className="container">
            	<div style={{"marginTop":"20px","borderBottom":"1px #ccc solid","paddingBottom":"15px","textAlign":"left","paddingLeft":"10px"}}><span className="span_did" >DID : {did}</span></div>
				<div className="ant-table ant-table-default ant-table-scroll-position-left">
					<div className="ant-table-content">
						<div className="ant-table-body">
							<table className="table_propty">
								<thead className="ant-table-thead">
									<tr>
										<th className="">
											<div>{lang.property_name}</div>
										</th>
										<th className="">
											<div>{lang.property_value}</div>
										</th>
										<th className="">
											<div>{lang.last_update}</div>
										</th>
										<th className="">
											<div>{lang.tx_hash}</div>
										</th>
										<th className="">
											<div>{lang.history}</div>
										</th>
									</tr>
								</thead>
								<tbody className="ant-table-tbody">
									{/*
									<tr className="ant-table-row ant-table-row-level-0 table_tr" data-row-key="1" >
						        		<td width="30%"><span>...</span></td>
						        		<td width="40%"><span>...</span></td>
						        		<td width="10%"><span>...</span></td>
						        		<td width="10%"><span>...</span></td>
						        		<td width="10%"><span>...</span></td>
									</tr>

									*/}
									{propertyHtml}
								</tbody>
							</table>
						</div>
					</div>
				</div>
            </div>
        );
    }
}

export default PropertiesList;