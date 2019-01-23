import React from 'react';
import { getBlocks, getBlocksCount } from '../request/request';
import {Link} from 'react-router-dom';
import { Pagination } from 'antd';
import './Blocks.css';
import loadingImg from '../public/images/loading.gif';
class Blocks extends React.Component {
	 constructor(props){
        super(props);
        this.state = {
            count:0,
            size: 20,
            current:1,
            blocks:[],
            loading:false
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
            const count = await getBlocksCount();
            const start = ( current - 1) * size;
            const blocks = await getBlocks(start,size);
            this.setState({
                count:count[0].count,
                blocks:blocks,
                loading:false
            })
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
    render() {
    	const { blocks, count, size, current, loading } = this.state;
        const  lang  = this.props.lang;
        const txHtml = blocks.map((block,k) => {
        	return(
        		<tr className="ant-table-row ant-table-row-level-0 table_tr1" data-row-key="1" key={k}>
	        		<td width="30%"><Link to={'/height/'+block.height}><span>{block.height}</span></Link></td>
	        		<td width="40%"><span>{block.time ? this.timestampToTime(block.time) : "" }</span></td>
	        		<td width="10%"><span>{block.count}</span></td>
	        		<td width="10%"><span>{block.miner_info}</span></td>
	        		<td width="10%"><span>{block.size}</span></td>
				</tr>
        	)
        });
        return (
                <div className="container">
                	<div style={{"marginTop":"20px","borderBottom":"1px #ccc solid","paddingBottom":"15px","textAlign":"left","paddingLeft":"10px"}}><span style={{"fontSize":"25px"}}>{lang.latest_blocks}</span></div>
					<div className="ant-table ant-table-default ant-table-scroll-position-left">
						<div className="ant-table-content">
							<div className="ant-table-body">
								<table className="">
									<thead className="ant-table-thead">
										<tr>
											<th className="">
												<div>{lang.block_height}</div>
											</th>
											<th className="">
												<div>{lang.time}</div>
											</th>
											<th className="">
												<div>{lang.transactions}</div>
											</th>
											<th className="">
												<div>{lang.miner}</div>
											</th>
											<th className="">
												<div>{lang.size}</div>
											</th>
										</tr>
									</thead>
									<tbody className="ant-table-tbody">
										{txHtml}
									</tbody>
								</table>
								<div style={{"marginTop":"50px"}}>
                                    
                                    <Pagination showQuickJumper defaultCurrent={current} total={count} defaultPageSize = {size} showLessItems onChange={this.onChange} 
                                        style={{"float":"right"}}
                                    />
                                    {loading && <img style={{"float":"right","marginRight":"30px","marginTop":"5px","width":"20px"}} src={loadingImg} alt="loading"/>}
                                </div>
							</div>
						</div>
					</div>
                </div>
        );
    }
}

export default Blocks;