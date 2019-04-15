import React from 'react';
import './PropertiesHistory.css'
import { getPropertyChanges,getPropertiesHistoryCount } from '../request/request';
import { Pagination } from 'antd';
import loadingImg from '../public/images/loading.gif';
class PropertiesHistory extends React.Component {
	 constructor(props){
        super(props);
        this.state = {
        	did:"",
        	key:"",
			size: 20,
			current:1,
        	propertyChanges:[],
			loading:false
        }
		this.onChange = this.onChange.bind(this);
    }
    componentWillMount (){
    	const did = this.props.match.params.did;
    	const key = this.props.match.params.key;
    	this.setState({
    		did:did,
    		key:key
    	})
         const { current, size }= this.state;
        this.GetInfo(did,key,current,size);
    }
    GetInfo = async (did,key,current,size) => {
        try{
			const start = ( current - 1) * size;
            const count = await getPropertiesHistoryCount(key,did);
           
            const propertyChanges = await getPropertyChanges(key,did,start,size);
            this.setState({
				count:count[0].count,
                propertyChanges:propertyChanges,
				loading:false
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
        const { current, size }= this.state;
        this.GetInfo(did,key,current,size);
    }
	 onChange(pageNumber) {
        this.setState({
            loading:true,
            current : pageNumber
        })
        const { size }= this.state;
        const did = this.props.match.params.did;
        const key = this.props.match.params.key;
        this.GetInfo(did,key,pageNumber,size);
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
    	const { count,current, size, propertyChanges,loading } = this.state;
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
								<div style={{"marginTop":"50px"}}>
								  { count > size && <Pagination showQuickJumper defaultCurrent={current} total={count} defaultPageSize = {size} showLessItems onChange={this.onChange} 
									  style={{"float":"right"}}
								  />}
								  {loading && <img style={{"float":"right","marginRight":"30px","marginTop":"5px","width":"20px"}} src={loadingImg} alt="loading"/>}
								</div>
								
							</div>
						</div>
					</div>
                </div>
        );
    }
}

export default PropertiesHistory;