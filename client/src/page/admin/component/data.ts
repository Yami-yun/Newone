
// 차트 더미 데이터 생성
export function getChartData():{
    date: string;
    count: number;
}[]{
    let mon = 1;
    let result = [];
    for(let j=0; j<12; j++){
        let date = 0;
        for(let i=1; i<= 30; i++){
            date += 1;
            let count = Math.floor(Math.random() * 940) + 50;
            let _mon = mon < 10 ? `0${mon}` : `${mon}`;
            let _date = date < 10 ? `0${date}` : `${date}`;

            result.push({
                date: `2021-${_mon}-${_date}`,
                count: count,
            })
        }
        mon += 1;
    }

    return result;
};
