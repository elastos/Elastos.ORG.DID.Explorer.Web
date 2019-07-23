import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Layout } from 'antd';
import Home from './components/Home';
import TransactionList from './components/TransactionList';
import Blocks from './components/Blocks';
import DidList from './components/DidList';
import DidDetail from './components/DidDetail';
import TransactionDetail from './components/TransactionDetail';
import BlockDetail from './components/BlockDetail'
import EApps from './components/EApps';
import EAppDetail from './components/EAppDetail';
import AddressInfo from './components/AddressInfo'
import Reporting from './components/Reporting'
import History from './components/History'
import NoPage from './components/NoPage'
import lang_cn from './public/lang/cn.json';
import lang_en from './public/lang/en.json';
class App extends Component {
  constructor(props){
      super(props);
      console.log(this.props)
      const lang = localStorage.getItem("lang");
      this.state = {
        lang:(lang === "cn") ? lang_cn : lang_en
      }
      this.onChange = this.onChange.bind(this);
  }  
  onChange(type,data){
    if(type === "change_language" && data === "cn"){
      this.setState({
        lang:lang_cn
      })
    }else{
       this.setState({
        lang:lang_en
      })
    }
  } 
  render() {
    const {Content} = Layout;
    const path = this.props.match.path;
    const props = this.props;
    let context = ""
    switch(path){
      case '/':
        context = <Home {...props} lang = {this.state.lang}/>;
      break;
      case '/ela_did':
        context = <DidList  {...props} lang = {this.state.lang}/>;
      break;
      case '/ela_did/:property':
        context = <DidList  {...props} lang = {this.state.lang}/>;
      break;
      case '/transactions':
        context = <TransactionList  {...props} lang = {this.state.lang}/>;
      break;
      case '/blocks':
        context = <Blocks  {...props} lang = {this.state.lang}/>;
      break;
      case '/eapps':
        context = <EApps  {...props} lang = {this.state.lang}/>;
      break;
      case '/did_detail/:did':
        context = <DidDetail  {...props} lang = {this.state.lang}/>;
      break;
      case '/transaction_detail/:txid':
        context = <TransactionDetail  {...props} lang = {this.state.lang}/>;
      break;
      case '/block_detail/:height':
        context = <BlockDetail  {...props} lang = {this.state.lang}/>;
      break;
      case '/eapp_detail/:app_name':
        context = <EAppDetail  {...props} lang = {this.state.lang}/>;
      break;
      case '/address_info/:address':
        context = <AddressInfo  {...props} lang = {this.state.lang}/>;
      break;
      case '/reporting':
        context = <Reporting  {...props} lang = {this.state.lang}/>;
      break;
      case '/history/:did':
        context = <History  {...props} lang = {this.state.lang}/>;
      break;
      case '/history/:did/:key':
        context = <History  {...props} lang = {this.state.lang}/>;
      break;
      default:
        //context = <NoPage {...props} lang = {this.state.lang}/>;
        context = "";
    }
    return (
      <div className="App">
        <Header {...props} onChange = {this.onChange} lang = {this.state.lang}/>
          <Content>
            {context}
          </Content>
        <Footer {...props}  lang = {this.state.lang} />
      </div>
    );
  }
}

export default App;
