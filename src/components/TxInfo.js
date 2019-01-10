import React from 'react';
import {Link} from 'react-router-dom';
import { getTxDetailFromTxid ,getTransactionsFromTxid} from '../request/request';
import { Icon } from 'antd';
class TxInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
	        txid:"",
	        transactions:[]
        }
    }
    componentWillMount (){
    	const txid =this.props.match.params.txid ;
        this.setState({
            txid: txid
        })
        this.GetInfo(txid);
    }
    GetInfo = async (txid) => {
        try{
            const transactions = await getTransactionsFromTxid(txid);
            const properties = await getTxDetailFromTxid(txid);
            transactions[0].properties = properties;
            transactions[0].did = properties[0].did;
            transactions[0].didstatus = properties[0].did_status;
            this.setState({transactions:transactions})
        }catch(err){
          console.log(err)
        }
    }
    componentWillReceiveProps(nextProps) {
    	const txid =nextProps.match.params.txid ;
        this.setState({
            txid: txid
        })
        this.GetInfo(txid);
    }
    render() {
        const txid = this.props.match.params.txid;
        const { transactions } = this.state;
        const  lang  = this.props.lang;
         const width = document.body.clientWidth;
        const iconType = (width > 760) ? "caret-right" : "caret-down";
        const txHtml = transactions.map((tx,k) => {
            const proHtml = (typeof tx.properties != "undefined") ? (tx.properties.map((property,k)=>{
                return(
                    <li key={k}>
                        <Link to={'/did/'+tx.did+'/property_history/'+ property.property_key} >
                            <span className="floatLeft" style={{"width":"100px"}}>{ property.property_key}</span>
                            <span className="floatRight" style={{"width":"40px"}}>{property.property_key_status === 1 ? "("+lang.available+")" : "("+lang.disused+")"}</span>
                            <span className="floatRight" style={{"width":"360px"}}>{ property.property_value}</span>
                        </Link>
                    </li>
                )
            })) :"";
            return (
               <div  key={k} style={{"marginBottom":"40px"}}>
                    <ul className = "transactionUl">
                        <li className = "liTitle">
                            <div className="floatLeft">
                                <span>{tx.txid}</span>
                            </div>
                            <div className="floatRight">
                                <span className="tint">{tx.local_system_time}</span>
                            </div>
                        </li>
                        <li className = "liContent">
                            <div className="content1">
                            {tx.txType === "TransferAsset" &&
                                <ul>
                                    <li className="left"><Link to={'/properties_list/'+tx.did} >{tx.did}</Link>{tx.didstatus === 1 ? "("+lang.available+")" : "("+lang.disused+")"}</li>
                                    <li className="center"><Icon  type={iconType} /></li>
                                    <li className="right">
                                        <ul>
                                           {proHtml}
                                        </ul>
                                    </li>
                                </ul>
                            }
                            </div>
                           
                            <div className="content2" >
                                <span>{lang.primitive_memo_binary} : </span><span  style={{"whiteSpace":"normal"}}> {tx.memo}</span>
                            </div>
                            <div className="content3">
                                <span>{lang.fee}:{tx.fee / 100000000}</span>
                                <span>...ELA</span>
                                <span>...{lang.confirmations}</span>
                            </div>
                        </li>
                    </ul>
                </div>

            )
        });
        return (
                <div className="container">
                	<div style={{"marginTop":"20px","borderBottom":"1px #ccc solid","paddingBottom":"15px","textAlign":"left","paddingLeft":"10px"}}><span className="span_txid">txid : {txid}</span></div>
					<div>
                		<h2 className="title bold">{lang.transactions}</h2>
                		{txHtml}
                        
                	</div>
                </div>
        );
    }
}

export default TxInfo;