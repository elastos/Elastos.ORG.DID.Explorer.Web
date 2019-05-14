import React, { Component } from 'react';
import {BrowserRouter, Route , Switch} from 'react-router-dom';

import App from '../App'
class Router extends Component {
	
	render(){
		return(
		<BrowserRouter>
			<Switch>
				<Route exact path = "/" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/ela_did" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/transactions" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/blocks" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/eapps" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/did_detail/:did" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/transaction_detail/:txid" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/block_detail/:height" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/eapp_detail/:did" render={props=>(<App {...props}  />)}  ></Route>
		    </Switch>
		</BrowserRouter>
		)

	}
}
export default Router;