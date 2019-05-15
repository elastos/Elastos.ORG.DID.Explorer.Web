import React from 'react';
import { getCurrentBlock, getTransactionsFromHeight, getTxDetailFromTxid, getBlockInfo,getCurrentHeight, getValuesFromTxid, getTransactionsCountFromHeight} from '../request/request';
import {Link} from 'react-router-dom';
import TransactionList from './TransactionList'
import './transactionDetail.css'
import Search from './elements/Search'
import iconCopy from '../public/images/icon-copy.svg'
import iconDeprecated from '../public/images/icon-deprecated.svg'
import iconNormal from '../public/images/icon-normal.svg'
class BlockDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            height:'...',
            blockinfo:{
                hash:"...",
                height:"...",
                time:"...",
                miner_info:"...",
                merkleroot:"...",
                difficulty:"...",
                bits:"...",
                version:"...",
                nonce:"...",
            },
            transCount:"...",
        }
    }
    componentWillMount (){
        
        this.GetInfo();
    }
    GetInfo = async () => {
        const data = await getCurrentBlock();
        const height = this.props.match.params.height ? this.props.match.params.height : data[0].height 
        const blockinfo = await getBlockInfo(height);
        this.setState({
            height:height,
            blockinfo:blockinfo[0] ? blockinfo[0] : this.state.blockinfo,
        })
    }
    setTransCount(count){
        console.log(count)
        this.setState({
            transCount:count
        })
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
        const { height, blockinfo, transCount } = this.state;
        const lang = this.props.lang;
        return (
            <div className="container">
                <div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.block}</span></div>
                    <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>
                </div>
                <div className="transaction_title">
                    <span> {lang.block_height}: {height}</span>
                </div>
                <div className="transaction_summery">
                    <ul>
                        <li>
                            <span className="detail_key">{lang.hash}</span>
                            <span className="detail_value" style={{"wordWrap":"break-word","whiteSpace": "pre-wrap"}}  >{blockinfo.hash}</span>
                        </li>
                        <li>
                            <span className="detail_key">{lang.miner}</span>
                            <span className="detail_value">{blockinfo.miner_info}</span>
                        </li>
                        <li>
                            <span className="detail_key">{lang.time}</span>
                            <span className="detail_value">{blockinfo.time === "..." ? "..." : this.timestampToTime(blockinfo.time)}</span>
                        </li>
                        <li>
                            <span className="detail_key">{lang.reward}</span>
                            <span className="detail_value"> ... ELA</span>
                        </li>
                        <li>
                            <span className="detail_key">{lang.size}</span>
                            <span className="detail_value">{blockinfo.size} bytes</span>
                        </li>
                        <li>
                            <span className="detail_key">{lang.transactions}</span>
                            <span className="detail_value">{lang.transCount}</span>
                        </li>
                        <li>
                            <span className="detail_key">{lang.block_height}</span>
                            <span className="detail_value" style={{"color":"#31B59D"}}>{blockinfo.height}</span>
                        </li>
                    </ul>
                </div>
                <div className="transaction_summery" >
                    <ul>
                        <li>
                            <span className="detail_key">{lang.previous_block}</span>
                            <span className="detail_value" style={{"wordWrap":"break-word","whiteSpace": "pre-wrap","color":"#31B59D"}} >{blockinfo.previous_block_hash}</span>
                        </li>
                        <li>
                            <span className="detail_key">{lang.next_block}</span>
                            <span className="detail_value" style={{"wordWrap":"break-word","whiteSpace": "pre-wrap","color":"#31B59D"}} >{blockinfo.next_block_hash}</span>
                        </li>
                    </ul>
                </div>
                {blockinfo.height != "..." && <TransactionList  name="block_detail" blockHeight ={blockinfo.height} lang={lang} setTransCount = {this.setTransCount.bind(this)} />}
            </div>
        );
    }
}

export default BlockDetail;