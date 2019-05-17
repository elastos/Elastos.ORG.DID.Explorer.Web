import React from 'react';
import { getTxDetailFromTxid ,getTransactionsFromTxid,getValuesFromTxid} from '../request/request';
import './transactionDetail.css'
import Search from './elements/Search'
import iconCopy from '../public/images/icon-copy.svg'
import iconDeprecated from '../public/images/icon-deprecated.svg'
import iconNormal from '../public/images/icon-normal.svg'
import confirmed from '../public/images/confirmed.svg'
class TransactionDetail extends React.Component {
	constructor(props){
        super(props);
        this.state = {
	        txid:"",
            transactions:[],
            isEvent:true,
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
            const isEvent = properties.length > 0 ? true : false
            const values = await getValuesFromTxid(txid)
            transactions[0].properties = properties;
            transactions[0].did = properties[0].did;
            transactions[0].didstatus = properties[0].did_status;
            transactions[0].values = values[0].value;
            this.setState({
                transactions:transactions,
                isEvent:isEvent
            })
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
    	const txid = this.props.match.params.txid;
        const lang = this.props.lang;
        const { transactions, isEvent } = this.state;
    	
        console.log(transactions)

        const proHtml = (transactions.length >0 && typeof transactions[0].properties != "undefined") ? (transactions[0].properties.map((property,k)=>{
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
        })) :"";
        return (
            <div className="container">
            	<div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.transactions}</span></div>
                    <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>
                </div>
                <div className="transaction_title">
                	<span> {txid} </span>
                	<img src={iconCopy} alt="iconCopy"/>

                </div>
                <div className="transaction_summery">
                	<ul>
                		<li>
                			<span className="detail_key wordBreak">{lang.status}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}><img src={confirmed} alt = "confirmed"/> Confirmed</span>
                		</li>
                		<li>
                			<span className="detail_key wordBreak">{lang.did_event_included}</span>
                			<span className="detail_value wordBreak">{isEvent ? lang.yes : lang.no}</span>
                		</li>
                		<li>
                			<span className="detail_key wordBreak">{lang.time}</span>
                			<span className="detail_value wordBreak">{transactions.length ? this.timestampToTime(transactions[0].createTime) : "..."}</span>
                		</li>
                		<li>
                			<span className="detail_key wordBreak">{lang.block_height}</span>
                			<span className="detail_value wordBreak"> {transactions.length ? transactions[0].height : "..."}</span>
                		</li>
                		<li>
                			<span className="detail_key wordBreak">{lang.fee}</span>
                			<span className="detail_value wordBreak">{transactions.length ? transactions[0].fee / 100000000 : "..."} ELA</span>
                		</li>
                	</ul>
                </div>
                <div className="transaction_summery" >
                	<ul>
                		<li style={{"width":"40%"}}> 
                			<span className="detail_key wordBreak">{lang.from}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{transactions.length ? transactions[0].inputs : "..."}</span>
                		</li>
                		<li style={{"width":"40%"}}>
                			<span className="detail_key wordBreak">{lang.to}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{transactions.length ? transactions[0].inputs : "..."}</span>
                		</li>
                        <li style={{"width":"20%"}}>
                            <span className="detail_key wordBreak">{lang.number}</span>
                            <span className="detail_value wordBreak">{transactions.length ? transactions[0].values / 100000000 : "..."} ELA</span>
                        </li>
                		<li style={{"width":"40%"}}>
                			<span className="detail_key wordBreak">{lang.from}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{transactions.length ? transactions[0].inputs : "..."}</span>
                		</li>
                		<li style={{"width":"40%"}}>
                			<span className="detail_key wordBreak">{lang.to}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{transactions.length ? transactions[0].outputs : "..."}</span>
                		</li>
                        <li style={{"width":"20%"}}>
                            <span className="detail_key wordBreak">{lang.number}</span>
                            <span className="detail_value wordBreak">{transactions.length ? transactions[0].values / 100000000 : "..."} ELA</span>
                        </li>
                	</ul>
                </div>
				<div className="transaction_title" style={{    "marginTop": "40px"}}>
                	<span> {lang.did_properties}</span>
                </div>
                <div className="did_content">
                	<ul>
                        {proHtml}
                	</ul>
                </div>   
            </div>
        );
    }
}

export default TransactionDetail;