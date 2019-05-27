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
        	did_new_data:null
        }
       
    }
	getDidInfo = async (type,range) => {
        try{
           	const result = await getDidReport(type,range);
           	this.initDidReport(result.startTime,result.data_new,result.data_total);
        }catch(err){
          console.log(err)
        }
    }
    getTransactionsInfo = async (type,range)=>{
    	try{
           	const result = await getTransactionsReport(type,range);
           	
           	this.initTransactionsReport(result.startTime,result.data_new,result.data_total);
        }catch(err){
          console.log(err)
        }
    }
    getEAppsInfo = async (type,range)=>{
    	try{
           	const result = await getEAppsReport(type,range);
           
           	this.initEappsReport(result.startTime,result.data_new,result.data_total);
        }catch(err){
          console.log(err)
        }
    }
	componentWillMount(){
		this.getDidInfo("did","1M");
		this.getTransactionsInfo("transactions","1M");
		//this.getEAppsInfo("eApps","1M");
	}
	componentDidMount(){
		jQuery(".highcharts-credits").css("display","none")
	}
	
	initDidReport(did_new_start,did_new_data,did_total_data){
		Highcharts.chart('container1', {
		    chart: {
		        zoomType: 'xy'
		    },
		    title: {
		        text: '<span style="padding:30px;display:block">Total DIDs & New DIDs (1M)</span>',
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
		        dateTimeLabelFormats: {
					day: '%b. %e'
				}
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
		        pointInterval: 24 * 3600 * 1000
		        
		    },{
		        name: 'New DIDs',
		        type: 'column',
		        yAxis: 1,
		        data: did_new_data,
		        tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(did_new_start).getTime(),
		        pointInterval: 24 * 3600 * 1000
		        
		    }]
		});
	}
	initTransactionsReport(trx_new_start,trx_new_data,trx_total_data){
		Highcharts.chart('container2', {
		    chart: {
		        zoomType: 'xy'
		    },
		    title: {
		        text: '<span style="padding:30px;display:block">Total Transactions/New Transactions (1M)</span>',
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
		        dateTimeLabelFormats: {
					day: '%b. %e'
				}},
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
		        pointInterval: 24 * 3600 * 1000
		        
		    },{
		        name: 'New Transactions',
		        type: 'column',
		        yAxis: 1,
		         data: trx_new_data,
		         tooltip: {
		            valueSuffix: ''
		        },
		        pointStart: new Date(trx_new_start).getTime(),
		        pointInterval: 24 * 3600 * 1000
		        
		    }]
		});
	}


	initEappsReport(){

		Highcharts.chart('container3', {
		    chart: {
		        zoomType: 'xy'
		    },
		    title: {
		        text: '<span style="padding:30px;display:block">Total EApps & New EApps (1W)</span>',
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
		
	
    render() {
    	const lang = this.props.lang
		
    	return (
    		<div className="container" >
    			<div className = "list_top" >
                    <div className = "list_title"><span style={{"fontSize":"25px"}}>{lang.reporting}</span></div>
                    <div className = "" style={{ "float": "right","background": "#E1E5EA","marginTop":"50px","padding": "0px 15px"}}>
                    	<span style={{"margin": "2px 20px","display": "inline-block","color": "#364458","fontSize": "14px"}}>1H</span>
                    	<span style={{"margin": "2px 20px","display": "inline-block","color": "#364458","fontSize": "14px"}}>24H</span>
                    	<span style={{"margin": "2px 20px","display": "inline-block","color": "#364458","fontSize": "14px"}}>1W</span>
                    	<span className="selected_date" style={{"margin": "2px 20px","display": "inline-block","color": "#364458","fontSize": "14px"}}>1M</span>
                    	<span style={{"margin": "2px 20px","display": "inline-block","color": "#364458","fontSize": "14px"}}>1Y</span>
                    	<span style={{"margin": "2px 20px","display": "inline-block","color": "#364458","fontSize": "14px"}}>ALL</span>
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