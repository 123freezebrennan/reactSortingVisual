import './Box.css';
import React from 'react';

export default class Box extends React.Component {
    color = '#FFFFFF';
    height = 0;

    setDigit(value){this.digit = value;}
    getDigit(){ return this.digit;}

    setColor(toSet){this.color = toSet;}
    getColor(){return this.color;}

}