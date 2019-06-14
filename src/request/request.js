const addr = process.env.API_URL
//const addr = "http://45.76.178.92:3000"

console.log(addr)
const current_version = "v2"
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
export function getHeight(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/api/'+current_version+'/block/height'
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
	   	let path = addr + '/api/'+current_version+'/block/blocks?start='+start+'&pageSize='+pageSize;
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
	   	let path = addr + '/api/'+current_version+'/block/transactions?start='+start+'&pageSize='+pageSize;
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
	   	let path = addr + '/api/'+current_version+'/block/transactions_info?txid='+txid;
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


export function getTxidsFromHeight(height){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/block/transactions/txids_height?height='+height
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
		let path = addr + '/api/'+current_version+'/block/transactions/height?height='+height+'&start='+start+'&pageSize='+pageSize
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
export function getTransactionsFromDid(did){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/block/transactions/did?did='+did
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
		let path = addr + '/api/'+current_version+'/block/transactions/txid?txid='+txid
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


export function getTxFromTxid(txid){
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
		let path = addr + '/api/'+current_version+'/block/properteis/did?did='+did
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
		let path = addr + '/api/v1/block/properteis/history?key='+key+'&did='+did+'&start='+start+'&pageSize='+pageSize;
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
		let path = addr + '/api/v1/block/properteis/history/count?key='+key+'&did='+did;
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
		let path = addr + '/api/'+current_version+'/block/dids?start='+start+'&pageSize='+pageSize;
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
		let path = addr + '/api/'+current_version+'/block/dids/count';
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
		let path = addr + '/api/'+current_version+'/block/did/info?did='+did;
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
		let path = addr + '/api/'+current_version+'/block/getReport?type=' + type + '&range='+range;
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
		let path = addr + '/api/'+current_version+'/block/getReport?type=' + type + '&range='+range;
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
		let path = addr + '/api/'+current_version+'/block/getReport?type=' + type + '&range='+range;
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
		let path = addr + '/api/'+current_version+'/block/getReportTotal?type=' + type + '&range='+range;
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
export function getAddressInfo(address){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/block/getAddressInfo?address='+address;
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
		let path = addr + '/api/'+current_version+'/block/eapps?start='+start+'&pageSize='+pageSize;
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
		let path = addr + '/api/'+current_version+'/block/eapps/count';
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
export function getEappInfo(appid){
	return new Promise(function(resolve, reject) {
		let path = addr + '/api/'+current_version+'/block/eapp/info?appid='+appid;
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
