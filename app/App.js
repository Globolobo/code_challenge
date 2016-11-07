import React from 'react';
import styles from './App.css';
import data from './leads.json';
import moment from 'moment';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  reduceData = (data) => {

    // determine latest entry
    const winner = (duplicates, original) => {
      const winners = [];
      for (let children in duplicates) {
        const dateValues = [];

        duplicates[children].map(( el, i, array) => {

          dateValues.push(Object.keys(array)[i]);

          if(moment(original[dateValues[0]].entryDate).valueOf() <= moment(original[el].entryDate).valueOf()){
            dateValues.splice(0,1,el);
          }

          return dateValues[0];
        });

        winners.push(dateValues[0] || null);
      }

      return winners;
    };

    //maps duplicates in a 1 to many relationship: { index : [x,y,z] }
    const duplicates = (data) => {

      const duplicatesObject = {};
      const uniqueArray = [];

      for (let x =0; x < ((data.length/2)+1); x++){
        const duplicateArray = [];

        if(uniqueArray.includes(x)) continue;

        for( let y = x+1; y <data.length; y++){
          if(data[x]._id == data[y]._id || data[x].email == data[y].email){
            if(uniqueArray.indexOf(x) == -1){
              uniqueArray.push(x);
            }
            uniqueArray.push(y);
            duplicateArray.push(y);
          }
        }
        duplicatesObject[x] = duplicateArray;
      }

      const removableDuplicates = winner(duplicatesObject, data);

      removableDuplicates.map((record)=>{
        const index = uniqueArray.indexOf(record);

        if(index != -1){
          uniqueArray.splice(index,1);
        }
      });
        return uniqueArray;
    };

    return data.filter((el, i) => {

      if(duplicates(data).indexOf(i) == -1){
        return true;
      }

    });
  };

  renderJson = () => {

    return (
     <pre>
       { JSON.stringify(this.reduceData(data.leads), null, 2) }
     </pre>
    )

  };


  render() {

    return (
      <div className={styles.ap}>
        { this.renderJson() }
      </div>
    );
  }
}
