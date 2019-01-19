import React, { Component } from 'react';
import {Route , Switch} from 'react-router-dom';
import Blocks from '../components/Blocks';
import DidDetails from '../components/DidDetails';
import BlockInfo from '../components/BlockInfo';
import TransactionList from '../components/TransactionList';
import PropertiesHistory from '../components/PropertiesHistory';
import PropertiesList from '../components/PropertiesList';
import TxInfo from '../components/TxInfo';
class Router extends Component {
	
	render(){
		return(
			<Switch>
				<Route exact path = "/" render={props=>(<Blocks {...props} lang = {this.props.info.lang}/>)}  ></Route>
				<Route path="/blocks" render={props=>(<Blocks {...props} lang = {this.props.info.lang}/>)} ></Route>
				<Route path="/height/:height" render={props=>(<BlockInfo {...props} lang = {this.props.info.lang}/>)} ></Route>
			    <Route path="/detail/:did" render={props=>(<DidDetails {...props} lang = {this.props.info.lang}/>)} ></Route>
			    <Route path="/txinfo/:txid" render={props=>(<TxInfo {...props} lang = {this.props.info.lang}/>)} ></Route>
			    <Route path="/list" render={props=>(<TransactionList {...props} lang = {this.props.info.lang}/>)}  ></Route>
			    <Route path="/did/:did/property_history/:key" render={props=>(<PropertiesHistory {...props} lang = {this.props.info.lang}/>)} ></Route>
			    <Route path="/properties_list/:did" render={props=>(<PropertiesList {...props} lang = {this.props.info.lang}/>)}  ></Route>
		    </Switch>
		)

	}
}
export default Router;