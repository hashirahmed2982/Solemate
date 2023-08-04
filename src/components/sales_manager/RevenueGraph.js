import React, { useEffect, useState } from 'react';
import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const state = {
    labels: ['January', 'February', 'March',
             'April', 'May'],
    datasets: [
        {
            label: 'Rainfall',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [65, 59, 80, 81, 56]
        }
    ]
}

function RevenueGraph(props) {

    const [months, setMonths] = useState([]);
    const [revMonth, setRevMonth] = useState([]);

    const [monthRev, setMonthRev] = useState([]);

    const [objGraph, setObjGraph] = useState({})

    function extractMonths() {

        var temp = [];
        props.orders.map((order) => {
            var date = order.timeStamp.toDate();
            var month = date.getMonth() + 1;
            var total = order.total;
            console.log("ORDER ID", order.orderID, "ORDER MONTH:", month, "ORDER TOTAL:", total);
            var idx = temp.findIndex(object => {return object.month === month})
            if (idx >= 0) {
                console.log("FIRST");
                var newTotal = temp[idx].total + total;
                temp[idx].total = newTotal;
            }
            else {
                console.log("SECOND");
                var obj = {
                    month: month,
                    total: total,
                }
                temp = [...temp, obj];
            }
        })
        setMonthRev(temp);
        console.log("**********************")
    }

    useEffect(() => {
        console.log(monthRev);
        monthRev.sort((a, b) => a.month - b.month);
        var tempM = [];
        var tempT = [];
        monthRev.map((entry) => {
            var m = entry.month;
            var mStr = ("0" + (m).toString()).slice(-2)
            var t = entry.total;
            tempM = [...tempM, mStr];
            tempT = [...tempT, t];
        })
        setMonths(tempM);
        setRevMonth(tempT);
    }, [monthRev])

    useEffect(() => {

    })

    useEffect(() => {
        extractMonths();
    }, [props.orders])

    return (
        <Line
            data={{
                labels: months,
                datasets: [
                    {
                        label: 'Revenue',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: '#f77d0b',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: revMonth,
                    }
                ]
            }}
            options={{
                title:{
                    display:true,
                    text:'Total Revenue per Month',
                    fontSize:20
                },
                legend:{
                    display:true,
                    position:'right'
                }
            }}
        />
  )
}

export default RevenueGraph