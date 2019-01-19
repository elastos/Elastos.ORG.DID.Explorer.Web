import React from 'react';
import './PropertiesHistory.css'
import { getPropertyChanges } from '../request/request';
class PropertiesHistory extends React.Component {
	 constructor(props){
        super(props);
        this.state = {
        	did:"",
        	key:"",
        	propertyChanges:[]
        }
    }
    componentWillMount (){
    	const did = this.props.match.params.did;
    	const key = this.props.match.params.key;
    	this.setState({
    		did:did,
    		key:key
    	})
        this.GetInfo(did,key);
    }
    GetInfo = async (did,key) => {
        try{
            const propertyChanges = await getPropertyChanges(key,did);
            this.setState({
                propertyChanges:propertyChanges
            })
            
        }catch(err){
          console.log(err)
        }
    }
    componentWillReceiveProps(nextProps) {
    	const did = nextProps.match.params.did;
    	const key = nextProps.match.params.key;
        this.setState({
            did:did,
    		key:key
        })
        this.GetInfo(did,key);
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
    	const { propertyChanges } = this.state;
        const lang = this.props.lang;
    	const propertyHtml = propertyChanges.map((property,k) => {
        	return(
        		<tr className="ant-table-row ant-table-row-level-0 " data-row-key="1" key={k}>
	        	    <td width="20%" style={{"borderRight":"1px solid #e8e8e8","textAlign":"center"}}><span>{property.property_key}</span></td>
	        		<td width="20%"><span>{this.timestampToTime(property.block_time)}</span></td>
	        		<td width="30%"><span>{property.txid}</span></td>
	        		<td width="30%"><span>{property.property_value}</span></td>
				</tr>
        	)
        });

        return (
            <div className="container">
                	<div style={{"marginTop":"20px","borderBottom":"1px #ccc solid","paddingBottom":"15px","textAlign":"left","paddingLeft":"10px"}}><span className="span_did">DID : {this.props.match.params.did}</span></div>
					<div className="ant-table ant-table-default ant-table-scroll-position-left">
						<div className="ant-table-content">
							<div className="ant-table-body">
								<table className="table_history">
									<thead className="ant-table-thead">
										<tr>
											<th className="ant-table-column-has-actions ant-table-column-has-sorters" rowSpan="3">
												<div>{lang.property_name}</div>
											</th>
											<th className="">
												<div>{lang.update_time}</div>
											</th>
											<th className="">
												<div>{lang.tx_hash}</div>
											</th>
											<th className="">
												<div>{lang.property_value}</div>
											</th>
										</tr>
									</thead>
									<tbody className="ant-table-tbody">
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

export default PropertiesHistory;