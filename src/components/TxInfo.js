import React from 'react';
import {Link} from 'react-router-dom';
import { getTxDetailFromTxid ,getTransactionsFromTxid,getCurrentHeight,getValuesFromTxid} from '../request/request';
import { Icon } from 'antd';
class TxInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
	        txid:"",
            currentHeight:0,
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
            const values = await getValuesFromTxid(txid)
            transactions[0].properties = properties;
            transactions[0].did = properties[0].did;
            transactions[0].didstatus = properties[0].did_status;
            transactions[0].values = values[0].value;
            this.setState({transactions:transactions})
            const currentHeight = await getCurrentHeight();
            this.setState({
                currentHeight:currentHeight[0].height
            })
            
        }catch(err){
          console.log(err)
        }
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
    componentWillReceiveProps(nextProps) {
    	const txid =nextProps.match.params.txid ;
        this.setState({
            txid: txid
        })
        this.GetInfo(txid);
    }
    render() {
        const txid = this.props.match.params.txid;
        const { transactions,currentHeight } = this.state;
        const  lang  = this.props.lang;
         const width = document.body.clientWidth;
        const iconType = (width > 760) ? "caret-right" : "caret-down";
        const txHtml = transactions.map((tx,k) => {
            const proHtml = (typeof tx.properties != "undefined") ? (tx.properties.map((property,k)=>{
                return(
                    <li key={k}>
                        <Link to={'/did/'+tx.did+'/property_history/'+ property.property_key} >
                            <span className="floatLeft" style={{"width":"100px"}}>{ property.property_key}</span>
                            <span className="floatRight" style={{"width":"75px","textAlign":"right"}}>{property.property_key_status === 1 ? "("+lang.available+")" : "("+lang.disused+")"}</span>
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
                                <span className="tint">{this.timestampToTime(tx.createTime)}</span>
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
                                <span>{lang.fee}:{tx.fee / 100000000} ELA</span>
                                <span>{tx.values / 100000000} ELA</span>
                                <span>{currentHeight - tx.height + 1 } {lang.confirmations}</span>
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