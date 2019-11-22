
import React from 'react';
import { getAddressInfo, getCurrentHeight, getTransactionsCountFromAddress, getDidFromTxid, getValueFromAddressAndTxid, getAddressBalance, getAddressInfoFromNodeApi, getTransactionInfoFromNodeApi} from '../request/request';
import './transactionDetail.css'
import Search from './elements/Search'
import { Pagination } from 'antd';
import Clipboard from './elements/Clipboard';
import iconCopy from '../public/images/icon-copy.svg'
import iconDeprecated from '../public/images/icon-deprecated.svg'
import iconNormal from '../public/images/icon-normal.svg'
import confirmed from '../public/images/confirmed.svg'
import loadingImg from '../public/images/loading.gif';
import iconLeft from '../public/images/icon-left.svg'
import iconRight from '../public/images/icon-right.svg'
import to from '../public/images/to.png';
import moment from 'moment'
class AddressInfo extends React.Component {
	constructor(props){
        super(props);
        this.state = {
          count:0,
          transactions:[],
          loading:true ,
          currentHeight:null,
          size: 10,
          current:1,
          did:null,
          balance:null,
          isNodeApi:false
          
        }
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount (){
        const { current, size }= this.state;
        this.GetInfo(current,size);
    }
    GetInfo = async (current,size) => {
         try{
            const start = ( current - 1) * size;
            const address = this.props.match.params.address;
            
            if(this.state.isNodeApi){
                var addressInfo = await getAddressInfoFromNodeApi(address,start,size)
                var transactions = addressInfo.result.History;
            }else{
                var addressInfo = await getAddressInfo(address,start,size) 
                var transactions = addressInfo  
            }



            //
            console.log(addressInfo)
            
            this.setState({
                transactions:transactions,
            })
            if(transactions.length > 0){
                const getDid = await getDidFromTxid(transactions[0].Txid)
                if(getDid.length > 0){
                     this.setState({
                        did:getDid[0].did,
                    })
                }
               
            }
            Object.keys(transactions).map((transaction,k) => {
                return this.getTxInfo(k,transactions);               
            })
           
            const rs = await getAddressBalance(address);
            console.log(typeof rs)
            console.log(rs.result)
            if(rs.status === 200){
                this.setState({
                    balance :rs.result
                })
            }else{
                this.setState({
                    balance :"..."
                })
            }
           
            const currentHeight = await getCurrentHeight();
            this.setState({
                currentHeight:currentHeight[0].height
            })
            let count = await getTransactionsCountFromAddress(address);
            console.log(count)
            this.setState({
                count:count[0].count,
                loading:false
            })
        }catch(err){
          console.log(err)
        }
    }
    getTxInfo = async (k,transactions)=>{
        try{
            
            if(this.state.isNodeApi){
                var txInfo = await getTransactionInfoFromNodeApi(transactions[k].Txid);
                console.log("nodeapi")
                var address = transactions[k].Inputs[0];
                
            }else{
                var txInfo = await getTransactionInfoFromNodeApi(transactions[k].txid);
console.log("notenodeapi")
console.log(transactions[k].inputs)
                
                transactions[k].Txid = transactions[k].txid;
                transactions[k].Height = transactions[k].height
                transactions[k].CreateTime = transactions[k].createTime;
                transactions[k].Fee = transactions[k].fee;
                transactions[k].Type =transactions[k].type
                transactions[k].Value =transactions[k].value
                var address = transactions[k].inputs.split(',')[0];
            }
            console.log(address)
            transactions[k].vout = txInfo.result.vout;
            transactions[k].vin = txInfo.result.vin;
            transactions[k].outputs_arr = txInfo.result.vout;
            transactions[k].confirmations = txInfo.result.confirmations;
            var inputs_arr = []
            var value_input = 0;
            var value_output = 0;
            var value_fee = parseFloat(transactions[k].Fee)
            transactions[k].vout.map((v1,k1)=>{
                value_output = (value_output + parseFloat(v1.value) * 100000000);
            })
            transactions[k].value_output = value_output;

            value_input = value_fee + value_output;
            if(transactions[k].Type === "income" ){
                console.log(transactions[k].vin[0].txid)
                const inputInfo = await getTransactionInfoFromNodeApi(transactions[k].vin[0].txid);
                console.log(inputInfo)
                inputInfo.result.vout.map((v2,k2)=>{
                    if(v2.address === address ){
                        value_input = parseFloat(v2.value) * 100000000
                        transactions[k].Fee = parseFloat((value_input - value_output).toFixed(8));
                    }
                })
            }
            inputs_arr.push({"address":address,"value":value_input / 100000000})
            transactions[k].inputs_arr = inputs_arr
             
        }catch(e){
            console.log(e)
        }
    } 
    loadMoreAddressInfo(txid,type){
        console.log(txid)
        console.log(type)
        const transactions = this.state.transactions;
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
    itemRender(current, type, originalElement) {
      if (type === 'prev' ) {
        return <a href="#"><img src={iconLeft} alt = "iconleft"/></a>;
      } if (type === 'next') {
        return <a href="#"><img src={iconRight} alt = "iconright"/></a>;
      }
      return originalElement;
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
    	const address = this.props.match.params.address;
        const lang = this.props.lang;
        const { transactions, loading, currentHeight, count, size, current, did, balance } = this.state;
        var total_sent = 0;
        var total_received = 0;
       
        const txHtml = (transactions.length > 0 ) ? (transactions.map((transaction,k) => {
            if(transaction.Type === "spend"){
                total_sent =  total_sent + transaction.Value;
            }else if(transaction.Type === "income"){
                total_received =  total_received + transaction.Value;
            }
            const outputs_arr = transaction.outputs_arr || [];
            const inputs_arr = transaction.inputs_arr || [];
            console.log(inputs_arr)
            

            transaction.show_more_output = transaction.show_more_output ? transaction.show_more_output : false;
            transaction.show_more_text_output = transaction.show_more_output ? "show_less" : "show_more"

            transaction.show_more_input = transaction.show_more_input ? transaction.show_more_input : false;
            transaction.show_more_text_input = transaction.show_more_input ? "show_less" : "show_more"

            const outputHtml = (outputs_arr.length > 0 ) ? (outputs_arr.map((output,k)=>{
                if(output.address){
                    if(transaction.show_more_output || k < 5){
                        return(
                            <li key= {k}  style={{"display": "block","width":"100%","height":"45px","padding":"0","lineHeight":"45px","border":"1px #ccc solid","borderRadius":"5px","paddingLeft":"15px","marginBottom":"10px"}}>
                                <a   href={"/address_info/"+output.address}><span className="detail_value wordBreak" style={{"color":"#31B59D","display":"inline","fontSize":"14px"}}>{output.address}</span></a>
                                <span style={{"float": "right",
        "padding": "0",
        "color": "#31B59D",
        "marginRight":"10px"}}>{parseFloat(output.value) } ELA</span>
                            </li>
                        )
                    }
                }
            })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li>;

            const inputHtml = (inputs_arr.length > 0 ) ? (inputs_arr.map((input,k)=>{
                if(input.address){
                    if(transaction.show_more_input || k < 5){
                        return(
                                
                                <li key= {k} style={{"display": "block","width":"100%","height":"45px","padding":"0","lineHeight":"45px","border":"1px #ccc solid","borderRadius":"5px","paddingLeft":"15px","marginBottom":"10px"}}>
                                     <a  href={"/address_info/"+input.address}><span className="detail_value wordBreak" style={{"color":"#31B59D","display":"inline","fontSize":"14px"}}>{input.address}</span></a>
                                    <span style={{"float": "right",
        "padding": "0",
        "color": "#31B59D",
    "marginRight":"10px"}}>{parseFloat(input.value)  } ELA</span>
                            </li>
                        )
                    }
                }
            })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li>;
           return(
                <div className="transaction_summery" key = {k}>
                    <ul>
                        <li style={{"width":"100%","border":"none"}}>
                            <span style={{"display":"inline"}}>TxID:</span><a href={"/transaction_detail/"+ transaction.txid}><span style={{"display":"inline","color":"rgb(49, 181, 157)"}} className="detail_key wordBreak">{transaction.Txid ? transaction.Txid : "..."}</span></a>
                        </li>
                        <li style={{"padding":"0px 0px 20px 0px"}}>
                            <span style={{"color":"#364458","display":"inline","background":"#E7F1FF","borderRadius":"4px","padding":"4px 10px","marginRight":"20px"}}>{lang.block_height}: {transaction.Height ? transaction.Height : "..."}</span>
                            <span style={{"color":"#364458","display":"inline","background":"#E7F1FF","borderRadius":"4px","padding":"4px 10px"}}>{lang.timestamp}: {transaction.CreateTime ? moment.unix(transaction.CreateTime).format('YYYY-MM-DD hh:mm:ss') : "..."}</span>
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
                    <ul>
                        <li style={{"width":"20%","borderBottom":"none","verticalAlign":"top"}}>
                            <span className="trx_bottom" style={{"float":"left","background":"#EAEEF4","color":"#364458"}}>{lang.fee} : { transaction.Fee ? transaction.Fee / 100000000 : "..."} ELA</span>
                            
                        </li>
                        <li style={{"width":"40%","borderBottom":"none","verticalAlign":"top","float":"right"}}>
                            <span className="trx_bottom">{lang.number} : {transaction.value_output  ? transaction.value_output / 100000000: "..." } ELA</span>
                            <span style={{"marginRight":"20px"}}className="trx_bottom">{lang.confirmations} : {transaction.confirmations ? transaction.confirmations  : '...' }</span>
                        </li>
                    </ul>
                </div> 
            )
        })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li> ;
        return (
            <div className="container">
            {console.log("refresh")}
            	<div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.address}</span></div>
                    <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>
                </div>
                <div className="transaction_title">
                	<span id = "foo">{address}</span>
                	<Clipboard lang = {lang} eleId = "foo" icon = {iconCopy} style={{"marginBotton":"5px","padding":"3px"}}/>

                </div>
                <div className="transaction_summery">
                	<ul>
                		<li>
                			<span className="detail_key wordBreak">{lang.status}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}><img src={confirmed} alt = "confirmed"/> {lang.confirmed}</span>
                		</li>
                		<li>
                			<span className="detail_key wordBreak">{lang.balance}</span>
                			<span className="detail_value wordBreak">{loading ? '...' : balance} ELA</span>
                		</li>
                		<li>
                			<span className="detail_key wordBreak">{lang.total_sent}</span>
                			<span className="detail_value wordBreak">{loading ? '...' : (total_sent / 100000000)} ELA</span>
                		</li>
                		<li>
                			<span className="detail_key wordBreak">{lang.total_received}</span>
                			<span className="detail_value wordBreak"> {loading ? '...' : (total_received / 100000000) } ELA</span>
                		</li>
                		
                        <li>
                            <span className="detail_key wordBreak">{lang.transaction_count}</span>
                            <span className="detail_value wordBreak">{count}</span>
                        </li>
                	</ul>
                </div>
                {/*<div className="transaction_summery">
                    <ul>
                        <li>
                            <span className="detail_key wordBreak">DID</span>
                            <a style={{"color":"rgb(49, 181, 157)"}} href={"/did_detail/"+ did}><span className=" wordBreak" > {did ? did : "..."}</span></a>
                        </li>
                        
                    </ul>
                </div>*/}
               
				<div className="transaction_title" style={{"marginTop": "40px"}}>
                	<span> {lang.transaction_history}</span>
                </div>
               
                {txHtml}
                <div style={{"marginTop":"50px","textAlign":"center"}}>
                    {count != 0 && count > size && <Pagination defaultCurrent={current} total={count} defaultPageSize = {size} onChange={this.onChange}  itemRender={this.itemRender}
                        style={{"width":"100%","height":"50px","textAlign":"center"}}
                    />}
                    {loading && <img src={loadingImg} alt="loading"/>}
                </div>
            </div>
        );
    }
}

export default AddressInfo;