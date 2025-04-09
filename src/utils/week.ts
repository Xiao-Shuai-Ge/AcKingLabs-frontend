

export const getWeekday = (date: Date) => {
    return [7,1,2,3,4,5,6][date.getDay()];
};

export const getWeekCode = (date: Date) => {
    let timestamp = date.getTime();
    // 先后退两天，因为如果是星期一二的话，应该是打卡上周
    timestamp -= 2*24*3600*1000;
    console.log(new Date(timestamp))
    // 然后退回到周一中午
    timestamp -= (getWeekday(new Date(timestamp))-1)*24*3600*1000;
    timestamp -= (timestamp + 8*3600*1000) % (24*3600*1000);
    // UTC时间比北京时间晚8小时
    timestamp += 12*60*60*1000;
    console.log(new Date(timestamp))
    // 如果现在时间戳离 (timestamp+一周) 相差超过1天，不允许打卡
    if (Math.abs(date.getTime() - (timestamp+7*24*3600*1000)) > 24*3600*1000) {
        return {
            name : "打卡时间无效",
            code : "",
        };
    }
    // 时间往后退，直到月份变化
    let res = 0;

    const month = (new Date(timestamp)).getMonth()+1;
    const year = (new Date(timestamp)).getFullYear();
    while (new Date(timestamp).getMonth()+1 === month) {
        res++;
        timestamp -= 7*24*3600*1000;
        console.log("现在是",new Date(timestamp))
    }
    let newDate = new Date(timestamp);
    const ret = {
        name : year.toString()+"年"+month.toString()+"月 第"+res.toString()+"周",
        code : year.toString()+"-"+month.toString()+"-"+res.toString(),
    }

    console.log("现在是",ret)
    return ret;
}

