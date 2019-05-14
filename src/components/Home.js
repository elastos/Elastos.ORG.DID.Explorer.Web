import React from 'react';
import moment from 'moment'
import { getBlocks, getBlocksInfo, getTransactionsCount, getTransactions, getTransactionsInfo, getTransactionsCountFromHeight, getServerInfo } from '../request/request';
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
           s_time:null
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

    componentWillMount(){
       /* moment.locale("en",{
            relativeTime : {
                future : "in %s",
                past : "%s ago",
                s : "s",
                m : "m",
                mm : "%dm",
                h : "h",
                hh : "%dh",
                d : "d",
                dd : "%dd",
                M : "M",
                MM : "%dM",
                y : "Y",
                yy : "%dY"
            }
        })*/
        this.getInfo();
        this.getTrans();
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
        const {rate, blocks, click_id, transactionCount, transactions, s_time} = this.state;
        const lis = blocks.length ? blocks.map((v,k)=>{
            let style = {
                "right": k*2.55 +"%",
                "height": typeof v.size === "number" ? v.size * rate : 0 +"px"
            }
            return <li className= {click_id == k ? "char_li char_clicked" : "char_li" } key= {k} style={style} 
            onClick={(e)=>{e.nativeEvent.stopImmediatePropagation();}} 
            onMouseOver={this.showBlockInfo.bind(this,k)}>

                {click_id == k && <div className = "char_info" id="char_info">
                    <span>{v.height}</span>
                    <span>Block Size: {v.size} bytes</span>
                </div>}
            </li> 
        }): <img src={loadingImg} style={{"marginTop":"150px"}}/>  
        const item_blocks = blocks.length ? blocks.map((v,k)=>{
            if(k<5){
                return <li key= {k}>
                        <div><span>{v.height}</span><span className="txns">{v.count ? v.count + "Txns" : "..." }</span></div>
                        <div><span>{v.size} bytes </span><span className="time">{s_time ? moment(v.time * 1000).from(s_time) : "..."}</span></div>
                    </li>
            }else{
                return "";
            }
            
        }) : <img src={loadingImg} style={{"margin":"160px 110px"}}/>
        const item_transactions = transactions.length ? transactions.map((v,k)=>{
            if(k<5){
                return <li key= {k}>
                        <div><HashFormat text = {v.txid} width = "70%"/><span className="time">{s_time ? moment(v.createTime * 1000).from(s_time) : "..."}</span></div>
                    </li>
            }else{
                return "";
            }
            
        }) : <img src={loadingImg} style={{"margin":"160px 110px"}}/>
    	return (
    		<div className="content">
                <div className="container container_banner">
                    <img className="banner" src={background} alt="background"/>
                    <div className="banner_title">
                        <h1 className="title">ELA DID Explorer</h1>
                    </div>
                    <div className="banner_search">
                        <Search button="true" name="home"/>
                    </div>
                </div>
                <div className="container container_summary">
                    <div className="summary">
                        <ul>
                            <li>
                                <div className="summary_title">
                                    <span>Total ELA DID</span>
                                    <img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/>
                                </div>
                                <div className="summary_content">
                                    <span>...</span>
                                </div>
                            </li>
                            <li className="has_border">
                                <div className="summary_title">
                                    <span>Total Transactions</span>
                                    <img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/>
                                </div>
                                <div className="summary_content">
                                    <span>{transactionCount ? transactionCount : "..."}</span>
                                </div>
                            </li>
                            <li className="has_border">
                                <div className="summary_title">
                                    <span>Block Height</span>
                                    <img src={iconRight} alt="iconRight" style={{"marginBottom":"3px"}}/>
                                </div>
                                <div className="summary_content">
                                    <span>{blocks.length ? blocks[0]["height"] : "..."}</span>
                                </div>
                            </li>
                            <li className="has_border">
                                <div className="summary_title">
                                    <span>Total EApps</span>
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
                                <a href="/ela_did">View More</a>
                            </div>
                            <div className="item_content">
                                <ul>
                                    <li>
                                        <div><span className="hash">112SHCF...48362789</span><span className="time">17m ago</span></div>
                                        <div>Register ELA DID</div>
                                    </li>
                                    <li>
                                        <div><span>112SHCF...48362789</span><span className="time">17m ago</span></div>
                                        <div>Register ELA DID</div>
                                    </li>
                                    <li>
                                        <div><span>112SHCF...48362789</span><span className="time">17m ago</span></div>
                                        <div>Register ELA DID</div>
                                    </li>
                                    <li>
                                        <div><span>112SHCF...48362789</span><span className="time">17m ago</span></div>
                                        <div>Register ELA DID</div>
                                    </li>
                                    <li>
                                        <div><span>112SHCF...48362789</span><span className="time">17m ago</span></div>
                                        <div>Register ELA DID</div>
                                    </li>

                                </ul>
                            </div>
                        </li>
                        <li className="item" style={{"marginRight":"4%"}}>
                            <div className="item_title">
                                <h4>TRANSACTIONS</h4>
                                <a href="/transactions">View More</a>
                            </div>
                            <div className="item_content">
                                <ul>
                                    {item_transactions}
                                </ul>
                            </div>
                        </li>
                        <li className="item" style={{"marginRight":"4%"}}>
                            <div className="item_title">
                                <h4>BLOCKS</h4>
                                <a href="/blocks">View More</a>
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
                                <a href="/eapps">View More</a>
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