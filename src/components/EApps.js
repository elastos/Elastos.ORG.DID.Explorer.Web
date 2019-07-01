import React from 'react';
import { getEapps , getEappsCount, getEappInfo } from '../request/request';
import {Link} from 'react-router-dom';
import { Pagination } from 'antd';
import './eapp.css';

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
//const eapps = [{"id":84808,"did":"iXPdWf6RtT2bGmxB8B15dv1W835KYkckN3","did_status":1,"public_key":"03de8a8d28d854f115306c5c73bcc7b040a125a8f50864f73ea9d9c6abbb7e59e8","property_key":"Dev/ELA News/AppID","property_key_status":1,"property_value":"7277effb64cd41460829a4d1262884e1c4049dc2aaf2c091160385ccabbf6b31028988dcebd5995a34207964d859f4e5718111afcc1ab13c6e07f073931e0d93","info_type":"app_name","info_value":"ELA News","txid":"bdf67115ea28b1e181f8a3eb5534a6a4af619ed9ea004d14548a413c172d20ee","block_time":1561048078,"height":188017,"local_system_time":"2019-06-20T16:29:14.000Z"},{"id":63316,"did":"iqtsbtKiVUoAXGY9G8YxTdU6h6Vt1LxHsa","did_status":1,"public_key":"027a15e6d22d9b080224f1a58c516d6fb838c5891350b5f311928c37f18a43c81a","property_key":"Dev/ELA Bank vote/AppID","property_key_status":1,"property_value":"4de01b0013bd4e5611e93107c72c09cb813680fd6c3c7fddb0dca5a739327d76d30dfd5768c8da47b29dc6c1c928b4c1f08fdb23a926e713abcbee9c2f13c16c","info_type":"app_name","info_value":"ELA Bank vote","txid":"7ff17c43583f0ff7c7e03a36169dbe7772081b3735d9c477832ffa24674462fc","block_time":1560737621,"height":186349,"local_system_time":"2019-06-17T02:15:04.000Z"},{"id":47411,"did":"iiJRtAn6wyHaMSDQPS9Kkft3iiNjH5tTmi","did_status":1,"public_key":"02752f9483df73c57edea1f84f2431dc1036b2643f9519e78cb660d8c332793edc","property_key":"Dev/dopsvote.h5.app/Release/Web/1.0.0","property_key_status":1,"property_value":"{\"url\":\"http://elaphant.net/vote.capsule\",\"hash\":\"053b248929d793565fdc09f94f70ebce88d8c57926e3abe621ebb5f507df0c32\"}","info_type":"app_name","info_value":"dopsvote.h5.app","txid":"12440466c82642805ba90d4cd4bdd77995f084c4d1ce445cc4131fd863ca692b","block_time":1560506602,"height":185136,"local_system_time":"2019-06-14T10:08:36.000Z"},{"id":47393,"did":"inS5F9nZ8nV2v5w2tGL8PbNbgwXU1Ry9uG","did_status":1,"public_key":"03dd46b1e064a0bd0ba9a0fefe58e4703eb44189d137462f4fa5181ee42a8f61ae","property_key":"Dev/Red Packet/Release/Web/1.0.0","property_key_status":1,"property_value":"{\"url\":\"https://redpacket.elastos.org/redpacket.capsule\",\"hash\":\"8c62d72a6e970009f7741f7eb6d82591dca5e140d638b660392b078ccdd47df3\"}","info_type":"app_name","info_value":"Red Packet","txid":"9fcb5128a86839936888471a0e64e96eb8ae7d994719f4aedc7c63e7b3ffc8c6","block_time":1560506310,"height":185134,"local_system_time":"2019-06-14T09:59:15.000Z"},{"id":46483,"did":"ioSDDMnxoPWxZqDiRCLAjhCqKgZUQwm44R","did_status":1,"public_key":"03a1c183e9274dca97c8eae0ffbabf269f580fbc707504a9133fefce69c993ed5e","property_key":"Dev/SWFT/AppID","property_key_status":1,"property_value":"bbe5d8975b210e3832461bf0ef913d455434402ef74caa3c95b97d7ff86cfb0c0c7dab271bbb071c81630c6088da317a6afe7d1c691c844e7719fb9a72108f57","info_type":"app_name","info_value":"SWFT","txid":"991144e4996f879a6011e4f9c0bd8508e48e1ae785239c1035bd4c423afe5e25","block_time":1560494577,"height":185072,"local_system_time":"2019-06-14T06:46:07.000Z"},{"id":22755,"did":"imcZ12cNzYL6HxAQqcvFnZZBWu2Ej7Kskg","did_status":1,"public_key":"0351c055de2e174d68d438cf159cd0eaa1d9ef6d6fd7553ec4eb815f92be3d7514","property_key":"Dev/Coin Pigger/AppID","property_key_status":1,"property_value":"91284b0fe60b7db614c3fb6969ed1bef5ae5cc0d4d587c6b041323529756631e1faef0bc86b257b7fdd3697abebd239a7464d238ab1747a4a3026a6cd1ec84ca","info_type":"app_name","info_value":"Coin Pigger","txid":"fe6f44e3f75b3632264883625b334d40e3af9fbc8ba049e02606e8ed0602dc5f","block_time":1560136462,"height":183221,"local_system_time":"2019-06-10T04:29:56.000Z"}];

            this.setState({
                eapps:eapps, 
                loading:false              
            })
            /*Object.keys(eapps).map((eapp,k) => {
                return this.getEappInfo(k,eapps[k].did)                
            });*/
            const count = await getEappsCount();
             this.setState({
                count:count[0].count,
                 loading:false
            })
        }catch(err){
          console.log(err)
        }
    }
    getEappInfo = async (k,did)=>{
        try{
            const eapp = await getEappInfo(did);
           // let transactions = this.state.transactions;
            //transactions[k].createTime = transaction[0].createTime;
            //transactions[k].length_memo = transaction[0].length_memo;
           // this.setState({transactions:transactions})
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
                    <td width="20%"><Link to={'/eapp_detail/'+eapp.info_value+'/'+(eapp.property_key != null && eapp.property_key.indexOf("AppID") > -1 ? eapp.property_value : '...')}>
                    	{/*<img src={okb_mid}/>*/}<span style={{"paddingLeft":"5px"}}>{eapp.info_value}</span>
                    </Link></td>
                    <td width="40%">{eapp.property_key != null && eapp.property_key.indexOf("AppID") > -1 ? eapp.property_value : '...'}</td>
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