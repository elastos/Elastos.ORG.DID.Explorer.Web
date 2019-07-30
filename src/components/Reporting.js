import React from 'react';
import jQuery from 'jquery'
import { getDidReport, getTransactionsReport, getEAppsReport, getReportTotal } from '../request/request';
import Highcharts from 'highcharts/highstock'
import './Reporting.css'
class Reporting extends React.Component {
	constructor(props){
        super(props);
        this.state = {
        	did_new_start:null,
        	did_new_data:null,
        	range_did:"1W",
        	range_transactions:"1W",
        	range_app:"1W"
        }
       
    }
	getDidInfo = async (type,range) => {
        try{
        	//console.log(type)
        	//console.log(range)
           	const result = await getDidReport(type,range);
       		const startTime = range === "24H" ? (result.start_time + ":00") : result.start_time
           	const data_new = [];
           	const data_total = [];
       		result.data_new.map((v,k)=>{data_new.push(v.count) });
           //	result.data_total.map((v,k)=>{data_total.push(v.count) });
           	this.initDidReport(startTime,data_new,data_total);
           	const result_total = await getReportTotal(type,range);
           	var total =  result_total[0].count;
           	result.data_new.map((v,k)=>{
           		total += v.count;
           		data_total.push(total)
           	});
           	this.initDidReport(startTime,data_new,data_total);
           	jQuery(".highcharts-credits").remove()
        }catch(err){
          console.log(err)
        }
    }
    getTransactionsInfo = async (type,range)=>{
    	try{
           	const result = await getTransactionsReport(type,range);
       		const startTime = range === "24H" ? (result.start_time + ":00") : result.start_time
           	const data_new = [];
           	const data_total = [];
       		result.data_new.map((v,k)=>{data_new.push(v.count) });
           	//result.data_total.map((v,k)=>{data_total.push(v.count) });
           	this.initTransactionsReport(startTime,data_new,data_total);
           	const result_total = await getReportTotal(type,range);
           	var total =  result_total[0].count;
           	result.data_new.map((v,k)=>{
           		total += v.count;
           		data_total.push(total)
           	});
           	this.initTransactionsReport(startTime,data_new,data_total);
           	jQuery(".highcharts-credits").remove()
        }catch(err){
          console.log(err)
        }
    }
    componentWillReceiveProps(nextProps) {
       	const range_did = this.state.range_did
		const range_transactions = this.state.range_transactions
		const reange_app = this.state.range_app
		this.getDidInfo("did",range_did);
		this.getTransactionsInfo("transactions",range_transactions);
		this.getEAppsInfo("apps",reange_app);
    }
    getEAppsInfo = async (type,range)=>{
    	try{
    		//console.log(type)
    		//console.log(range)
           	const result = await getEAppsReport(type,range);
           	const startTime = range === "24H" ? (result.start_time + ":00") : result.start_time
           	const data_new = [];
           	const data_total = [];
           	result.data_new.map((v,k)=>{data_new.push(v.count) });
           	this.initEappsReport(startTime,data_new,data_total);
           	const result_total = await getReportTotal(type,range);
           	var total =  result_total[0].count;
           	result.data_new.map((v,k)=>{
           		total += v.count;
           		data_total.push(total)
           	});
           	this.initEappsReport(startTime,data_new,data_total);
           	jQuery(".highcharts-credits").remove()
        }catch(err){
          console.log(err)
        }
    }
	componentWillMount(){
		const range_did = this.state.range_did
		const range_transactions = this.state.range_transactions
		const reange_app = this.state.range_app
		this.getDidInfo("did",range_did);
		this.getTransactionsInfo("transactions",range_transactions);
		this.getEAppsInfo("apps",reange_app);
	}
	componentDidMount(){
		jQuery(".highcharts-credits").css("display","none")
	}
	setxAxisFormate(range){
		let dateTimeLabelFormats,pointInterval,pointIntervalUnit;
		switch(range){
			case "1H"  :  dateTimeLabelFormats = {minute: '%H:%M'};  pointInterval = 60 * 1000 ; break;
			case "24H" :  dateTimeLabelFormats = {hour: '%H:%M'};  pointInterval = 3600 * 1000 ; break;
			case "1W"  :  dateTimeLabelFormats = {day: '%b. %e'};  pointInterval = 24 * 3600 * 1000 ; break;
			case "1M"  :  dateTimeLabelFormats = {day: '%b. %e'};  pointInterval = 24 * 3600 * 1000 ; break;
			case "1Y"  :  dateTimeLabelFormats = {month: '%b \'%y'};  pointIntervalUnit = "month" ; break;
			case "ALL" :  dateTimeLabelFormats = {day: '%b. %e'};  pointInterval = 24 * 3600 * 1000 ; break;
		}
		return {
			dateTimeLabelFormats:dateTimeLabelFormats,pointInterval:pointInterval,pointIntervalUnit:pointIntervalUnit
		}		
	}
	initDidReport(did_new_start,did_new_data,did_total_data){
		const range = this.state.range_did
		const lang = this.props.lang
		Highcharts.chart('container1', {
		    chart: {
		        zoomType: 'xy'
		    },
		    title: {
		        text: '<span style="padding:30px;display:block">'+lang.total_dids+' & '+lang.new_dids+' ('+range+')</span>',
		        style:{
		        	color:"#080251",
		        	fontSize: "20px"
		        },
		        margin:25,
		        useHTML:true
		    },
		    subtitle: {
		        text: ''
		    },
		    xAxis: {
		        type: 'datetime',
		        dateTimeLabelFormats: this.setxAxisFormate(range).dateTimeLabelFormats
		    },
		    yAxis: [{ // Primary yAxis
		        labels: {
		            formatter: function () {
						return this.value > 1000 ? (this.value / 1000 + 'k') : this.value;
					},
		            style: {
		                color: "#a8a8a8"
		            }
		        },
		        title: {
		            text: lang.total_dids,
		            align: 'high',
		            style: {
		                color: "#A3A0FB"
		            }
		        }
		    }, { // Secondary yAxis
		        title: {
		            text: lang.new_dids,
		            align: 'high',
		            style: {
		                color: "#6DDBFF"
		            }
		        },
		        labels: {
		            formatter: function () {
						return this.value > 1000 ? (this.value / 1000 + 'k') : this.value;
					},
		            style: {
		                color: "#a8a8a8"
		            }
		        },
		        opposite: true
		    }],
		    plotOptions: {
				areaspline: {
					lineWidth: 1,
					color:"#A3A0FB",
					fillColor: {
						linearGradient: {
							x1: 0,
							y1: 0,
							x2:0,
							y2: 1
						},
						stops: [
							[0, "rgba(164,161,251,0.5)"],
							[1, "rgba(248,248,255,0.3)"]
						]
					},
					marker: {
						fillColor: '#FFF',
						lineWidth: 1,
						lineColor: "#A3A0FB",
						states: {
							hover: {
								fillColor: '#A3A0FB',
							}
						}
					},
				},
				column:{
					color:"#D3F4FF",
					borderRadius:"5px",
					pointWidth: 10,
					states: {
						hover: {
							color: '#6DDBFF',
						}
					}
				}
			},
		    tooltip: {
		        shared: true,
		        backgroundColor:"#D6DADC",
		        borderColor:"#D6DADC"
		    },
		    legend: {
		        layout: 'horizontal', 
		        align: 'left',
		        verticalAlign: 'bottom',
		        x: 30,
		        y: 0,
		        itemDistance: 40,
		        squareSymbol:false,
				symbolPadding: 10,
				symbolWidth: 40,
				symbolHeight:10
		    },
		    
		    series: [{
		        name: lang.total_dids,
		        type: 'areaspline',
		       	data: did_total_data,
		       	tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(did_new_start).getTime(),
		        pointInterval: this.setxAxisFormate(range).pointInterval,
		        pointIntervalUnit:this.setxAxisFormate(range).pointIntervalUnit
		        
		    },{
		        name: lang.new_dids,
		        type: 'column',
		        yAxis: 1,
		        data: did_new_data,
		        tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(did_new_start).getTime(),
		        pointInterval: this.setxAxisFormate(range).pointInterval,
		        pointIntervalUnit:this.setxAxisFormate(range).pointIntervalUnit
		        
		    }]
		});
	}
	initTransactionsReport(trx_new_start,trx_new_data,trx_total_data){
		const range = this.state.range_transactions
		const lang = this.props.lang
		Highcharts.chart('container2', {
		    chart: {
		        zoomType: 'xy'
		    },
		    title: {
		        text: '<span style="padding:30px;display:block">'+lang.total_transactions+'/'+lang.new_transactions+' ('+range+')</span>',
		        style:{
		        	color:"#080251",
		        	fontSize: "20px"
		        },
		        margin:25,
		        useHTML:true
		    },
		    subtitle: {
		        text: ''
		    },
		    xAxis: {
		    	type: 'datetime',
		        dateTimeLabelFormats: this.setxAxisFormate(range).dateTimeLabelFormats
		    },
		    yAxis: [{ // Primary yAxis
		        labels: {
		            formatter: function () {
						return this.value > 1000 ? (this.value / 1000 + 'k') : this.value;
					},
		            style: {
		                color: "#a8a8a8"
		            }
		        },
		        title: {
		            text: lang.total_transactions,
		            align: 'high',
		            style: {
		                color: "#A3A0FB"
		            }
		        }
		    }, { // Secondary yAxis
		        title: {
		            text: lang.new_transactions,
		            align: 'high',
		            style: {
		                color: "#6DDBFF"
		            }
		        },
		        labels: {
		            formatter: function () {
						return this.value > 1000 ? (this.value / 1000 + 'k') : this.value;
					},
		            style: {
		                color: "#a8a8a8"
		            }
		        },
		        opposite: true
		    }],
		    plotOptions: {
				areaspline: {
					lineWidth: 1,
					color:"#A3A0FB",
					fillColor: {
						linearGradient: {
							x1: 0,
							y1: 0,
							x2:0,
							y2: 1
						},
						stops: [
							[0, "rgba(164,161,251,0.5)"],
							[1, "rgba(248,248,255,0.3)"]
						]
					},
					marker: {
						fillColor: '#FFF',
						lineWidth: 1,
						lineColor: "#A3A0FB",
						states: {
							hover: {
								fillColor: '#A3A0FB',
							}
						}
					},
				},
				column:{
					color:"#D3F4FF",
					borderRadius:"5px",
					pointWidth: 10,
					states: {
						hover: {
							color: '#6DDBFF',
						}
					}
				},
			},
		    tooltip: {
		        shared: true,
		        backgroundColor:"#D6DADC",
		        borderColor:"#D6DADC"
		    },
		    legend: {
		        layout: 'horizontal', 
		        align: 'left',
		        verticalAlign: 'bottom',
		        x: 30,
		        y: 0,
		        itemDistance: 40,
		        squareSymbol:false,
				symbolPadding: 10,
				symbolWidth: 40,
				symbolHeight:10
		    },
		    
		    series: [{
		        name: lang.total_transactions,
		        type: 'areaspline',
		       	data: trx_total_data,
		       	tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(trx_new_start).getTime(),
		        pointInterval: this.setxAxisFormate(range).pointInterval,
		        pointIntervalUnit:this.setxAxisFormate(range).pointIntervalUnit
		        
		    },{
		        name: lang.new_transactions,
		        type: 'column',
		        yAxis: 1,
		         data: trx_new_data,
		         tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(trx_new_start).getTime(),
		        pointInterval: this.setxAxisFormate(range).pointInterval,
		        pointIntervalUnit:this.setxAxisFormate(range).pointIntervalUnit
		        
		    }]
		});
	}


	initEappsReport(app_new_start,app_new_data,app_total_data){
		const range = this.state.range_app
		const lang = this.props.lang
		Highcharts.chart('container3', {
		    chart: {
		        zoomType: 'xy'
		    },
		    title: {
		        text: '<span style="padding:30px;display:block">'+lang.new_apps+' & '+lang.total_apps+' ('+range+')</span>',
		        style:{
		        	color:"#080251",
		        	fontSize: "20px"
		        },
		        margin:25,
		        useHTML:true
		    },
		    subtitle: {
		        text: ''
		    },
		    xAxis: {
		        type: 'datetime',
		       dateTimeLabelFormats: this.setxAxisFormate(range).dateTimeLabelFormats
		    },
		    yAxis: [{ // Primary yAxis
		        labels: {
		            format: '',
		            style: {
		                color: "#a8a8a8"
		            }
		        },
		        title: {
		            text: lang.total_apps,
		            align: 'high',
		            style: {
		                color: "#A3A0FB"
		            }
		        }
		    }, { // Secondary yAxis
		        title: {
		            text: lang.new_apps,
		            align: 'high',
		            style: {
		                color: "#6DDBFF"
		            }
		        },
		        labels: {
		            format: '',
		            style: {
		                color: "#a8a8a8"
		            }
		        },
		        opposite: true
		    }],
		    plotOptions: {
				areaspline: {
					lineWidth: 1,
					color:"#A3A0FB",
					fillColor: {
						linearGradient: {
							x1: 0,
							y1: 0,
							x2:0,
							y2: 1
						},
						stops: [
							[0, "rgba(164,161,251,0.5)"],
							[1, "rgba(248,248,255,0.3)"]
						]
					},
					marker: {
						fillColor: '#FFF',
						lineWidth: 1,
						lineColor: "#A3A0FB",
						states: {
							hover: {
								fillColor: '#A3A0FB',
							}
						}
					},
				},
				column:{
					color:"#D3F4FF",
					borderRadius:"5px",
					pointWidth: 10,
					states: {
						hover: {
							color: '#6DDBFF',
						}
					}
				},
			},
		    tooltip: {
		        shared: true,
		        backgroundColor:"#D6DADC",
		        borderColor:"#D6DADC"
		    },
		    legend: {
		        layout: 'horizontal', 
		        align: 'left',
		        verticalAlign: 'bottom',
		        x: 30,
		        y: 0,
		        itemDistance: 40,
		        squareSymbol:false,
				symbolPadding: 10,
				symbolWidth: 40,
				symbolHeight:10
		    },
		    
		    series: [{
		        name: lang.total_apps,
		        type: 'areaspline',
		       	data: app_total_data,
		       	tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(app_new_start).getTime(),
		        pointInterval: this.setxAxisFormate(range).pointInterval,
		        pointIntervalUnit:this.setxAxisFormate(range).pointIntervalUnit
		        
		    },{
		        name: lang.new_apps,
		        type: 'column',
		        yAxis: 1,
		         data: app_new_data,
		         tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(app_new_start).getTime(),
		        pointInterval: this.setxAxisFormate(range).pointInterval,
		        pointIntervalUnit:this.setxAxisFormate(range).pointIntervalUnit
		        
		    }]
		});
	}
	changRange(type,range){
		
		if(type === "did"){
			this.setState({
				range_did:range
			})
			this.getDidInfo("did",range);
		}
		if(type === "transactions"){
			this.setState({
				range_transactions:range
			})
			this.getTransactionsInfo("transactions",range);
		}
		if(type==="apps"){
			this.setState({
				range_app:range
			})
			this.getEAppsInfo("apps",range);
		}
		
		
	}
	
    render() {
    	const lang = this.props.lang
		const range_did = this.state.range_did;
    	const range_transactions = this.state.range_transactions;
    	const range_app = this.state.range_app
    	return (
    		<div className="container" >
    			<div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.reporting}</span></div>
                    <div className = "rangeSelecter" style={{ "float": "right","background": "#E1E5EA","marginTop":"50px","padding": "0px 15px"}}>
                    	<span className={range_did==="1H"? "selected_date":""} onClick={this.changRange.bind(this,"did","1H")}>{lang["1h"]}</span>
                    	<span className={range_did==="24H"? "selected_date":""} onClick={this.changRange.bind(this,"did","24H")}>{lang["24h"]}</span>
                    	<span className={range_did==="1W"? "selected_date":""} onClick={this.changRange.bind(this,"did","1W")}>{lang["1w"]}</span>
                    	<span className={range_did==="1M"? "selected_date":""} onClick={this.changRange.bind(this,"did","1M")}>{lang["1m"]}</span>
                    	<span className={range_did==="1Y"? "selected_date":""} onClick={this.changRange.bind(this,"did","1Y")}>{lang["1y"]}</span>
                    	<span className={range_did==="ALL"? "selected_date":""} onClick={this.changRange.bind(this,"did","ALL")}>{lang.all}</span>
                    </div>
                </div>
                
				<div id="container1" style={{"minWidth":"400px","height":"400px","marginTop":"50px"}}></div>
				<div className = "list_top" style={{"margin":"0px"}}>
					<div className = "rangeSelecter" style={{ "float": "right","background": "#E1E5EA","marginTop":"50px","padding": "0px 15px"}}>
                    	<span className={range_transactions==="1H"? "selected_date":""} onClick={this.changRange.bind(this,"transactions","1H")}>{lang["1h"]}</span>
                    	<span className={range_transactions==="24H"? "selected_date":""} onClick={this.changRange.bind(this,"transactions","24H")}>{lang["24h"]}</span>
                    	<span className={range_transactions==="1W"? "selected_date":""} onClick={this.changRange.bind(this,"transactions","1W")}>{lang["1w"]}</span>
                    	<span className={range_transactions==="1M"? "selected_date":""} onClick={this.changRange.bind(this,"transactions","1M")}>{lang["1m"]}</span>
                    	<span className={range_transactions==="1Y"? "selected_date":""} onClick={this.changRange.bind(this,"transactions","1Y")}>{lang["1y"]}</span>
                    	<span className={range_transactions==="ALL"? "selected_date":""} onClick={this.changRange.bind(this,"transactions","ALL")}>{lang.all}</span>
                    </div>
				</div>
				<div id="container2" style={{"minWidth":"400px","height":"400px","marginTop":"50px"}}></div>
				<div className = "list_top" style={{"margin":"0px"}}>
					<div className = "rangeSelecter" style={{ "float": "right","background": "#E1E5EA","marginTop":"50px","padding": "0px 15px"}}>
                    	<span className={range_app==="1H"? "selected_date":""} onClick={this.changRange.bind(this,"apps","1H")}>{lang["1h"]}</span>
                    	<span className={range_app==="24H"? "selected_date":""} onClick={this.changRange.bind(this,"apps","24H")}>{lang["24h"]}</span>
                    	<span className={range_app==="1W"? "selected_date":""} onClick={this.changRange.bind(this,"apps","1W")}>{lang["1w"]}</span>
                    	<span className={range_app==="1M"? "selected_date":""} onClick={this.changRange.bind(this,"apps","1M")}>{lang["1m"]}</span>
                    	<span className={range_app==="1Y"? "selected_date":""} onClick={this.changRange.bind(this,"apps","1Y")}>{lang["1y"]}</span>
                    	<span className={range_app==="ALL"? "selected_date":""} onClick={this.changRange.bind(this,"apps","ALL")}>{lang.all}</span>
                    </div>
				</div>
				<div id="container3" style={{"minWidth":"400px","height":"400px","marginTop":"50px"}}></div>
			</div>
    	)
    }
}

export default Reporting;