import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Layout } from 'antd';
import Router from './router/Router';
import lang_cn from './public/lang/cn.json';
import lang_en from './public/lang/en.json';
class App extends Component {
  constructor(props){
      super(props);
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
    return (
      <div className="App">
        <BrowserRouter>
          <div>
           <Layout>
              <Header onChange = {this.onChange} info = {this.state}/>
                <Content style={{"background":"#fff"}}>
                  <Router info = {this.state}/>
                </Content>
              <Footer info = {this.state} />
            </Layout>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
