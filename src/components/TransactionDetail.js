import React from 'react';
import { getTxDetailFromTxid, getTransactionsFromTxid, getValuesFromTxid, getCurrentHeight} from '../request/request';
import './transactionDetail.css'
import U from 'urlencode';
import Search from './elements/Search'
import Clipboard from './elements/Clipboard';
import iconCopy from '../public/images/icon-copy.svg'
import iconDeprecated from '../public/images/icon-deprecated.svg'
import iconNormal from '../public/images/icon-normal.svg'
import confirmed from '../public/images/confirmed.svg'
import loadingImg from '../public/images/loading.gif';
class TransactionDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            txid:"",
            transactions:[],
            currentHeight:0,
            isEvent:true,
            loading:true
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
            console.log(transactions)
            transactions[0].properties = properties;
            transactions[0].did = properties[0].did;
            transactions[0].didstatus = properties[0].did_status;
            transactions[0].values = values[0].value;
            this.setState({
                transactions:transactions,
                isEvent:isEvent,
                loading:false
            })
            const currentHeight = await getCurrentHeight();
            this.setState({
                currentHeight:currentHeight[0].height
            })
        }catch(err){
            this.setState({ loading:false })
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
        const { transactions, isEvent, loading, currentHeight } = this.state;
        const proHtml = (transactions.length >0 && typeof transactions[0].properties != "undefined") ? (transactions[0].properties.map((property,k)=>{
             if( k % 2 == 0){ return(
                    <li  key={k}>
                        <div style={{"width":"50%","display":"inline-block","verticalAlign":"top"}}>
                            <span className="detail_key wordBreak">{ property.property_key} <a href={"/history/"+transactions[0].did+"/"+U(property.property_key)} className="did_history">{lang.history}</a></span>
                            <span className="detail_value wordBreak">{ property.property_value}</span>
                            {property.property_key_status === 1 ? (
                                <span className="detail_status" ><img src={iconNormal} alt="iconNormal"/>Normal</span>
                                ) :(
                                <span className="detail_status" style={{"color":"#E25757"}}><img src={iconDeprecated} alt="iconDeprecated"/> Deprecated</span>
                                )}
                        </div>
                        {transactions[0].properties[k+1] ? (
                            <div style={{"width":"50%","display":"inline-block","verticalAlign":"top"}}>
                            <span className="detail_key wordBreak">{ transactions[0].properties[k+1].property_key} <a href={"/history/"+transactions[0].did+"/"+transactions[0].properties[k+1].property_key} className="did_history">{lang.history}</a></span>
                            <span className="detail_value wordBreak">{ transactions[0].properties[k+1].property_value}</span>
                            {transactions[0].properties[k+1].property_key_status === 1 ? (
                                <span className="detail_status" ><img src={iconNormal} alt="iconNormal"/>Normal</span>
                                ) :(
                                <span className="detail_status" style={{"color":"#E25757"}}><img src={iconDeprecated} alt="iconDeprecated"/> Deprecated</span>
                                )}
                            </div>
                        ):""}  
                    </li> 
            ) }
        })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li> ;
        const transHtml = (transactions.length > 0) ? (transactions.map((transaction,k)=>{
            const outputs_arr = transaction.outputs.split(',');
            const inputs_arr = transaction.inputs.split(',');
            
            const outputHtml = (outputs_arr.length > 0 ) ? (outputs_arr.map((output,k)=>{
                if(output){
                    return(
                        <a href={"/address_info/"+output}><span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{output}</span></a>
                    )
                }
            })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li>;

            const inputHtml = (inputs_arr.length > 0 ) ? (inputs_arr.map((input,k)=>{
                if(input){
                    return(<ul key = {k}>
                            <li style={{"width":"40%","borderBottom":"none","verticalAlign":"top"}}>
                                <span className="detail_key wordBreak">{lang.from}</span>
                                <a href={"/address_info/" + input}><span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{input}</span></a>
                            </li>
                            <li style={{"width":"40%","borderBottom":"none","verticalAlign":"top"}}>
                                <span className="detail_key wordBreak">{lang.to}</span>
                                {outputHtml}
                            </li>
                            <li style={{"width":"20%","borderBottom":"none","verticalAlign":"top"}}>
                                <span className="detail_key wordBreak">{lang.number}</span>
                                <span className="detail_value wordBreak">{transaction.values / 100000000} ELA</span>
                            </li>
                        </ul>)
                }
            })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li>;
            return(
                <div key={k}>
                    {inputHtml}
                </div>
                );
        })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li>;
        return (
            <div className="container">
                <div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.transactions}</span></div>
                    <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>
                </div>
                <div className="transaction_title">
                    <span id="foo">{txid}</span>
                    <Clipboard eleId = "foo" icon = {iconCopy} style={{"marginBotton":"5px","padding":"3px"}}/>

                </div>
                <div className="transaction_summery">
                    <ul>
                        <li>
                            <span className="detail_key wordBreak">{lang.confirmations}</span>
                            <span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{transactions.length ? (currentHeight - transactions[0].height + 1) : '...' } </span>
                        </li>
                        <li>
                            <span className="detail_key wordBreak">{lang.did_event_included}</span>
                            <span className="detail_value wordBreak">{transactions.length ?( isEvent ? lang.yes : lang.no) :'...'}</span>
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
                    {transHtml}
                </div>
                <div className="transaction_title" style={{    "marginTop": "40px"}}>
                    <span> {lang.did_properties}</span>
                </div>
                <div className="did_content">
                    <ul>
                        {proHtml}
                    </ul>
                </div>  
                <div className="transaction_title" style={{    "marginTop": "40px"}}>
                    <span> {lang.primitive_memo_binary}</span>
                </div>
                <div className="did_content">
                    <ul>
                        <li className="wordBreak">{transactions.length ? transactions[0].memo : "..."}</li>
                    </ul>
                </div>  

            </div>
        );
    }
}

export default TransactionDetail;