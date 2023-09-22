import React, { useEffect, useState } from 'react'
import { CryptoState } from '../CryptoContext';
import { HistoricalChart } from '../config/api';
import axios from 'axios';
import { CircularProgress, ThemeProvider, createTheme, makeStyles } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const CoinInfo = ({coin}) => {
  const[historicData,setHistoricData] = useState();
  const[days,setDays]= useState(1);

   const{currency} = CryptoState();

   const fetchHistoricData= async () => {
     const {data} = await axios.get(HistoricalChart(coin.id,days,currency));
    //  setflag(true);
     setHistoricData(data.prices);
   };

   console.log("data",historicData);
   useEffect(() => {
    fetchHistoricData();
   },[currency,days]);

   const darktheme = createTheme({
    palette: {
        primary: {
            main: "#fff",
        },
        type: "dark",
    },
   });

   const coinPrice = []
   const coinDate = []
   historicData?.map((coin) => {
    let date= new Date(coin[0]);
    let time =
     date.getHours () > 12
     ? `${date.getHours()-12}:${date.getMinutes()} PM`
     : `${date.getHours()}:${date.getMinutes()} AM`;
    
    coinDate.push(days===1 ? time : date.toLocaleDateString())
    coinPrice.push(coin[1])
})


  const useStyles= makeStyles((theme) => ({
      container: {
         width: "75%",
         display: "flex",
         flexDirection: "column",
         alignItems: "center",
         justifyContent: "center",
         marginTop: 25,
         padding: 40,
         [theme.breakpoints.down("md")]: {
             width: "100%",
             marginTop: 0,
             padding: 20,
             paddingTop: 0,
         },
      }
  }));

  const classes= useStyles();

  return (
    <ThemeProvider theme={darktheme}>
      <div className={classes.container}>
        {
            (!historicData) ? (
                <CircularProgress 
                  style={{
                    color : "gold"
                  }}
                  size={250}
                  thickness={1}
                />
            ): (
                 <>
                     <Line data = {{
                      labels : coinDate,
                      datasets : [
                        {
                          label : 'graph',
                          data : coinPrice
                        }
                      ]
                     }} />
                 </>
            )
        }
      </div>
    </ThemeProvider>
  )
}

export default CoinInfo