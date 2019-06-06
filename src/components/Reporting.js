import React from 'react';
import jQuery from 'jquery'
import { getDidReport, getTransactionsReport, getEAppsReport } from '../request/request';
import Highcharts from 'highcharts/highstock'
import './Reporting.css'
class Reporting extends React.Component {
	constructor(props){
        super(props);
        this.state = {
        	did_new_start:null,
        	did_new_data:null,
        	range:"1W"
        }
       
    }
	getDidInfo = async (type,range) => {
        try{
           	const result = await getDidReport(type,range);
       		const startTime = range === "24H" ? (result.start_time + ":00") : result.start_time
           	const data_new = [];
           	const data_total = [];
       		result.data_new.map((v,k)=>{data_new.push(v.count) });
           //	result.data_total.map((v,k)=>{data_total.push(v.count) });
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
           	jQuery(".highcharts-credits").remove()
        }catch(err){
          console.log(err)
        }
    }
    getEAppsInfo = async (type,range)=>{
    	try{
           	const result = await getEAppsReport(type,range);
           	const startTime = range === "24H" ? (result.startTime + ":00") : result.startTime
           	this.initEappsReport(startTime,result.data_new,result.data_total);
           	jQuery(".highcharts-credits").remove()
        }catch(err){
          console.log(err)
        }
    }
	componentWillMount(){
		const range = this.state.range
		this.getDidInfo("did",range);
		//this.getTransactionsInfo("transactions",range);
		//this.getEAppsInfo("eApps","1M");
	}
	componentDidMount(){
		jQuery(".highcharts-credits").css("display","none")
	}
	setxAxisFormate(){
		const range = this.state.range
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
		const range = this.state.range
		Highcharts.chart('container1', {
		    chart: {
		        zoomType: 'xy'
		    },
		    title: {
		        text: '<span style="padding:30px;display:block">Total DIDs & New DIDs ('+range+')</span>',
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
		        dateTimeLabelFormats: this.setxAxisFormate().dateTimeLabelFormats
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
		            text: 'Total DIDs',
		            align: 'high',
		            style: {
		                color: "#A3A0FB"
		            }
		        }
		    }, { // Secondary yAxis
		        title: {
		            text: 'New DIDs',
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
		        name: 'Total DIDs',
		        type: 'areaspline',
		       	data: did_total_data,
		       	tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(did_new_start).getTime(),
		        pointInterval: this.setxAxisFormate().pointInterval,
		        pointIntervalUnit:this.setxAxisFormate().pointIntervalUnit
		        
		    },{
		        name: 'New DIDs',
		        type: 'column',
		        yAxis: 1,
		        data: did_new_data,
		        tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(did_new_start).getTime(),
		        pointInterval: this.setxAxisFormate().pointInterval,
		        pointIntervalUnit:this.setxAxisFormate().pointIntervalUnit
		        
		    }]
		});
	}
	initTransactionsReport(trx_new_start,trx_new_data,trx_total_data){
		const range = this.state.range
		Highcharts.chart('container2', {
		    chart: {
		        zoomType: 'xy'
		    },
		    title: {
		        text: '<span style="padding:30px;display:block">Total Transactions/New Transactions ('+range+')</span>',
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
		        dateTimeLabelFormats: this.setxAxisFormate().dateTimeLabelFormats
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
		            text: 'Total Transactions',
		            align: 'high',
		            style: {
		                color: "#A3A0FB"
		            }
		        }
		    }, { // Secondary yAxis
		        title: {
		            text: 'New Transactions',
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
		        name: 'Total Transactions',
		        type: 'areaspline',
		       	 data: trx_total_data,
		       	 tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(trx_new_start).getTime(),
		        pointInterval: this.setxAxisFormate().pointInterval,
		        pointIntervalUnit:this.setxAxisFormate().pointIntervalUnit
		        
		    },{
		        name: 'New Transactions',
		        type: 'column',
		        yAxis: 1,
		         data: trx_new_data,
		         tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(trx_new_start).getTime(),
		        pointInterval: this.setxAxisFormate().pointInterval,
		        pointIntervalUnit:this.setxAxisFormate().pointIntervalUnit
		        
		    }]
		});
	}


	initEappsReport(){
		const range = this.state.range
		Highcharts.chart('container3', {
		    chart: {
		        zoomType: 'xy'
		    },
		    title: {
		        text: '<span style="padding:30px;display:block">Total EApps & New EApps ('+range+')</span>',
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
		    xAxis: [{
		        crosshair: true
		    }],
		    yAxis: [{ // Primary yAxis
		        labels: {
		            format: '',
		            style: {
		                color: "#a8a8a8"
		            }
		        },
		        title: {
		            text: 'Total EApps',
		            align: 'high',
		            style: {
		                color: "#A3A0FB"
		            }
		        }
		    }, { // Secondary yAxis
		        title: {
		            text: 'New EApps',
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
		        name: 'Total EApps',
		        type: 'areaspline',
		       	data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6,7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6,25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
		        tooltip: {
		            valueSuffix: ''
		        },
		        
		    },{
		        name: 'New EApps',
		        type: 'column',
		        yAxis: 1,
		        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4,49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4,135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
		        tooltip: {
		            valueSuffix: ''
		        },
		        
		    }]
		});
	}
	changRange(range){
		console.log(range)
		this.setState({
			range:range
		})
		this.getDidInfo("did",range);
		this.getTransactionsInfo("transactions",range);
	}
	
    render() {
    	const lang = this.props.lang
		const range = this.state.range
    	return (
    		<div className="container" >
    			<div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.reporting}</span></div>
                    <div className = "rangeSelecter" style={{ "float": "right","background": "#E1E5EA","marginTop":"50px","padding": "0px 15px"}}>
                    	<span className={range==="1H"? "selected_date":""} onClick={this.changRange.bind(this,"1H")}>1H</span>
                    	<span className={range==="24H"? "selected_date":""} onClick={this.changRange.bind(this,"24H")}>24H</span>
                    	<span className={range==="1W"? "selected_date":""} onClick={this.changRange.bind(this,"1W")}>1W</span>
                    	<span className={range==="1M"? "selected_date":""} onClick={this.changRange.bind(this,"1M")}>1M</span>
                    	<span className={range==="1Y"? "selected_date":""} onClick={this.changRange.bind(this,"1Y")}>1Y</span>
                    	<span className={range==="ALL"? "selected_date":""} onClick={this.changRange.bind(this,"ALL")}>ALL</span>
                    </div>
                </div>
                
				<div id="container1" style={{"minWidth":"400px","height":"400px","marginTop":"50px"}}></div>
				<div id="container2" style={{"minWidth":"400px","height":"400px","marginTop":"50px"}}></div>
				<div id="container3" style={{"minWidth":"400px","height":"400px","marginTop":"50px"}}></div>
			</div>
    	)
    }
}

export default Reporting;