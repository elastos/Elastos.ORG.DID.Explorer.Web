import React from 'react';
import {Link} from 'react-router-dom';
import "./BlockInfo.css";
import { getCurrentBlock, getTransactionsFromHeight, getTxDetailFromTxid, getBlockInfo,getCurrentHeight,getValuesFromTxid} from '../request/request';
import { Icon } from 'antd';
class BlockInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          height:'...',
          length:'0',
          transactions:[],
          currentHeight:0,
          blockinfo:{
            hash:"...",
            height:"...",
            time:"...",
            miner_info:"...",
            merkleroot:"...",
            difficulty:"...",
            bits:"...",
            version:"...",
            nonce:"..."
          }
        }
    }
    componentWillMount (){
        this.GetInfo();
    }
    GetInfo = async () => {
        try{
            const data = await getCurrentBlock();
            const height = this.props.match.params.height ? this.props.match.params.height : data[0].height 
            const transactions = await getTransactionsFromHeight(height);
            const blockinfo = await getBlockInfo(height);
            this.setState({
                height:height,
                length:transactions.length,
                transactions:transactions,
                blockinfo:blockinfo[0] ? blockinfo[0] : this.state.blockinfo,
            })
            Object.keys(transactions).map((transaction,k) => {
                return this.GetTransactions(k,transactions[k].txid)                
            });
            const currentHeight = await getCurrentHeight();
            this.setState({
                currentHeight:currentHeight[0].height
            })
        }catch(err){
          console.log(err)
        }
    }
    GetTransactions = async (k,txid) => {
        try{
            const properties = await getTxDetailFromTxid(txid);
            const values = await getValuesFromTxid(txid)
            
            let transaction = this.state.transactions;
            transaction[k].properties = properties;
            transaction[k].did = properties[0].did;
            transaction[k].didstatus = properties[0].did_status;
            transaction[k].values = values[0].value;
            this.setState({transactions:transaction})

        }catch(err){
            console.log(err)
        }
       
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            height:nextProps.match.params.height,
            lang:nextProps.lang
        })
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
        const { height, length, transactions, blockinfo,currentHeight} = this.state;
        const  lang  = this.props.lang;
        const width = document.body.clientWidth;
        const iconType = (width > 760) ? "caret-right" : "caret-down";
        const txHtml = transactions.map((tx,k) => {
            const proHtml = (typeof tx.properties != "undefined") ? (tx.properties.map((property,k)=>{
                return(
                    <li key={k}>
                        <Link to={'/did/'+tx.did+'/property_history/'+ property.property_key} >
                            <span className="floatLeft" >{ property.property_key}</span>
                            <span className="floatRight" >{property.property_key_status === 1 ? "("+lang.available+")" : "("+lang.disused+")"}</span>
                            <span className="floatRight" >{ property.property_value}</span>
                            
                        </Link>
                    </li>
                )
            })) :"";
            return (
               <div  key={k} style={{"marginBottom":"40px"}}>
                    <ul className = "transactionUl">
                        <li className = "liTitle">
                            <div className="floatLeft">
                                <span><Link to={'/txinfo/'+tx.txid} >{tx.txid}</Link></span>
                            </div>
                            <div className="floatRight">
                                <span className="tint">{this.timestampToTime(tx.createTime)}</span>
                            </div>
                        </li>
                        <li className = "liContent">
                            <div className="content1">
                            {tx.txType === "TransferAsset" &&
                                <ul>
                                    <li className="left"><Link to={'/properties_list/'+tx.did} >{tx.did}</Link> {tx.didstatus === 1 ? "("+lang.available+")" : "("+lang.disused+")"}</li>
                                    <li className="center"><Icon  type={iconType} /></li>
                                    <li className="right">
                                        <ul>
                                           {proHtml}
                                        </ul>
                                    </li>
                                </ul>
                            }
                            </div>
                           
                            <div className="content2" >
                                <span>{lang.primitive_memo_binary} : </span><span> {tx.memo}</span>
                            </div>
                            <div className="content3">
                                <span>{lang.fee}:{tx.fee / 100000000} ELA</span>
                                <span>{tx.values / 100000000} ELA</span>
                                <span>{currentHeight - tx.height + 1 }{lang.confirmations}</span>
                            </div>
                        </li>
                    </ul>
                </div>

            )
        });
        return (
                <div className="container">
                	<h2 className="title bold">{lang.block}:#{height}</h2>
                    <p className="p1">
                        <span className="bold">{lang.block_hash}: </span>
                        <span className="tint">{blockinfo.hash}</span>
                    </p>
                	<div className="">
                		<h2 className="title bold">{lang.summary}</h2>
                		<div className="infoDiv">
                			<ul className = "infoUl floatLeft">
                				<li>
                					<span className = "pullLeft floatLeft width_30 bold">{lang.tx_count}</span>
                					<span className = "pullRight floatLeft width_70 tint" >{length}</span>
                				</li>
                				<li>
                					<span className = "pullLeft floatLeft width_30 bold">{lang.height}</span>
                					<span className = "pullRight floatLeft width_70 tint">{blockinfo.height}</span>
                				</li>
                			   {/*
                                <li>
                                    <span className = "pullLeft floatLeft width_30 bold">{lang.fee}</span>
                                    <span className = "pullRight floatLeft width_70 tint">... ELA</span>
                                </li>
                               */} 
                				<li>
                                    <span className = "pullLeft floatLeft width_30 bold">{lang.time}</span>
                                    <span className = "pullRight floatLeft width_70 tint">{blockinfo.time === "..." ? "..." : this.timestampToTime(blockinfo.time)}</span>
                                </li>
                                <li>
                                    <span className = "pullLeft floatLeft width_30 bold">{lang.miner}</span>
                                    <span className = "pullRight floatLeft width_70 tint">{blockinfo.miner_info}</span>
                                </li>
                				<li>
                					<span className = "pullLeft floatLeft width_30 bold">{lang.merkle_root}</span>
                					<span className = "pullRight floatLeft width_70 tint">{blockinfo.merkleroot}</span>
                				</li>
                                

                			</ul>
                			<ul className = "infoUl floatLeft">
                        
                            <li>
                                    <span className = "pullLeft floatLeft width_30 bold">{lang.difficulty}</span>
                                    <span className = "pullRight floatLeft width_70 tint">{blockinfo.difficulty}</span>
                                </li>
                                <li>
                                    <span className = "pullLeft floatLeft width_30 bold">{lang.bits}</span>
                                    <span className = "pullRight floatLeft width_70 tint">{blockinfo.bits}</span>
                                </li>
                               {/*
                                <li>
                                    <span className = "pullLeft floatLeft width_30 bold">{lang.size}</span>
                                    <span className = "pullRight floatLeft width_70 tint">...</span>
                                </li>
                               */} 
                                <li>
                                    <span className = "pullLeft floatLeft width_30 bold">{lang.version}</span>
                                    <span className = "pullRight floatLeft width_70 tint">{blockinfo.version}</span>
                                </li>
                                <li>
                                    <span className = "pullLeft floatLeft width_30 bold">{lang.nonce}</span>
                                    <span className = "pullRight floatLeft width_70 tint">{blockinfo.nonce}</span>
                                </li>
                			</ul>

                		</div>
                	</div>
                	<div>
                		<h2 className="title bold">{lang.transactions}</h2>
                        {txHtml}
                	</div>

                </div>
        );
    }
}

export default BlockInfo;