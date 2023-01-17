const DateDifference = (date1, date2) => {

    
    
    var Difference_In_Time = date2.getTime() - date1.getTime();
    //console.log(Difference_In_Time);
    var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));

    //console.log(Difference_In_Days, date2, date1);

    return Difference_In_Days;
}

export default DateDifference;