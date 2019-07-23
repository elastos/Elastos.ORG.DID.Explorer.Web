
import React from 'react';
import { getAddressInfo, getCurrentHeight, getTransactionsCountFromAddress } from '../request/request';
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
            const info = await getAddressInfo(address,start,size)
            console.log(info)
            this.setState({
                transactions:info,
            })
            const currentHeight = await getCurrentHeight();
            this.setState({
                currentHeight:currentHeight[0].height
            })
            const count = await getTransactionsCountFromAddress(address);
            console.log(count)
             this.setState({
                count:count[0].count,
                loading:false
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
        const { transactions, loading, currentHeight, count, size, current } = this.state;
        console.log(currentHeight)
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
            //console.log(inputs_arr)
            const outputHtml = (outputs_arr.length > 0 ) ? (outputs_arr.map((output,k)=>{
                if(output){
                    return(
                        <li style={{"display": "block","width":"100%","height":"45px","padding":"0","lineHeight":"45px","border":"1px #ccc solid","borderRadius":"5px","paddingLeft":"15px","marginBottom":"10px"}}>
                            <a  key= {k} href={"/address_info/"+output}><span className="detail_value wordBreak" style={{"color":"#31B59D","display":"inline","fontSize":"14px"}}>{output}</span></a>
                            <span></span>
                        </li>
                    )
                }
            })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li>;

            const inputHtml = (inputs_arr.length > 0 ) ? (inputs_arr.map((input,k)=>{
                if(input){
                    return(
                            
                            <li style={{"display": "block","width":"100%","height":"45px","padding":"0","lineHeight":"45px","border":"1px #ccc solid","borderRadius":"5px","paddingLeft":"15px","marginBottom":"10px"}}>
                                 <a key= {k} href={"/address_info/"+input}><span className="detail_value wordBreak" style={{"color":"#31B59D","display":"inline","fontSize":"14px"}}>{input}</span></a>
                            </li>
                            
                        )
                }
            })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li>;
           return(
                <div className="transaction_summery" key = {k}>
                    <ul>
                        <li style={{"width":"100%","border":"none"}}>
                            <span style={{"display":"inline"}}>TxID:</span><a href={"/transaction_detail/"+ transaction.txid}><span style={{"display":"inline","color":"rgb(49, 181, 157)"}} className="detail_key wordBreak">{transaction.txid}</span></a>
                        </li>
                        <li style={{"padding":"0px 0px 20px 0px"}}>
                            <span style={{"color":"#364458","display":"inline","background":"#E7F1FF","borderRadius":"4px","padding":"4px 10px","marginRight":"20px"}}>{lang.block_height}: {transaction.height}</span>
                            <span style={{"color":"#364458","display":"inline","background":"#E7F1FF","borderRadius":"4px","padding":"4px 10px"}}>{lang.timestamp}: {moment.unix(transaction.createTime).format('YYYY-MM-DD hh:mm:ss')}</span>
                        </li>
                    </ul>
                    
                    <ul>
                        <div style={{"width":"45%","display": "inline-block","verticalAlign":"top"}}>{inputHtml}</div>
                        <div style={{"width":"10%","display": "inline-block","verticalAlign":"top","textAlign":"center","height":"45px","lineHeight":"45px"}}><img src={to} alt = "to"/></div>
                        <div style={{"width":"45%","display": "inline-block","verticalAlign":"top"}}>{outputHtml}</div>
                        
                    </ul>
                    <ul>
                        <li style={{"width":"20%","borderBottom":"none","verticalAlign":"top"}}>
                            <span className="trx_bottom" style={{"float":"left","background":"#EAEEF4","color":"#364458"}}>{lang.fee} : { transaction.fee / 100000000} ELA</span>
                            
                        </li>
                        <li style={{"width":"40%","borderBottom":"none","verticalAlign":"top","float":"right"}}>
                            <span className="trx_bottom">{lang.number} : {(transaction.value - transaction.fee ) / 100000000} ELA</span>
                            <span style={{"marginRight":"20px"}}className="trx_bottom">{lang.confirmations} : {currentHeight ? (currentHeight - transaction.height + 1) : '...' }</span>
                        </li>
                    </ul>
                </div> 
            )
        })) : <li style={{"textAlign":"center"}}>{loading ? <img src={loadingImg} alt="loading"/> : <span>{lang.not_found}</span>}</li> ;
        return (
            <div className="container">
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
                            <span className="detail_key wordBreak">{lang.transaction_count}</span>
                            <span className="detail_value wordBreak">{count}</span>
                        </li>
                	</ul>
                </div>
               
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