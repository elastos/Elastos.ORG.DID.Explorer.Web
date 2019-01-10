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
    render() {
    	const { properties, did } = this.state;
    	const lang = this.props.lang;
    	
    	const propertyHtml = properties.map((property,k) => {
        	return(
        		<tr className="ant-table-row ant-table-row-level-0 " data-row-key="1" key={k} >
	        		<td width="20%"><span>{property.property_key}</span></td>
	        		<td width="20%"><span>{property.property_value}</span></td>
	        		<td width="20%"><span>{property.local_system_time}</span></td>
	        		<td width="30%"><span>{property.txid}</span></td>
	        		<td width="10%"><Link to={'/did/'+did+'/property_history/'+property.property_key}><span>{lang.details}</span></Link></td>
				</tr>
        	)
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