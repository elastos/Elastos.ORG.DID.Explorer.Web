import React from 'react';
import { getTransactions , getTransactionsCount, getTransactionsInfo } from '../request/request';
import {Link} from 'react-router-dom';
import { Pagination } from 'antd';
import './eapp.css';

import Search from './elements/Search'
import loadingImg from '../public/images/loading.gif';
import iconLeft from '../public/images/icon-left.svg'
import iconRight from '../public/images/icon-right.svg'
import okb_mid from '../public/images/okb_mid.png'
class EApps extends React.Component {
     constructor(props){
        super(props);
        this.state = {
            count:0,
            size: 10,
            current:1,
            transactions:[],
            loading:true
        }
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount (){
        const { current, size }= this.state;
        this.GetInfo(current,size);
       
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
    
    GetInfo = async (current,size) => {
        try{
            
            const start = ( current - 1) * size;
            const transactions = await getTransactions(start,size);
            this.setState({
                transactions:transactions               
            })
            Object.keys(transactions).map((transaction,k) => {
                return this.GetTransactionsInfo(k,transactions[k].txid)                
            });
            const count = await getTransactionsCount();
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
        const { size }= this.state;
        this.GetInfo(pageNumber,size);
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
        return <a><img src={iconLeft}/></a>;
      } if (type === 'next') {
        return <a><img src={iconRight}/></a>;
      }
      return originalElement;
    }
    render() {
        const { transactions, count, size, current, loading } = this.state;
        const  lang  = this.props.lang;
        const txHtml = transactions.map((tx,k) => {
            return(
                <tr className="ant-table-row ant-table-row-level-0 table_tr" data-row-key="1" key={k}>
                    <td width="20%"><Link to={'/eapp_detail/'+tx.did}>
                    	<img src={okb_mid}/><span style={{"paddingLeft":"5px"}}>ENBank</span>
                    </Link></td>
                    <td width="40%">elaapp: fhsuiwhegbwhjfksjtivhjrqgvhfieuvw</td>
                    <td width="20%">
	                    <Link to={'#'}><span style={{"padding":"0px 10px"}}>Website</span></Link>
	                    <Link to={'#'}><span style={{"padding":"0px 10px"}}>Privacy</span></Link>
	                  	<Link to={'#'}><span style={{"padding":"0px 10px"}}>Notification</span></Link>
                    </td>
                    <td width="20%">
                    	<Link to={'#'}><span style={{"padding":"2px 20px","border":"1px #4F92D0 solid","borderRadius":"15px","color":"#4F92D0"}}>iOS</span></Link>
	                    <Link to={'#'}><span style={{"padding":"2px 20px","border":"1px #31B59D solid","borderRadius":"15px","color":"#31B59D","marginLeft":"10px"}}>Android</span></Link>
	                  	<Link to={'#'}><span style={{"padding":"2px 20px","border":"1px #9471DE solid","borderRadius":"15px","color":"#9471DE","marginLeft":"10px"}}>H5 App</span></Link>
	                  	<Link to={'#'}><span style={{"padding":"2px 20px","border":"1px #D3955B solid","borderRadius":"15px","color":"#D3955B","marginLeft":"10px"}}>Web App</span></Link>
                    </td>
                </tr>
            )
        });
        return (
                <div className="container">
                    <div className = "list_top" >
                        <div className = "list_title"><span style={{"fontSize":"25px"}}>EApps</span></div>
                        <div className = "list_search"><Search button="false" name="list"/></div>

                    </div>
                    <div className="ant-table ant-table-default ant-table-scroll-position-left">
                        <div className="ant-table-content">
                            <div className="ant-table-body" >
                                <table className="did_list_table">
                                    <thead className="ant-table-thead">
                                        <tr>
                                            <th  width="20%">
                                                <span>Name</span>
                                            </th>
                                            <th  width="40%">
                                                <span>App ID</span>
                                            </th>
                                            <th  width="20%">
                                                <span>URLs</span>
                                            </th>
                                            <th  width="20%">
                                                <span>Apps</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="ant-table-tbody">
                                        {txHtml}
                                    </tbody>
                                </table>
                                <div style={{"marginTop":"50px","textAlign":"center"}}>
                                    {count != 0 && <Pagination defaultCurrent={current} total={count} defaultPageSize = {size} onChange={this.onChange}  itemRender={this.itemRender}
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

export default EApps;