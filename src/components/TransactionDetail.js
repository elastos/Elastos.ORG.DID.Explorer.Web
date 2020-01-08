import React from 'react';
import { getTxDetailFromTxid, getTransactionsFromTxid, getValuesFromTxid, getCurrentHeight, getTransactionInfoFromNodeApi} from '../request/request';
import './transactionDetail.css'
import U from 'urlencode';
import Search from './elements/Search'
import Clipboard from './elements/Clipboard';
import iconCopy from '../public/images/icon-copy.svg'
import iconDeprecated from '../public/images/icon-deprecated.svg'
import iconNormal from '../public/images/icon-normal.svg'
import confirmed from '../public/images/confirmed.svg'
import loadingImg from '../public/images/loading.gif';
import to from '../public/images/to.png';
import moment from 'moment'
class TransactionDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            txid:"",
            transaction:null,
            currentHeight:0,
            isEvent:true,
            loading:true,
            isNodeApi:true
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
            var transaction = null;
            if(this.state.isNodeApi){
                var txInfo = await getTransactionInfoFromNodeApi(txid);
                transaction = txInfo.result;

                var outputs_arr = txInfo.result.vout;
                /////////////////
                outputs_arr.map((v,k)=>{
                    if(outputs_arr[k-1] && outputs_arr[k-1].address === outputs_arr[k].address){
                        outputs_arr[k].value = parseFloat(outputs_arr[k].value) + parseFloat(outputs_arr[k-1].value)
                        delete outputs_arr[k-1]
                    }

                })
                ///////////////////////
                transaction.outputs_arr = outputs_arr;
                
                var inputs_arr = []
                transaction.value_output = 0;
                transaction.value_input = 0;
                //var value_fee = parseFloat(transaction.Fee)
                transaction.vout.map((v1,k1)=>{
                    transaction.value_output = parseFloat(transaction.value_output) + parseFloat(v1.value) * 100000000;
                })
               
                transaction.inputs_arr = []
                transaction.vin.map((v3,k3)=>{
                    
                    (async()=>{ const inputInfo = await getTransactionInfoFromNodeApi(transaction.vin[k3].txid)
                        var lastVout = inputInfo.result.vout[transaction.vin[k3].vout]
                        var address =  lastVout.address
                        
                        var value_input = parseFloat(lastVout.value) * 100000000
                        transaction.value_input += parseFloat(lastVout.value) * 100000000
                        transaction.inputs_arr.push({"address":address,"value":(parseFloat(value_input / 100000000))});
                        transaction.fee = parseFloat(transaction.value_input - transaction.value_output);
                        /////////////////////
                        transaction.inputs_arr.map((v4,k4)=>{
                            if(transaction.inputs_arr[k4] && transaction.inputs_arr[k4-1] && transaction.inputs_arr[k4-1].address === transaction.inputs_arr[k4].address){
                                transaction.inputs_arr[k4].value = parseFloat(transaction.inputs_arr[k4].value) + parseFloat(transaction.inputs_arr[k4-1].value)
                                delete transaction.inputs_arr[k4-1]
                            }
                        })
                        /////////////////
                        this.setState({});
                         
                    })()
                })
                var getBlockHeight = await getTransactionsFromTxid(txid);
                if(getBlockHeight.length > 0){
                    transaction.height = getBlockHeight[0].height
                }
            }else{
                var transactions = await getTransactionsFromTxid(txid);
                const values = await getValuesFromTxid(txid);
               
                if(transactions.length == 1){
                    transaction = transactions[0];
                    transaction.values = transactions[0].value
                }else if(transactions.length == 2){
                    transactions.map((v,k)=>{
                        if(transactions[k].type == "spend"){
                            transaction = transactions[k];
                            transaction.values = values[0].value;
                        }
                    })
                }
                transaction.outputs_arr = transaction.outputs.split(',') ;
                transaction.inputs_arr =  transaction.inputs.split(',')  ;
            }



            
             
            const properties = await getTxDetailFromTxid(txid);
            const isEvent = properties.length > 0 ? true : false;
            if(transaction){
                transaction.properties = properties;
                if(properties.length > 0){
                    transaction.did = properties[0].did;
                    transaction.didstatus = properties[0].did_status;
                }
            }
            

            this.setState({
                transaction:transaction,
                isEvent:isEvent,
                loading:false
            })
            const currentHeight = await getCurrentHeight();
            this.setState({
                currentHeight:currentHeight[0].height
            })
            console.log(transaction)
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
        const { transaction, isEvent, loading, currentHeight } = this.state;
        
        const proHtml = (transaction && typeof transaction.properties != "undefined" && transaction.properties.length > 0) ? (transaction.properties.map((property,k)=>{
             if( k % 2 == 0){ return(
                    <li  key={k}>
                        <div style={{"width":"50%","display":"inline-block","verticalAlign":"top"}}>
                            <span className="detail_key wordBreak">{ property.property_key} <a href={"/history/"+transaction.did+"/"+U(property.property_key)} className="did_history">{lang.history}</a></span>
                            <span className="detail_value wordBreak">{ property.property_value}</span>
                            {property.property_key_status === 1 ? (
                                <span className="detail_status" ><img src={iconNormal} alt="iconNormal"/>{lang.normal}</span>
                                ) :(
                                <span className="detail_status" style={{"color":"#E25757"}}><img src={iconDeprecated} alt="iconDeprecated"/> {lang.deprecated}</span>
                                )}
                        </div>
                        {transaction.properties[k+1] ? (
                            <div style={{"width":"50%","display":"inline-block","verticalAlign":"top"}}>
                            <span className="detail_key wordBreak">{ transaction.properties[k+1].property_key} <a href={"/history/"+transaction.did+"/"+transaction.properties[k+1].property_key} className="did_history">{lang.history}</a></span>
                            <span className="detail_value wordBreak">{ transaction.properties[k+1].property_value}</span>
                            {transaction.properties[k+1].property_key_status === 1 ? (
                                <span className="detail_status" ><img src={iconNormal} alt="iconNormal"/>{lang.normal}</span>
                                ) :(
                                <span className="detail_status" style={{"color":"#E25757"}}><img src={iconDeprecated} alt="iconDeprecated"/> {lang.deprecated}</span>
                                )}
                            </div>
                        ):""}  
                    </li> 
            ) }
        })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li> ;
            
           

            const outputs_arr = transaction ? transaction.outputs_arr :[];
            const inputs_arr = transaction ? transaction.inputs_arr : [];
            if(transaction){
                transaction.show_more_output = transaction.show_more_output ? transaction.show_more_output : false;
                transaction.show_more_text_output = transaction.show_more_output ? "show_less" : "show_more"

                transaction.show_more_input = transaction.show_more_input ? transaction.show_more_input : false;
                transaction.show_more_text_input = transaction.show_more_input ? "show_less" : "show_more"
     
            }
           
            const outputHtml = (outputs_arr.length > 0 ) ? (outputs_arr.map((output,k1)=>{
                if(output.address){
                    if(transaction.show_more_output || k1 < 5){
                        return(
                            <li key= {k1}  style={{"display": "block","width":"100%","height":"45px","padding":"0","lineHeight":"45px","border":"1px #ccc solid","borderRadius":"5px","paddingLeft":"15px","marginBottom":"10px"}}>
                                <a   href={"/address_info/"+output.address}><span className="detail_value wordBreak" style={{"color":"#31B59D","display":"inline","fontSize":"14px"}}>{output.address}</span></a>
                                <span style={{"float": "right",
        "padding": "0",
        "color": "#31B59D",
        "marginRight":"10px"}}> {parseFloat(parseFloat(output.value).toFixed(8))} ELA</span>
                            </li>
                        )
                    }
 
                }
            })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li>;

            const inputHtml = (inputs_arr.length > 0 ) ? (inputs_arr.map((input,k2)=>{
                
                if(input.address){
                    if(transaction.show_more_input || k2 < 5){
                        return(
                                
                                <li key= {k2} style={{"display": "block","width":"100%","height":"45px","padding":"0","lineHeight":"45px","border":"1px #ccc solid","borderRadius":"5px","paddingLeft":"15px","marginBottom":"10px"}}>
                                     <a  href={"/address_info/"+input.address}><span className="detail_value wordBreak" style={{"color":"#31B59D","display":"inline","fontSize":"14px"}}>{input.address}</span></a>
                                    <span style={{"float": "right",
        "padding": "0",
        "color": "#31B59D",
    "marginRight":"10px"}}>{parseFloat(parseFloat(input.value).toFixed(8))} ELA</span>
                            </li>
                        )
                    }
                }
            })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li>;
           
            
          
        const transHtml = (transaction) ? 
            
                <div className="transaction_summery" >
                    <ul>
                        <li style={{"width":"100%","border":"none"}}>
                            <span style={{"display":"inline"}}>TxID:</span>
                            <a href={"/transaction_detail/"+ transaction.txid}><span style={{"display":"inline","color":"rgb(49, 181, 157)"}} className="detail_key wordBreak">
                            {transaction.txid ? transaction.txid : "..."}</span>
                            </a>
                        </li>
                    </ul>
                    <ul>
                        <div style={{"width":"45%","display": "inline-block","verticalAlign":"top"}}>
                        {inputHtml}
                        {inputs_arr.length > 5 && <li style={{
                                                                
                            "width": "100%",
                            "height": "45px",
                            "padding": "0px 0px 0px 15px",
                            "lineHeight": "45px",
                            "borderRadius": "5px",
                            "marginBottom": "10px",
                            "textAlign": "center"
                            
                                                        }}><span style={{
                                                            "padding": "0",
                            "margin": "0",
                            "width": "90px",
                            "height": "35px",
                            "lineHeight":"35px",
                            "margin": "0 auto",
                            "textAlign": "center",
                            "color":"#31B59D",
                            "cursor":"pointer",
                            "border":"1px solid rgb(204, 204, 204)",
                            "fontWeight":"800",
                            "borderRadius":"5px",
    
                                 }} onClick={()=>{transaction.show_more_input = transaction.show_more_input === true ? false : true; this.setState({})}}>{lang[transaction.show_more_text_input]}</span></li>}
                        

                        </div>
                        <div style={{"width":"10%","display": "inline-block","verticalAlign":"top","textAlign":"center","height":"45px","lineHeight":"45px"}}><img src={to} alt = "to"/></div>
                        <div style={{"width":"45%","display": "inline-block","verticalAlign":"top"}}>

                            {outputHtml}
                            {outputs_arr.length > 5 &&<li style={{
                                            
        "width": "100%",
        "height": "45px",
        "padding": "0px 0px 0px 15px",
        "lineHeight": "45px",
        "borderRadius": "5px",
        "marginBottom": "10px",
        "textAlign": "center"
        
                                    }}><span style={{
                                        "padding": "0",
        "margin": "0",
        "width": "90px",
        "height": "35px",
        "lineHeight":"35px",
        "margin": "0 auto",
        "textAlign": "center",
        "color":"#31B59D",
        "cursor":"pointer",
        "border":"1px solid rgb(204, 204, 204)",
        "fontWeight":"800",
        "borderRadius":"5px",
    
                                }} onClick={()=>{transaction.show_more_output = transaction.show_more_output === true ? false : true; this.setState({})}}>{lang[transaction.show_more_text_output]}</span></li>}
                        
                        </div>
                        
                    </ul>
                    <ul style={{"height":"90px"}}>
                       {/*<li style={{"width":"20%","borderBottom":"none","verticalAlign":"top"}}>
                            <span className="detail_key wordBreak">{lang.number}</span>
                            <span className="detail_value wordBreak"> {(transaction.values - transaction.fee ) / 100000000} ELA</span>
                        </li>*/} 
                        <li style={{"width":"40%","borderBottom":"none","verticalAlign":"top","float":"right"}}>
                            <span className="trx_bottom">{lang.number} : {transaction.value_output  ? parseFloat((transaction.value_output / 100000000).toFixed(8)) : "..." } ELA</span>
                            {/*<span style={{"marginRight":"20px"}}className="trx_bottom">{lang.confirmations} : {transaction.confirmations ? transaction.confirmations  : '...' }</span>*/}
                        </li>
                    </ul>
                </div> 
        : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li> ;
        return (
            <div className="container">
                <div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.transactions}</span></div>
                    <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>
                </div>
                <div className="transaction_title">
                    <span id="foo">{txid}</span>
                    <Clipboard lang = {lang} eleId = "foo" icon = {iconCopy} style={{"marginBotton":"5px","padding":"3px"}}/>

                </div>
                <div className="transaction_summery">
                    <ul>
                        <li>
                            <span className="detail_key wordBreak">{lang.confirmations}</span>
                            <span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{transaction && transaction.confirmations ? transaction.confirmations  : '...' } </span>
                        </li>
                        <li>
                            <span className="detail_key wordBreak">{lang.did_event_included}</span>
                            <span className="detail_value wordBreak">{transaction ?( isEvent ? lang.yes : lang.no) :'...'}</span>
                        </li>
                        <li>
                            <span className="detail_key wordBreak">{lang.time}</span>
                            <span className="detail_value wordBreak">{transaction && transaction.blocktime ? moment.unix(transaction.blocktime).format('YYYY-MM-DD HH:mm:ss') : "..."}</span>
                        </li>
                        <li>
                            <span className="detail_key wordBreak">{lang.block_height}</span>
                            <span className="detail_value wordBreak"> {transaction && transaction.height ? transaction.height : "..."}</span>
                        </li>
                        <li>
                            <span className="detail_key wordBreak">{lang.fee}</span>
                            <span className="detail_value wordBreak">{transaction && transaction.fee ? parseFloat((transaction.fee / 100000000).toFixed(8)) : "..."} ELA</span>
                        </li>
                    </ul>
                </div>
                
                    {transHtml}
                

                <div className="did_content">
                    <ul>
                        <li>
                            <span className="detail_key wordBreak">DID</span>
                            {transaction ?
                                <a style={{"color":"rgb(49, 181, 157)"}} href = {"/did_detail/"+ transaction.did}><span  className=" wordBreak">{transaction.did}</span></a>

                                : "..."}
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
                <div className="transaction_title" style={{    "marginTop": "40px"}}>
                    <span> {lang.primitive_memo_binary}</span>
                </div>
                <div className="did_content">
                    <ul>
                        <li className="wordBreak">{transaction ? transaction.memo : "..."}</li>
                    </ul>
                </div>  

            </div>
        );
    }
}

export default TransactionDetail;