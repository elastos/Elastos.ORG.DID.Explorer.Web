import React from 'react';
import iconLeft from '../public/images/icon-left.svg'
import loadingImg from '../public/images/loading.gif';
import U from 'urlencode';
import iconRight from '../public/images/icon-right.svg'
import { Pagination } from 'antd';
import { getPropertyChanges ,getPropertiesHistoryCount} from '../request/request';
class History extends React.Component {
	constructor(props){
        super(props);
        this.state = {
            did:"",
            key:"",
            size: 50,
            current:1,
            propertyChanges:[],
            loading:false
        }
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount (){
        const did = this.props.match.params.did;
        const key = this.props.match.params.key;
        this.setState({
            did:did,
            key:key
        })
        const { current, size }= this.state;
        this.GetInfo(did,key,current,size);
    }
    GetInfo = async (did,key,current,size) => {
        try{
            const start = ( current - 1) * size;
            const count = await getPropertiesHistoryCount(key,did);
            console.log("count = " + count)
            const propertyChanges = await getPropertyChanges(key,did,start,size);
            console.log(propertyChanges)
            this.setState({
                count:count[0].count,
                propertyChanges:propertyChanges,
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
        const did = this.props.match.params.did;
        const key = this.props.match.params.key;
        this.GetInfo(did,key,pageNumber,size);
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
    back(){
        window.history.go(-1)
    }
    render() {
        const {propertyChanges, key, count, current, size, loading } = this.state;
        const did = this.props.match.params.did;
    	const lang = this.props.lang;
        const propertyHtml = propertyChanges.map((property,k) => {
            return(
                <tr className="ant-table-row ant-table-row-level-0 table_tr1" data-row-key="1" key = {k}>
                    <td >{property.property_value}</td>
                    <td >{this.timestampToTime(property.block_time)}</td>
                    <td >{property.txid}</td>
                </tr>
            )
        });
    	return (
    		<div className="container">
            	<div className = "list_top" >
                    <div className = "list_title" style={{"float":"unset"}}><a href="#" onClick = {this.back}><img src={iconLeft} alt="back" style={{"marginBottom":"2px","marginRight":"10px"}}/><span style={{"fontSize":"14px"}}>{lang.back}</span></a></div>
                </div>
                <div><span style={{"fontSize":"25px","color":"#364458","fontFamily":"Bio Sans Bold","whiteSpace": "normal","wordBreak":"break-all"}}>{U.decode(key)}</span></div>
                <div className="ant-table ant-table-default ant-table-scroll-position-left" >
                    <div className="ant-table-content">
                        <div className="ant-table-body">
                            <table className="transaction_list_table">
                                <thead className="ant-table-thead">
                                    <tr>
                                        <th className="">
                                            <div>{lang.value}</div>
                                        </th>
                                        
                                        <th className="">
                                            <div>{lang.timestamp}</div>
                                        </th>
                                        <th className="">
                                            <div>Hash</div>
                                        </th>
                                        
                                    </tr>
                                </thead>
                                <tbody className="ant-table-tbody">
                                     {propertyHtml}
                                </tbody>
                            </table>
                            <div style={{"marginTop":"50px","textAlign":"center"}}>
                                    
                                {count !== 0 && count > size && <Pagination defaultCurrent={current} total={count} defaultPageSize = {size} onChange={this.onChange}  itemRender={this.itemRender}
                                    style={{"width":"100%","height":"50px","textAlign":"center"}}
                                />}
                                {loading && <div className="loadingBox"><img src={loadingImg} alt="loading"/></div>}
                            </div>
                            
                        </div>
                    </div>
                </div> 
				
            </div>
    	)
    }
}

export default History;