module.exports.timestampToTime = function(time,format) {
  let date = new Date(time);
  let Y = date.getFullYear();
  let M = date.getMonth()+1;
  let D = date.getDate() ;
  let h = date.getHours();
  let i = date.getMinutes();
  let s = date.getSeconds();
  return (format.indexOf("Y") > -1 ? (Y) : "") +
  (format.indexOf("M") > -1 ? ((M < 10 ? '-0'+ M : "-"+M )) : "") + 
  (format.indexOf("D") > -1 ? ((D < 10 ? '-0'+ D : "-"+D )) : "") + 
  (format.indexOf("h") > -1 ? ((h < 10 ? ' 0'+ h : " "+h )) : "") + 
  (format.indexOf("i") > -1 ? ((i < 10 ? ':0'+ i : ":"+i )) : "") + 
  (format.indexOf("s") > -1 ? (s < 10 ? ':0'+ s : ":"+s ) : "");
}