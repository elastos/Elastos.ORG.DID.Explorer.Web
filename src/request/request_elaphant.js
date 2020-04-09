const addr = process.env.API_ELAPHANT_URL
const current_version = "2/didexplorer"
export function getServerInfo(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/serverInfo'
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getCurrentBlock(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/current'
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}

export function getCurrentHeight(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/current/height'
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getValuesFromTxid(txid){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/values?txid='+txid
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}

export function getBlockInfo(height){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/info?height='+height
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}
export function getBlocksInfo(height){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/blocks_info?height='+height
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}
export function getTransactionsCountFromHeight(height){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/transactions_count?height='+height
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}


export function getBlocksCount(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/blocks/count'
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getBlocks(start,pageSize){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/blocks?start='+start+'&pagesize='+pageSize;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getLastBlocks(){
	return new Promise(function(resolve, reject) {
	   	//let path = addr + '/api/'+current_version+'/block/blocks_last';
	   	let path = addr + '/api/'+current_version+'/block/current/height';
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getFirstBlocks(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/blocks_first';
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}

export function getTransactionsCount(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/transactions/count'
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getTransactions(start,pageSize){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/transactions?start='+start+'&pagesize='+pageSize;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getTransactionsInfo(txid){
	return new Promise(function(resolve, reject) {
	   	//let path = addr + '/api/'+current_version+'/block/transactions_info?txid='+txid;
	   	let path = addr + '/api/'+current_version+'/block/transactions/txid?txid='+txid;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}


export function getTransactionsFromHeight(height,start,pageSize){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/block/transactions/height?height='+height+'&start='+start+'&pagesize='+pageSize
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}

export function getTransactionsFromTxid(txid){
	return new Promise(function(resolve, reject) {
		//let path = addr + '/api/'+current_version+'/transactions/txid?txid='+txid
	    let path = addr + '/api/'+current_version+'/block/transactions/txid?txid='+txid;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}

export function getTxDetailFromTxid(txid){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/block/transactions/info?txid='+txid
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}


export function getPropertiesFromDid(did){
	return new Promise(function(resolve, reject) {
		//let path = addr + '/api/'+current_version+'/properteis/did?did='+did
		let path = addr + '/api/'+current_version+'/block/properties/did?did='+did
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getAddressFromTxid(txid){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/address/txid?txid='+txid
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getDidFromTxid(txid){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/did/txid?txid='+txid
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}


export function getPropertyChanges(key,did,start,pageSize){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/did/'+did+'/property_history?key='+key+'&page='+start+'&size='+pageSize;
	   // https://api-explorer.elaphant.app/api/2/didexplorer/did/ifVnMTiiPj8WQPvPGxDkJ5q9mCBg8GDHKM/property_history?key=usersign&page=1&size=3
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}

export function getPropertiesHistoryCount(key,did){
	return new Promise(function(resolve, reject) {
		//let path = addr + '/api/'+current_version+'/properties/history/count?key='+key+'&did='+did;
	    let path = addr + '/api/'+current_version+'/did/'+did+'/property_history/count?key='+key;
	   
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}

export function getDids(start,pageSize){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/dids?start='+start+'&pageSize='+pageSize;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}

export function getDidsWithProperty(start,pageSize,property){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/property?key='+property+'&page='+start+'&size='+pageSize;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}

export function getDidCount(){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/dids/count';
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getDidCountWidthProperty(property){
	return new Promise(function(resolve, reject) {
		//let path = addr + '/api/'+current_version+'/dids/countWithProperty?property='+property;
		let path = addr + '/api/'+current_version+'/property/count?key=' + property;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getDidInfo(did){
	return new Promise(function(resolve, reject) {
		//let path = addr + '/api/'+current_version+'/did/info?did='+did;
		let path = addr + '/api/'+current_version+'/did/'+did;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getDidReport(type,range){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/getReport?type=' + type + '&range='+range;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getTransactionsReport(type,range){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/getReport?type=' + type + '&range='+range;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getEAppsReport(type,range){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/getReport?type=' + type + '&range='+range;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getReportTotal(type,range){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/getReportTotal?type=' + type + '&range='+range;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getAddressInfo(address,start,pageSize){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/getAddressInfo?address='+address+'&start='+start+'&pagesize='+pageSize;
		let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}
export function getAddressInfoFromNodeApi(address,start,pageSize){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/getAddressInfoFromNodeApi?address='+address+'&start='+start+'&pagesize='+pageSize;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}
export function getTransactionInfoFromNodeApi(txid){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/getTransactionInfoFromNodeApi?txid='+txid;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}

export function getAddressBalance(address,start,pageSize){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/getBalanceFromNodeApi?address='+address
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}
export function getTransactionsCountFromAddress(address){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/getTransactionsCountFromAddress?address='+address;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}

export function getEapps(start,pageSize){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/eapps?start='+start+'&pagesize='+pageSize;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}
export function getEappsCount(){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/eapps/count';
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}
export function getEappId(app_name){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/eapp/appName?app_name='+app_name;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});

}
