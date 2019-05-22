import React from 'react';
import { getBlocks, getBlocksCount, getBlocksInfo, getTransactionsCountFromHeight} from '../request/request';
import {Link} from 'react-router-dom';
import { Pagination } from 'antd';
import './Blocks.css';
import Search from './elements/Search'
import loadingImg from '../public/images/loading.gif';
import iconLeft from '../public/images/icon-left.svg'
import iconRight from '../public/images/icon-right.svg'
class Blocks extends React.Component {
	 constructor(props){
        super(props);
        this.state = {
            count:0,
            size: 50,
            current:1,
            blocks:[],
            loading:true
        }
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount (){
        const { current, size }= this.state;
        this.getInfo(current,size);
    }
     componentDidMount(){
        const lang = localStorage.getItem("lang");
        var div = document.getElementsByClassName("ant-pagination-options-quick-jumper");
        if (lang === "en" && typeof div[0] !== "undefined") {
            div[0].childNodes[0].data = "Goto" 
        }
        if(lang === "cn" && typeof div[0] !== "undefined"){
            div[0].childNodes[0].data = "跳转" 
        } 
    }
    getInfo = async (current,size) => {
        try{
            const start = ( current - 1) * size;
            const blocks = await getBlocks(start,size);
            let number = [];
            Object.keys(blocks).map((block,k) => {
                return this.GetBlockInfo(k,number,blocks)                
            });
            const count = await getBlocksCount();
            this.setState({
                count:count[0].count,
                loading:false
            })
        }catch(err){
          console.log(err)
        }
    }
    GetBlockInfo = async (k,number,blocks)=>{
        try{
            const blockInfo = await getBlocksInfo(blocks[k].height);
            blocks[k].time = blockInfo[0].time;
            blocks[k].miner_info = blockInfo[0].miner_info;
            blocks[k].size = blockInfo[0].size;
            const count = await getTransactionsCountFromHeight(blocks[k].height);
            blocks[k].count = count[0].count;
            number.push(k)
            if(number.length === blocks.length){
                this.setState({blocks:blocks})
            }
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
        this.getInfo(pageNumber,size);
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
        return <a><img src={iconLeft} alt="iconleft"/></a>;
      } if (type === 'next') {
        return <a><img src={iconRight} alt="iconright"/></a>;
      }
      return originalElement;
    }
    render() {
    	const { blocks, count, size, current, loading } = this.state;
        const  lang  = this.props.lang;
        
        const txHtml = blocks.map((block,k) => {
        	return(
        		<tr className="ant-table-row ant-table-row-level-0 table_tr1" data-row-key="1" key={k}>
	        		<td width="30%"><Link to={'/block_detail/'+block.height}><span>{block.height}</span></Link></td>
	        		<td width="40%"><span>{block.count}</span></td>
	        		<td width="10%"><span>{block.miner_info}</span></td>
	        		<td width="10%"><span>{block.size}</span></td>
	        		<td width="10%"><span>{block.time ? this.timestampToTime(block.time) : "" }</span></td>
				</tr>
        	)
        });
        return (
                <div className="container">
                	 <div className = "list_top" >
                        <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.block}</span></div>
                        <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>
                    </div>
                    <div className="ant-table ant-table-default ant-table-scroll-position-left">
						<div className="ant-table-content">
							<div className="ant-table-body">
								<table className="blocks_list_table">
									<thead className="ant-table-thead">
										<tr>
											<th className="">
												<span>{lang.height}</span>
											</th>
											<th className="">
												<span>{lang.transactions}</span>
											</th>
											<th className="">
												<span>{lang.miner}</span>
											</th>
											<th className="">
												<span>{lang.size}(byte)</span>
											</th>
											<th className="">
												<span>{lang.time}</span>
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

export default Blocks;