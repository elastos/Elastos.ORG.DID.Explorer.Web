import React from 'react';
import { getDids, getDidCount, getDidInfo, getDidsWithProperty, getDidCountWidthProperty } from '../request/request';
import {Link} from 'react-router-dom';
import { Pagination } from 'antd';
import './didList.css';

import Search from './elements/Search'
import loadingImg from '../public/images/loading.gif';
import iconLeft from '../public/images/icon-left.svg'
import iconRight from '../public/images/icon-right.svg'
class DidList extends React.Component {
     constructor(props){
        super(props);
        this.state = {
            count:0,
            size: 50,
            current:1,
            dids:[],
            property:null,
            loading:true
        }
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount (){
        const property = this.props.match.params.property;
        console.log(property)
        this.setState({
            property:property
        })
        const { current, size }= this.state;
        this.getInfo(current,size,property);
       
    }
    getInfo = async (current,size,property) => {
        try{
            const start = ( current - 1) * size;
            const dids = property ? await getDidsWithProperty(start,size,property) : await getDids(start,size);
            this.setState({dids:dids})
            console.log(dids)
            var number = []
            if(property == null){
                Object.keys(dids).map((did,k) => {
                    return this.getDidsInfo(k,number,dids)                
                });
            }
            const count = property ? await getDidCountWidthProperty(property) : await getDidCount();
            this.setState({
                count:count[0].count,
                loading:false
            })
        }catch(err){
          console.log(err)
        }
    }
    getDidsInfo = async (k,number,dids)=>{
        try{
            const didDetail = await getDidInfo(dids[k].did)
            dids[k].txid = didDetail[0].txid;
            dids[k].height = didDetail[0].height;
            dids[k].block_time = didDetail[0].block_time

            number.push(k);
            if(number.length === dids.length){
                this.setState({dids:dids,  loading:false})
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
        const { size, property } = this.state;
        this.getInfo(pageNumber,size, property);
    }
    timestampToTime(time) {
      let date = new Date(time * 1000);
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
        return <a href="#"><img src={iconLeft} alt="iconleft"/></a>;
      } if (type === 'next') {
        return <a href="#"><img src={iconRight} alt="iconright"/></a>;
      }
      return originalElement;
    }
    render() {
        const { dids, count, size, current, loading } = this.state;
        const  lang  = this.props.lang;
        const txHtml = dids.map((did,k) => {
            return(
                <tr className="ant-table-row ant-table-row-level-0 table_tr" data-row-key="1" key={k}>
                    <td width="30%"><Link to={'/did_detail/'+did.did}>{did.did}</Link></td>
                    <td width="30%"><Link to={'/transaction_detail/'+did.txid}>{did.txid}</Link></td>
                    <td width="20%" style={{"textAlign":"center"}}>{did.height}</td>
                    <td width="20%">{did.block_time ? this.timestampToTime(did.block_time) : ''}</td>
                </tr>
            )
        });
        return (
                <div className="container">
                    <div className = "list_top" >
                        <div className = "list_title"><span style={{"fontSize":"25px"}}>ELA DID</span></div>
                        <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>

                    </div>
                    <div className="ant-table ant-table-default ant-table-scroll-position-left">
                        <div className="ant-table-content">
                            <div className="ant-table-body" >
                                <table className="did_list_table">
                                    <thead className="ant-table-thead">
                                        <tr>
                                            <th  width="30%">
                                                <span>ELA DID</span>
                                            </th>
                                            <th  width="30%">
                                                <span>{lang.transaction} ID</span>
                                            </th>
                                            <th  width="20%" style={{"textAlign":"center"}}>
                                                <span>{lang.block_height}</span>
                                            </th>
                                            <th  width="20%">
                                                <span>{lang.register_time}</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="ant-table-tbody">
                                        {txHtml}
                                    </tbody>
                                </table>
                                <div style={{"marginTop":"50px","textAlign":"center"}}>
                                    
                                    {count !== 0 && count > size &&<Pagination defaultCurrent={current} total={count} defaultPageSize = {size} onChange={this.onChange}  itemRender={this.itemRender}
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

export default DidList;