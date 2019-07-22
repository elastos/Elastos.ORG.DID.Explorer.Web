import React, { Component } from 'react';
import {BrowserRouter, Route , Switch} from 'react-router-dom';

import App from '../App'
import NoPage from '../components/NoPage'
class Router extends Component {
	
	render(){
		return(
		<BrowserRouter>
			<Switch>
				<Route exact path = "/" render={props=>(<App {...props}  />)}  ></Route>
				<Route exact path = "/ela_did" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/ela_did/:property" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/transactions" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/blocks" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/eapps" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/did_detail/:did" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/transaction_detail/:txid" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/block_detail/:height" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/eapp_detail/:app_name" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/address_info/:address" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/reporting" render={props=>(<App {...props}  />)}  ></Route>
				<Route exact path = "/history/:did" render={props=>(<App {...props}  />)}  ></Route>
				<Route path = "/history/:did/:key" render={props=>(<App {...props}  />)}  ></Route>
				<Route render={props=>(<NoPage {...props}  />)}  ></Route>
		    </Switch>
		</BrowserRouter>
		)

	}
}
export default Router;