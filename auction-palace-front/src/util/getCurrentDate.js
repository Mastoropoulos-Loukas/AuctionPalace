
function getCurrentDate(){

    const current= new Date();
    const year=current.getFullYear();
    const month = current.getMonth()+1;
    const day = current.getDate();
    const hours =current.getHours();
    const mins = current.getMinutes();
    const secs = current.getSeconds();


    const today= `${year}-${month<10?`0${month}`:`${month}`}-${day<10?`0${day}`:`${day}`}T${hours}:${mins<10?`0${mins}`:`${mins}`}:${secs<10?`0${secs}`:`${secs}`}`;
    
    
    return today;
}
function getCurrentDateWithoutT(){

    const current= new Date();
    const year=current.getFullYear();
    const month = current.getMonth()+1;
    const day = current.getDate();
    const hours =current.getHours();
    const mins = current.getMinutes();
    const secs = current.getSeconds();


    const today= `${year}-${month<10?`0${month}`:`${month}`}-${day<10?`0${day}`:`${day}`} ${hours}:${mins<10?`0${mins}`:`${mins}`}:${secs<10?`0${secs}`:`${secs}`}`;
    
    
    return today;
}

export {getCurrentDate,getCurrentDateWithoutT}