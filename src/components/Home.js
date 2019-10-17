import React from 'react';
import moment from 'moment'
import { getBlocks, getBlocksInfo, getTransactionsCount, getTransactions, getTransactionsInfo, getTransactionsCountFromHeight, getServerInfo, getDids, getDidCount, getDidInfo, getEapps, getEappsCount, getDidsIndex } from '../request/request';
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
           didCount:null,
           eapps:[],
           eappsCount:null
        }
      
    } 
    getInfo = async () => {
        try{
            const info = await getServerInfo();
            this.setState({
                s_time:info.s_time
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
            const transactions = await getTransactions(0,5);
            var num = []
            Object.keys(transactions).map((transaction,k) => {
                return this.getTransactionsInfo(k,num,transactions)                
            });
            const count = await getTransactionsCount();
            this.setState({
                transactionCount:count[0].count
            })
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
           // const dids = await getDids(0,5);
            const dids_index = await getDidsIndex(50);

            var dids = [];
            var did_obj = {};
            dids_index.map((v,k)=>{
                did_obj[v["did"]] = "0"
            })
            for(let k in did_obj){
                var obj = {"did":k}
                if(dids.length<5){
                    dids.push(obj)
                }
            }
            this.setState({dids:dids})
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
    getEapp = async () => {
        try{
            const eapps = await getEapps(0,5);
            /*var num = []
            Object.keys(dids).map((did,k) => {
                return this.getDidsInfo(k,num,dids)                
            });*/
            this.setState({eapps:eapps})
            const count = await getEappsCount();
            this.setState({
                eappsCount:count[0].count,
            })
        }catch(err){
          console.log(err)
        }
    }
    componentWillMount(){
        this.getInfo();
        this.getTrans();
        this.getDid();
        this.getEapp();
        this.setTimeFormat();
        document.onclick=function(){
            try{
               document.getElementById("char_info").style.display="none";
               jQuery(".char_li ").removeClass("char_clicked")
            }catch(e){}
        }

        const self = this
       /* setInterval(function(){
            console.log("interval")
            self.getInfo();
            self.getTrans();
            self.getDid();
            self.getEapp();  
        },300000)*/
    }
    showBlockInfo(id,event){
        event.nativeEvent.stopImmediatePropagation();
        this.setState({
            click_id:id
        })
        try{ document.getElementById("char_info").style.display="block";}catch(e){}
    }
    setTimeFormat(){
        const lang = localStorage.getItem("lang")
        if(lang === "cn"){
            moment.locale("cn",{
                relativeTime : {
                    future : "%s后",
                    past : "%s前",
                    s : "%d秒",
                    m : "%d分",
                    mm : "%d 分",
                    h : "%d小时",
                    hh : "%d 小时",
                    d : "%d天",
                    dd : "%d 天",
                    M : "%d月",
                    MM : "%d 月",
                    y : "%d年",
                    yy : "%d 年"
                }
            })
        }else{
           moment.locale("en",{
                relativeTime : {
                    future : "in %s",
                    past : "%s ago",
                    s : "%ds",
                    m : "%dm",
                    mm : "%dm",
                    h : "%dh",
                    hh : "%dh",
                    d : "%dd",
                    dd : "%dd",
                    M : "%dM",
                    MM : "%dM",
                    y : "%dY",
                    yy : "%dY"
                }
            }) 
        }
    }
    render() {
        this.setTimeFormat();
        const {rate, blocks, click_id, transactionCount, transactions, s_time, dids, didCount, eapps, eappsCount} = this.state;
        const lang =this.props.lang;

        const lis = blocks.length ? blocks.map((v,k)=>{
            let style = {
                "right": k*2.55 +"%",
                "height": typeof v.size === "number" ? v.size * rate : 0 +"px",
                "background" : k === 0 ? "linear-gradient(180deg, #1DE9B6 0%, #02C67F 100%)" : ""
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
                        <div><span>{v.size} bytes </span><span className="time">{s_time && moment(v.time * 1000) < moment(s_time) ? moment(v.time * 1000).from(s_time) : "..."}</span></div>
                    </li>
            }else{
                return "";
            }
            
        }) : <img src={loadingImg} style={{"margin":"160px 110px"}} alt="loadingImg"/>
        const item_transactions = transactions.length ? transactions.map((v,k)=>{
            
            if(k<5){
                return <li key= {k}>
                        <div><a href={"/transaction_detail/"+v.txid}><HashFormat text = {v.txid} width = "70%"/></a><span className="time">{s_time && moment(v.createTime * 1000) < moment(s_time) ? moment(v.createTime * 1000).from(s_time) : "..."}</span></div>
                    </li>
            }else{
                return "";
            }
            
        }) : <img src={loadingImg} style={{"margin":"160px 110px"}} alt="loadingImg"/>
        const item_dids = dids.length ? dids.map((v,k)=>{
            
            if(k<5){
                return <li key= {k}>
                        <div><a href={"/did_detail/"+v.did}><HashFormat text = {v.did} width = "70%"/></a>
                        <span className="time">{s_time && moment(v.time) < moment(s_time) ? moment(v.time).from(s_time) : "..."}</span></div>
                        <div>Register ELA DID</div>
                    </li>
            }else{
                return "";
            }

        }) : <img src={loadingImg} style={{"margin":"160px 110px"}} alt="loadingImg"/>

        const item_eapps = eapps.length ? eapps.map((v,k)=>{
            if(k<5){
                return <li>
                        <a href={'/eapp_detail/'+v.info_value+'/'+(v.property_key != null && v.property_key.indexOf("AppID") > -1 ? v.property_value : '...')}><span>{v.info_value}</span></a>
                        <span className="time">{s_time && moment(v.local_system_time) < moment(s_time) ? moment(v.local_system_time).from(s_time) : "..."}</span>
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
                                    <a href="/ela_did"><img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/></a>
                                </div>
                                <div className="summary_content">
                                    <span>{didCount ? didCount : "..."}</span>
                                </div>
                            </li>
                            <li className="has_border">
                                <div className="summary_title">
                                    <span>{lang.total_transactions}</span>
                                    <a href="/transactions"><img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/></a>
                                </div>
                                <div className="summary_content">
                                    <span>{transactionCount ? transactionCount : "..."}</span>
                                </div>
                            </li>
                            <li className="has_border">
                                <div className="summary_title">
                                    <span>{lang.block_height}</span>
                                    <a href="/blocks"><img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/></a>
                                </div>
                                <div className="summary_content">
                                    <span>{blocks.length ? blocks[0]["height"] : "..."}</span>
                                </div>
                            </li>
                            <li className="has_border">
                                <div className="summary_title">
                                    <span>{lang.total_eApps}</span>
                                    <a href="/eapps"><img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/></a>
                                </div>
                                <div className="summary_content">
                                    <span>{eappsCount ? eappsCount : "..."}</span>
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
                                 {item_eapps}
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