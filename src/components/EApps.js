import React from 'react';
import { getEapps , getEappsCount, getEappId } from '../request/request';
import {Link} from 'react-router-dom';
import { Pagination } from 'antd';
import './eapp.css';
import U from 'urlencode';
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
            size: 50,
            current:1,
            eapps:[],
            loading:true
        }
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount (){
        const { current, size }= this.state;
        this.getInfo(current,size);
       
    }
    getInfo = async (current,size) => {
        try{
            
            const start = ( current - 1) * size;
            const eapps = await getEapps(start,size);
            console.log(eapps)
            this.setState({
                eapps:eapps, 
                loading:false              
            })
            Object.keys(eapps).map((eapp,k) => {
                return this.GetEappId(k,eapps[k].info_value)                
            });
            const count = await getEappsCount();
             this.setState({
                count:count[0].count,
                 loading:false
            })
        }catch(err){
          console.log(err)
        }
    }
    GetEappId = async (k,app_name)=>{
        try{

            const eapp = await getEappId(U(app_name));
            let eapps = this.state.eapps;
            console.log(eapp)
            eapps[k].property_value = eapp[0].property_value;
            eapps[k].loaded = true;
            this.setState({eapps:eapps})
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
        return <a href="#"><img src={iconLeft} alt = "iconleft"/></a>;
      } if (type === 'next') {
        return <a href="#"><img src={iconRight} alt = "iconright"/></a>;
      }
      return originalElement;
    }
    render() {
        const { eapps, count, size, current, loading } = this.state;
        const  lang  = this.props.lang;
        const txHtml = eapps.map((eapp,k) => {
            return(
                <tr className="ant-table-row ant-table-row-level-0 table_tr" data-row-key="1" key={k}>
                    <td width="20%"><Link to={'/eapp_detail/'+U(eapp.info_value)}>
                    	{/*<img src={okb_mid}/>*/}<span style={{"paddingLeft":"5px"}}>{eapp.info_value}</span>
                    </Link></td>
                    <td width="40%">{eapp.property_key != null && eapp.property_key.indexOf("AppID") > -1 && eapp.loaded != null ? eapp.property_value : '...'}</td>
                    <td width="20%">
	                    {/*
                        <Link to={'/Website'}><span style={{"padding":"0px 10px"}}>{lang.website}</span></Link>
	                    <Link to={'/Privacy'}><span style={{"padding":"0px 10px"}}>{lang.privacy}</span></Link>
	                  	<Link to={'/Notification'}><span style={{"padding":"0px 10px"}}>{lang.notification}</span></Link>
                    */}</td>
                    <td width="20%">
                    	{/*<Link to={'#'}><span style={{"padding":"2px 20px","border":"1px #4F92D0 solid","borderRadius":"15px","color":"#4F92D0"}}>iOS</span></Link>
	                    <Link to={'#'}><span style={{"padding":"2px 20px","border":"1px #31B59D solid","borderRadius":"15px","color":"#31B59D","marginLeft":"10px"}}>Android</span></Link>
	                  	<Link to={'#'}><span style={{"padding":"2px 20px","border":"1px #9471DE solid","borderRadius":"15px","color":"#9471DE","marginLeft":"10px"}}>H5 App</span></Link>
	                  	<Link to={'#'}><span style={{"padding":"2px 20px","border":"1px #D3955B solid","borderRadius":"15px","color":"#D3955B","marginLeft":"10px"}}>Web App</span></Link>
                        */}
                    </td>
                </tr>
            )
        });
        return (
                <div className="container">
                    <div className = "list_top" >
                        <div className = "list_title"><span style={{"fontSize":"25px"}}>EApps</span></div>
                        <div className = "list_search"><Search button="false" name="list" lang={lang}/></div>

                    </div>
                    <div className="ant-table ant-table-default ant-table-scroll-position-left">
                        <div className="ant-table-content">
                            <div className="ant-table-body" >
                                <table className="did_list_table">
                                    <thead className="ant-table-thead">
                                        <tr>
                                            <th  width="20%">
                                                <span>{lang.name}</span>
                                            </th>
                                            <th  width="40%">
                                                <span>App ID</span>
                                            </th>
                                            <th  width="20%">
                                                <span>{lang.url}</span>
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
                                    {count != 0 && count > size && <Pagination defaultCurrent={current} total={count} defaultPageSize = {size} onChange={this.onChange}  itemRender={this.itemRender}
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