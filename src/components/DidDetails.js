import React from 'react';
import {Link} from 'react-router-dom';
import {  getTransactionsFromDid } from '../request/request';
class DidDetails extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          transactions:[]
        }
    }
    componentWillMount (){
        this.GetInfo();
    }
    GetInfo = async () => {
        try{
            const transactions = await getTransactionsFromDid(this.props.match.params.did);
            this.setState({
                transactions:transactions
            })
            
        }catch(err){
          console.log(err)
        }
    }
    render() {
        const did = this.props.match.params.did;
        const { transactions } = this.state;
        const txHtml = transactions.map((tx,k) => {
            return (
               <div  key={k} style={{"marginBottom":"40px"}}>
                    <ul className = "transactionUl">
                        <li className = "liTitle">
                            <div className="floatLeft">
                                <span>{tx ? tx.txid :""}</span>
                            </div>
                            <div className="floatRight">
                                <span className="tint">{tx ? tx.local_system_time : ""}</span>
                            </div>
                        </li>
                        <li className = "liContent">
                            <div className="content1">
                                <ul>
                                    <li className="left">{tx ?  tx.did :''}</li>
                                    <li className="center">》</li>
                                    <li className="right">
                                        <ul>
                                            <li>...</li>
                                            <li><Link to={'/did/'+tx.did+'/property_history/'+tx.property_key} >key : {tx.property_key}</Link></li>
                                            <li><Link to={'/did/'+tx.did+'/property_history/'+tx.property_key} >value : {tx.property_value}</Link></li>
                                            <li>status : {tx.property_key_status}</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                           
                            <div className="content2"></div>
                            <div className="content3">
                                <span>手续费:{tx.fee}</span>
                                <span>...ELA</span>
                                <span>...确认数</span>
                            </div>
                        </li>
                    </ul>
                </div>

            )
        });
        return (
                <div className="container">
                	<div style={{"marginTop":"20px","borderBottom":"1px #ccc solid","paddingBottom":"15px","textAlign":"left","paddingLeft":"10px"}}><span style={{"fontSize":"25px"}}>DID {did}</span></div>
					<div>
                		<h2 className="title bold">交易</h2>
                		{txHtml}
                        <div style={{"textAlign":"center"}}>加载更多 》</div>
                	</div>
                </div>
        );
    }
}

export default DidDetails;