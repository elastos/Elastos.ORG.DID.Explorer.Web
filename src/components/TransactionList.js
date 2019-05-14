import React from 'react';
import { getTransactions , getTransactionsCount, getTransactionsInfo, getTransactionsFromHeight, getTransactionsCountFromHeight } from '../request/request';
import {Link} from 'react-router-dom';
import { Pagination } from 'antd';
import './transactionList.css';
import Search from './elements/Search'
import loadingImg from '../public/images/loading.gif';
import iconLeft from '../public/images/icon-left.svg'
import iconRight from '../public/images/icon-right.svg'
class TransactionList extends React.Component {
     constructor(props){
        super(props);
        this.state = {
            count:0,
            size: 10,
            current:1,
            transactions:[],
            transaction_num : {},
            loading:true,
            height:null
        }
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount (){
        console.log(this.props.name)
        console.log(this.props.blockHeight)
       if(this.props.name === "block_detail" && this.props.blockHeight) {
            console.log("truesss")
            this.setState({
                height: this.props.blockHeight,
                size: 4,
            })
        }
        const height = this.props.blockHeight;
        const size = height ? 4 : this.state.size;
        const { current }= this.state;
        this.GetInfo(current,size,height);
    }
     componentDidMount(){
        const lang = localStorage.getItem("lang");
        var div = document.getElementsByClassName("ant-pagination-options-quick-jumper");
        if (lang === "en" && typeof div[0] != "undefined") {
            div[0].childNodes[0].data = "Goto" 
        }
        if(lang === "cn" && typeof div[0] != "undefined"){
            div[0].childNodes[0].data = "跳转" 
        } 
    }
    GetInfo = async (current, size, height) => {
        console.log("height = " + height)
        try{
            const start = ( current - 1) * size;
            const transactions = height ? await getTransactionsFromHeight(height,start,size) : await getTransactions(start,size);
            console.log(transactions)
            this.setState({
                transactions:transactions
            })
            let obj={}
            Object.keys(transactions).map((transaction,k) => {
                let num = obj[transactions[k].height] || 0
                obj[transactions[k].height] = num + 1
                return this.GetTransactionsInfo(k,transactions[k].txid)                
            });
            this.setState({
                transaction_num: obj 
            })
            const count = height ? await getTransactionsCountFromHeight(height) : await getTransactionsCount();
            if(height) this.props.setTransCount(count[0].count);
             this.setState({
                count:count[0].count,
                loading:false
            })
        }catch(err){
          console.log(err)
        }
    }
    GetTransactionsInfo = async (k,txid)=>{
        try{
            const transaction = await getTransactionsInfo(txid);
            let transactions = this.state.transactions;
            transactions[k].createTime = transaction[0].createTime;
            transactions[k].length_memo = transaction[0].length_memo;
            transactions[k].fee = transaction[0].fee;
            this.setState({transactions:transactions})
        }catch(err){
            console.log(err)
        }
    }
    onChange(pageNumber) {
        this.setState({
            loading:true,
            current : pageNumber
        })
        const { size, height }= this.state;
        this.GetInfo(pageNumber, size, height);
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
      if (type === 'prev') {
        return <a href="#"><img src={iconLeft} alt="icon-left"/></a>;
      } if (type === 'next') {
        return <a href="#"><img src={iconRight} alt="icon-right"/></a>;
      }
      return originalElement;
    }
    render() {
        const { transactions, count, size, current, loading, transaction_num} = this.state;
        const  {lang, name}  = this.props;
        //console.log(transactions)
        const txHtml = transactions.map((tx,k) => {
            let num = transaction_num[tx.height];
            let height = num * 64 - 40 + "px"
            let height1 = transactions[k-1] ? transactions[k-1].height : 0;
            return(
                <tr className="ant-table-row ant-table-row-level-0 table_tr1" data-row-key="1" key={k}>
                    <td width="30%"><Link to={'/transaction_detail/'+tx.txid}>{tx.txid}</Link></td>
                    <td width="40%"><span></span></td>
                    <td width="10%" style={{"position":"relative"}}>
                        { tx.height !== height1 &&  num > 1 && <div style={{"width":"5px","height":height,"background": "linear-gradient(180deg, #1DE9B6 0%, #02C67F 100%)","borderRadius": "4px","position":"absolute","left":"35px"}}></div>}
                    <span style={{"paddingLeft":"20px"}}>{tx.height}</span></td>
                    <td width="10%"><span>{tx.fee}</span></td>
                    <td width="10%"><span>{tx.createTime ? this.timestampToTime(tx.createTime) : "" }</span></td>
                </tr>
            )
        });
        return (
                <div className="container">
                     <div className = "list_top" >
                     
                        <div className = "list_title"><span style={{"fontSize":"25px"}}>{name === "block_detail" ? "Transactions in this Block " : "Transactions"}</span></div>
                        {name === "block_detail" || <div className = "list_search"><Search button="false" name="list"/></div>}

                    </div>
                    <div className="ant-table ant-table-default ant-table-scroll-position-left">
                        <div className="ant-table-content">
                            <div className="ant-table-body">
                                <table className="transaction_list_table">
                                    <thead className="ant-table-thead">
                                        <tr>
                                            <th className="">
                                                <div>TxID</div>
                                            </th>
                                            <th className="">
                                                <div>DID Event Included</div>
                                            </th>
                                            <th className="">
                                                <div>Height</div>
                                            </th>
                                            <th className="">
                                                <div>Fee</div>
                                            </th>
                                            <th className="">
                                                <div>Time</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="ant-table-tbody">
                                        {txHtml}
                                    </tbody>
                                </table>
                                <div style={{"marginTop":"50px","textAlign":"center"}}>
                                    
                                    {count !== 0 && <Pagination defaultCurrent={current} total={count} defaultPageSize = {size} onChange={this.onChange}  itemRender={this.itemRender}
                                        style={{"width":"100%","height":"50px","textAlign":"center"}}
                                    />}
                                    {loading && <img src={loadingImg} alt="loading"/>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default TransactionList;