import React from 'react';
import { getTransactions, getTxDetailFromTxid, getTransactionsCount } from '../request/request';
import {Link} from 'react-router-dom';
import { Pagination } from 'antd';
import './TransactionList.css';
import loadingImg from '../public/images/loading.gif';
class TransactionList extends React.Component {
	 constructor(props){
        super(props);
        this.state = {
            count:0,
            size: 20,
            current:1,
            transactions:[],
            loading:false
        }
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount (){
        const { current, size }= this.state;
        this.GetInfo(current,size);
    }
    GetInfo = async (current,size) => {
        try{
            const count = await getTransactionsCount();
            const start = ( current - 1) * size;
            const transactions = await getTransactions(start,size);
            this.setState({
                count:count[0].count,
                transactions:transactions,
                loading:false
            })

            Object.keys(transactions).map(k => {
               return this.GetTransactions(k,transactions[k].txid)
            });
        }catch(err){
          console.log(err)
        }
    }
	GetTransactions = async (k,txid) => {
        try{
            const txDetail = await getTxDetailFromTxid(txid);
            let transaction = this.state.transactions;
            transaction[k].did = txDetail[0].did;
            transaction[k].property_key = txDetail[0].property_key;
            transaction[k].property_value = txDetail[0].property_value;
            transaction[k].property_key_status = txDetail[0].property_key_status;
            this.setState({transactions:transaction})

        }catch(err){
            console.log(err)
        }
       
    }
    onChange(pageNumber) {
        this.setState({
            loading:true,
            current : pageNumber
        })
        const { size }= this.state;
        this.GetInfo(pageNumber,size);
    }
    render() {
    	const { transactions, count, size, current, loading } = this.state;
        const  lang  = this.props.lang;
        const txHtml = transactions.map((tx,k) => {
        	return(
        		<tr className="ant-table-row ant-table-row-level-0 table_tr" data-row-key="1" key={k}>
	        		<td width="30%"><Link to={'/properties_list/'+tx.did}><span>{tx.did}</span></Link></td>
	        		<td width="40%"><Link to={'/txinfo/'+tx.txid}><span>{tx.txid}</span></Link></td>
	        		<td width="10%"><Link to={'/height/'+tx.height}><span>{tx.height}</span></Link></td>
	        		<td width="10%"><span>{tx.length_memo}</span></td>
	        		<td width="10%"><span>{tx.local_system_time}</span></td>
				</tr>
        	)
        });
        return (
                <div className="container">
                	<div style={{"marginTop":"20px","borderBottom":"1px #ccc solid","paddingBottom":"15px","textAlign":"left","paddingLeft":"10px"}}><span style={{"fontSize":"25px"}}>{lang.transactions_list}</span></div>
					<div className="ant-table ant-table-default ant-table-scroll-position-left">
						<div className="ant-table-content">
							<div className="ant-table-body">
								<table className="">
									<thead className="ant-table-thead">
										<tr>
											<th className="">
												<div>DID</div>
											</th>
											<th className="">
												<div>{lang.tx_hash}</div>
											</th>
											<th className="">
												<div>{lang.block_height}</div>
											</th>
											<th className="">
												<div>{lang.memo_size}({lang.byte})</div>
											</th>
											<th className="">
												<div>{lang.time}</div>
											</th>
										</tr>
									</thead>
									<tbody className="ant-table-tbody">
										{txHtml}
									</tbody>
								</table>
								<div style={{"marginTop":"50px"}}>
                                    
                                    <Pagination showQuickJumper defaultCurrent={current} total={count} defaultPageSize = {size} showLessItems onChange={this.onChange} 
                                        style={{"float":"right"}}
                                    />
                                    {loading && <img style={{"float":"right","marginRight":"30px","marginTop":"5px","width":"20px"}} src={loadingImg} alt="loading"/>}
                                </div>
							</div>
						</div>
					</div>
                </div>
        );
    }
}

export default TransactionList;