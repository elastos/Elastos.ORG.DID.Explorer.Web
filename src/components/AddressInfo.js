
import React from 'react';
import { getAddressInfo } from '../request/request';
import './transactionDetail.css'
import Search from './elements/Search'
import Clipboard from './elements/Clipboard';
import iconCopy from '../public/images/icon-copy.svg'
import iconDeprecated from '../public/images/icon-deprecated.svg'
import iconNormal from '../public/images/icon-normal.svg'
import confirmed from '../public/images/confirmed.svg'
import loadingImg from '../public/images/loading.gif';
class AddressInfo extends React.Component {
	constructor(props){
        super(props);
        this.state = {
          transactions:[],
          loading:true ,
        }
    }
    componentWillMount (){
        this.GetInfo();
    }
    GetInfo = async () => {
         try{
            const address = this.props.match.params.address;
            const info = await getAddressInfo(address)
            console.log(info)
            this.setState({
                transactions:info,
                loading:false
            })
        }catch(err){
          console.log(err)
        }
    }

     componentWillReceiveProps(nextProps) {
        this.GetInfo();
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
    	const address = this.props.match.params.address;
        const lang = this.props.lang;
        const { transactions, loading } = this.state;
        var total_sent = 0;
        var total_received = 0;
        var balance = 0;
        const txHtml = (transactions.length > 0 ) ? (transactions.map((transaction,k) => {
            if(transaction.type === "spend"){
                total_sent =  total_sent + transaction.value;
                balance = balance - transaction.value
            }else if(transaction.type === "income"){
                total_received =  total_received + transaction.value;
                 balance = balance + transaction.value
            }
            const outputs_arr = transaction.outputs.split(',');
            const inputs_arr = transaction.inputs.split(',');
            console.log(inputs_arr)
            const outputHtml = (outputs_arr.length > 0 ) ? (outputs_arr.map((output,k)=>{
                if(output){
                    return(
                        <a  key= {k} href={"/address_info/"+output}><span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{output}</span></a>
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
                                <span className="detail_value wordBreak">{transaction.value / 100000000} ELA</span>
                            </li>
                        </ul>)
                }
            })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li>;
           return(
                <div className="transaction_summery" key = {k}>
                    <ul>
                        <li style={{"width":"100%"}}>
                            <span className="detail_key wordBreak">TxID: {transaction.txid}</span>
                        </li>
                    </ul>
                    {inputHtml}
                </div> 
            )
        })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li> ;;
        return (
            <div className="container">
            	<div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.address}</span></div>
                    <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>
                </div>
                <div className="transaction_title">
                	<span id = "foo">{address}</span>
                	<Clipboard eleId = "foo" icon = {iconCopy} style={{"marginBotton":"5px","padding":"3px"}}/>

                </div>
                <div className="transaction_summery">
                	<ul>
                		<li>
                			<span className="detail_key wordBreak">{lang.status}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}><img src={confirmed} alt = "confirmed"/> Confirmed</span>
                		</li>
                		<li>
                			<span className="detail_key wordBreak">{lang.balance}</span>
                			<span className="detail_value wordBreak">{loading ? '...' : (balance / 100000000)} ELA</span>
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
                			<span className="detail_key wordBreak">{lang.fee}</span>
                			<span className="detail_value wordBreak">{ "..."} ELA</span>
                		</li>
                        <li>
                            <span className="detail_key wordBreak"># of Transactions</span>
                            <span className="detail_value wordBreak">{ transactions.length}</span>
                        </li>
                	</ul>
                </div>
                <div className="transaction_summery" >
                	<ul>
                		<li style={{"width":"40%"}}> 
                			<span className="detail_key wordBreak">{lang.from}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{"..."}</span>
                		</li>
                		<li style={{"width":"40%"}}>
                			<span className="detail_key wordBreak">{lang.to}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{"..."}</span>
                		</li>
                        <li style={{"width":"20%"}}>
                            <span className="detail_key wordBreak">{lang.number}</span>
                            <span className="detail_value wordBreak">{"..."} ELA</span>
                        </li>
                		<li style={{"width":"40%"}}>
                			<span className="detail_key wordBreak">{lang.from}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{ "..."}</span>
                		</li>
                		<li style={{"width":"40%"}}>
                			<span className="detail_key wordBreak">{lang.to}</span>
                			<span className="detail_value wordBreak" style={{"color":"#31B59D"}}>{"..."}</span>
                		</li>
                        <li style={{"width":"20%"}}>
                            <span className="detail_key wordBreak">{lang.number}</span>
                            <span className="detail_value wordBreak">{"..."} ELA</span>
                        </li>
                	</ul>
                </div>
				<div className="transaction_title" style={{"marginTop": "40px"}}>
                	<span> {lang.transaction_history}</span>
                </div>
               
                {txHtml}
            </div>
        );
    }
}

export default AddressInfo;