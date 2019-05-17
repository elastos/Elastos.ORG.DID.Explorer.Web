import React from 'react';
import moment from 'moment'
import { getBlocks, getBlocksInfo, getTransactionsCount, getTransactions, getTransactionsInfo, getTransactionsCountFromHeight, getServerInfo, getDids, getDidCount, getDidInfo } from '../request/request';
import './home.css'
import mask from '../public/images/mask1.png'
import background from '../public/images/background.svg'
import Search from './elements/Search'
import HashFormat from './elements/HashFormat'
import iconRight from '../public/images/icon-right.png';
import loadingImg from '../public/images/loading.gif';
import jQuery from "jquery"
class Home extends React.Component {
	constructor(props){
        super(props);
        this.state = {
           rate:0,
           click_id:null,
           blocks:[],
           transactionCount:null,
           transactions:[],
           s_time:null,
           dids:[],
           didCount:null
        }
      
    } 
    getInfo = async () => {
        try{
            const info = await getServerInfo();
            this.setState({
                s_time:moment(info.s_time)
            })
            const blocks = await getBlocks(0,40);
            var num = []
            Object.keys(blocks).map((block,k) => {
                return this.getBlockInfo(k,num,blocks)                
            });
        }catch(err){
          console.log(err)
        }
    }
    getBlockInfo = async (k,num,blocks)=>{
        try{
            const blockInfo = await getBlocksInfo(blocks[k].height);
            blocks[k].time = blockInfo[0].time;
            blocks[k].miner_info = blockInfo[0].miner_info;
            blocks[k].size = blockInfo[0].size;
            num.push(k)
            if(num.length === blocks.length){
                this.setState({blocks:blocks})
                const self = this
                setTimeout(function(self){
                    var datas1 = self.state.blocks.slice(0) ;
                    datas1.sort(function(a,b){
                       return ( a.size < b.size ? 1 : -1)
                    })
                    var rate = 260 / datas1[0].size;
                    self.setState({
                        rate:rate
                    })
                },1,self)
            }
            if(k<5){
                const count = await getTransactionsCountFromHeight(blocks[k].height);
                blocks[k].count = count[0].count;
                this.setState({blocks:blocks}) 
            }
            
        }catch(err){
            console.log(err)
        }
    }
    getTrans = async()=>{
        try{
            const count = await getTransactionsCount();
            this.setState({
                transactionCount:count[0].count
            })
            const transactions = await getTransactions(0,5);
            var num = []
            Object.keys(transactions).map((transaction,k) => {
                return this.getTransactionsInfo(k,num,transactions)                
            });
        }catch(err){
          console.log(err)
        }
    }
    getTransactionsInfo = async(k,num,transactions)=>{
        try{
            const transaction = await getTransactionsInfo(transactions[k].txid);
            transactions[k].createTime = transaction[0].createTime;
            transactions[k].length_memo = transaction[0].length_memo;
            num.push(k)
            if(num.length === transactions.length){
                this.setState({transactions:transactions})
            }
        }catch(err){
            console.log(err)
        }
    }
    getDid = async () => {
        try{
            const dids = await getDids(0,5);
            var num = []
            Object.keys(dids).map((did,k) => {
                return this.getDidsInfo(k,num,dids)                
            });
            const count = await getDidCount();
            this.setState({
                didCount:count[0].count,
            })
        }catch(err){
          console.log(err)
        }
    }
    getDidsInfo = async (k,num,dids)=>{
        try{
            const didDetail = await getDidInfo(dids[k].did)
            dids[k].txid = didDetail[0].txid;
            dids[k].height = didDetail[0].height;
            dids[k].time = didDetail[0].local_system_time;
            num.push(k);
            if(num.length === dids.length){
                this.setState({dids:dids})
            }
        }catch(err){
            console.log(err)
        }
    }
    componentWillMount(){
        moment.locale("en",{
            relativeTime : {
                future : "in %s",
                past : "%s ago",
                s : "s",
                m : "m",
                mm : "%dm",
                h : "h",
                hh : "%dh",
                d : "d",
                dd : "%dds",
                M : "M",
                MM : "%dM",
                y : "Y",
                yy : "%dY"
            }
        })
        /*moment.locale("cn",{
            relativeTime : {
                future : "%s后",
                past : "%s前",
                s : "秒",
                m : "分",
                mm : "%d 分",
                h : "小时",
                hh : "%d 小时",
                d : "天",
                dd : "%d 天",
                M : "月",
                MM : "%d 月",
                y : "年",
                yy : "%d 年"
            }
        })*/
        this.getInfo();
        this.getTrans();
        this.getDid();
        //his.getBlocks();
        console.log(moment.locale())
        document.onclick=function(){
            try{
               document.getElementById("char_info").style.display="none";
               jQuery(".char_li ").removeClass("char_clicked")
            }catch(e){}
        }
    }
    showBlockInfo(id,event){
        event.nativeEvent.stopImmediatePropagation();
        this.setState({
            click_id:id
        })
        try{ document.getElementById("char_info").style.display="block";}catch(e){}
    }

    render() {
        const {rate, blocks, click_id, transactionCount, transactions, s_time, dids, didCount} = this.state;
        const lang =this.props.lang;
        const lis = blocks.length ? blocks.map((v,k)=>{
            let style = {
                "right": k*2.55 +"%",
                "height": typeof v.size === "number" ? v.size * rate : 0 +"px"
            }
            return <li className= {click_id === k ? "char_li char_clicked" : "char_li" } key= {k} style={style} 
            onClick={(e)=>{e.nativeEvent.stopImmediatePropagation();}} 
            onMouseOver={this.showBlockInfo.bind(this,k)}>

                {click_id === k && <div className = "char_info" id="char_info">
                    <span>{v.height}</span>
                    <span>{lang.block_size}: {v.size} bytes</span>
                </div>}
            </li> 
        }): <img src={loadingImg} style={{"marginTop":"150px"}} alt="loadingImg"/>  
        const item_blocks = blocks.length ? blocks.map((v,k)=>{
            if(k<5){
                return <li key= {k}>
                        <div><a href={"/block_detail/"+v.height}><span>{v.height}</span></a><span className="txns">{v.count ? v.count + "Txns" : "..." }</span></div>
                        <div><span>{v.size} bytes </span><span className="time">{s_time ? moment(v.time * 1000).from(s_time) : "..."}</span></div>
                    </li>
            }else{
                return "";
            }
            
        }) : <img src={loadingImg} style={{"margin":"160px 110px"}} alt="loadingImg"/>
        const item_transactions = transactions.length ? transactions.map((v,k)=>{
            if(k<5){
                return <li key= {k}>
                        <div><a href={"/transaction_detail/"+v.txid}><HashFormat text = {v.txid} width = "70%"/></a><span className="time">{s_time ? moment(v.createTime * 1000).from(s_time) : "..."}</span></div>
                    </li>
            }else{
                return "";
            }
            
        }) : <img src={loadingImg} style={{"margin":"160px 110px"}} alt="loadingImg"/>
        const item_dids = dids.length ? dids.map((v,k)=>{
            if(k<5){
                return <li key= {k}>
                        <div><a href={"/did_detail/"+v.did}><HashFormat text = {v.did} width = "70%"/></a><span className="time">{s_time ? moment(v.time).from(s_time) : "..."}</span></div>
                        <div>Register ELA DID</div>
                    </li>
            }else{
                return "";
            }

        }) : <img src={loadingImg} style={{"margin":"160px 110px"}} alt="loadingImg"/>
    	return (
    		<div className="content">
                <div className="container container_banner">
                    <img className="banner" src={background} alt="background"/>
                    <div className="banner_title">
                        <h1 className="title">{lang.ELA_DID_Explorer}</h1>
                    </div>
                    <div className="banner_search">
                        <Search button="true" name="home" lang={lang}/>
                    </div>
                </div>
                <div className="container container_summary">
                    <div className="summary">
                        <ul>
                            <li>
                                <div className="summary_title">
                                    <span>{lang.total_ela_did}</span>
                                    <img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/>
                                </div>
                                <div className="summary_content">
                                    <span>{didCount ? didCount : "..."}</span>
                                </div>
                            </li>
                            <li className="has_border">
                                <div className="summary_title">
                                    <span>{lang.total_transactions}</span>
                                    <img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/>
                                </div>
                                <div className="summary_content">
                                    <span>{transactionCount ? transactionCount : "..."}</span>
                                </div>
                            </li>
                            <li className="has_border">
                                <div className="summary_title">
                                    <span>{lang.block_height}</span>
                                    <img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/>
                                </div>
                                <div className="summary_content">
                                    <span>{blocks.length ? blocks[0]["height"] : "..."}</span>
                                </div>
                            </li>
                            <li className="has_border">
                                <div className="summary_title">
                                    <span>{lang.total_eApps}</span>
                                    <img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/>
                                </div>
                                <div className="summary_content">
                                    <span>...</span>
                                </div>
                            </li>
                        </ul>


                    </div>  


                </div>

                <div className="container container_char" >
                    <ul className="char_ul" >
                       {lis}
                    </ul>
                </div>
                <div className="container container_items">
                    <ul>
                        <li className="item" style={{"marginRight":"4%"}}>
                            <div className="item_title">
                                <h4>ELA DID EVENTS</h4>
                                <a href="/ela_did">{lang.view_more}</a>
                            </div>
                            <div className="item_content">
                                <ul>
                                   {item_dids}
                                </ul>
                            </div>
                        </li>
                        <li className="item" style={{"marginRight":"4%"}}>
                            <div className="item_title">
                                <h4>{lang.transactions_c}</h4>
                                <a href="/transactions">{lang.view_more}</a>
                            </div>
                            <div className="item_content">
                                <ul>
                                    {item_transactions}
                                </ul>
                            </div>
                        </li>
                        <li className="item" style={{"marginRight":"4%"}}>
                            <div className="item_title">
                                <h4>{lang.blocks_c}</h4>
                                <a href="/blocks">{lang.view_more}</a>
                            </div>
                            <div className="item_content">
                                <ul>
                                  {item_blocks}
                                </ul>
                            </div>
                        </li>
                        <li className="item">
                            <div className="item_title">
                                <h4>EAPPS</h4>
                                <a href="/eapps">{lang.view_more}</a>
                            </div>
                            <div className="item_content">
                                <ul>
                                    <li>
                                        <img src={mask} alt="mask"/>
                                        <span>ENBank</span>
                                        <span className="time">17m ago</span>
                                    </li>
                                    <li>
                                        <img src={mask} alt="mask"/>
                                        <span>ENBank</span>
                                        <span className="time">17m ago</span>
                                    </li>
                                    <li>
                                        <img src={mask} alt="mask"/>
                                        <span>ENBank</span>
                                        <span className="time">17m ago</span>
                                        
                                    </li>
                                    <li>
                                        
                                        <img src={mask} alt="mask"/>
                                        <span>ENBank</span>
                                        <span className="time">17m ago</span>
                                    </li>
                                    <li>
                                        
                                        <img src={mask} alt="mask"/>
                                        <span>ENBank</span>
                                        <span className="time">17m ago</span>
                                    </li>

                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
    	)
    }
}

export default Home;