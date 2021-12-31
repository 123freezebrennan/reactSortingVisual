import './Sort.css';
import Box from './Box.jsx';
import React from 'react';
import RangeSlider from 'react-bootstrap-range-slider';

const PRIME = '#4fc8dd';
const SWITCH = '#c64c40';
const ORDER = '#65DF10';

export default class Sort extends React.Component{
    values = 30;
    sort = false;
    speed = 40;

    constructor(props){
        super(props);
        this.state = {arr: []};
    }
    
    print(){
        for (var i =0; i < this.values; i++)
            console.log(this.state.arr[i].getDigit());
    }

    async isSorted(){
        for (var i = 0; i < this.values - 1; i++){
            if (i + 1 !== this.values){
                if(this.state.arr[i].getDigit() > this.state.arr[i + 1].getDigit()){
                    return false;
                }
            }
        }
        for (var j = 0; j < this.values - 1; j++){
            this.colorToChange(j, j + 1, ORDER);
            await sleep(this.speed);
        }
        return true;
    }

    colorToChange(x, y, tochange){
        this.state.arr[x].setColor(tochange);
        this.state.arr[y].setColor(tochange);
        this.setState(this.state.arr);
    }

    swap(x, y){
        var temp = this.state.arr[x].getDigit();
        this.state.arr[x].setDigit(this.state.arr[y].getDigit());
        this.state.arr[y].setDigit(temp);
        this.setState(this.state.arr);
    }

    stopSorting(){
        this.sort = false;
        for (var i = 0; i < this.values; i++){
            this.colorToChange(i, i, PRIME);
        }
    }

    clearArray(){
        const arr = [];
        this.setState({arr});
    }

    setValues(value){
        this.clearArray();
        this.values = value;
        this.makeArray();
    }

    getValues(){return this.values;}

    setSpeed(value){
        this.speed = value; 
    }


    makeArray(){
        this.sort = false;
        const arr = [];
        for (var i = 0; i < this.getValues(); i++){
            var box = new Box();
            box.setColor(PRIME);
            box.setDigit(Math.floor(Math.random() * (100 - 3 + 1) + 3));
            arr.push(box);
        }
        this.setState({arr});
    }

    async bubbleSort(){
            if (!this.sort)
                this.sort = true;
            for (var i = 0; i < this.state.arr.length; i++){
                for (var j = 0; j < this.state.arr.length - i - 1; j++){
                    if (!this.sort)
                        return;
                    this.colorToChange(j, j + 1, SWITCH);
                    await sleep(this.speed);
                    if (this.state.arr[j].getDigit() > this.state.arr[j + 1].getDigit()){
                        this.swap(j, j + 1);
                    }
                    this.colorToChange(j, j + 1, PRIME);
                }
            }
        this.isSorted();
    }

    async selectionSort(){
        if (!this.sort)
            this.sort = true;
        var i, j, min;
        for (i = 0; i < this.values - 1; i++){
            min = i;
            for (j = i + 1; j < this.values; j++){
                if (!this.sort)
                    return;
                this.colorToChange(min, j, SWITCH);
                await sleep(this.speed);
                if (this.state.arr[j].getDigit() < this.state.arr[min].getDigit()){
                    this.colorToChange(min, min, PRIME);
                    min = j;
                }
                this.colorToChange(min, j, PRIME);
            }
            this.swap(i, min);
            this.colorToChange(i, min, PRIME);
        }
        this.isSorted();
    }

    async insertionSort(){
        if (!this.sort)
            this.sort = true;
        var i, key, j;
        for (i = 1; i < this.values; i++){
            key = this.state.arr[i].getDigit();
            j = i - 1;
            while (j >= 0 && this.state.arr[j].getDigit() > key){
                if (!this.sort)
                    return;
                this.colorToChange(j + 1, j, SWITCH);
                await sleep(this.speed);
                this.swap(j, j + 1);
                this.colorToChange(j + 1, j, PRIME);
                j = j - 1;
            }
            this.state.arr[j + 1].setDigit(key);
        }
        this.isSorted();
    }

    async mergeSort(l, m, r){
        var n1 = m - l + 1;
        var n2 = r - m;
        var L = [];
        var R = [];
        L.length = n1;
        
        R.length = n2;
        for (let i = 0; i < n1; i++){
            if (this.state.arr[l + i] != null){
                L[i] = this.state.arr[l + i].getDigit();
            }
        }
        for (let j = 0; j < n2; j++){
            R[j] = this.state.arr[m + 1 + j].getDigit();
        }
        var i = 0, j = 0, k = l;
        while (i < n1 && j < n2){
            if (L[i] <= R[j]){
                this.state.arr[k].setDigit(L[i]);
                i = i + 1;
            }
            else{
                this.state.arr[k].setDigit(R[j]);
                j = j + 1;
            }
            k = k + 1;
        }
        while(i < n1){
            this.state.arr[k].setDigit(L[i]);
            i = i + 1;
            k = k + 1;
        }
        while(j < n2){
            this.state.arr[k].setDigit(R[j]);
            j = j + 1;
            k = k + 1;
        }
       
        this.colorToChange(l, r, SWITCH);
        await sleep(this.speed);
    }

    async mergeSort_h(l, r){
        if (l === r)
            return; 
        if (!this.sort)
            this.sort = true;
        const m = Math.floor((l + r) / 2);
        await this.mergeSort_h(l, m);
        if (!this.sort)
            return;
        this.colorToChange(l, m, PRIME);
        await sleep(this.speed);
        await this.mergeSort_h(m + 1, r);
        this.colorToChange(m + 1, r, PRIME);
        await sleep(this.speed);
        await this.mergeSort(l, m, r);
        this.colorToChange(l, r, PRIME);
        this.isSorted();
    }

    async partition(l, r){
        let p = this.state.arr[r].getDigit();
        var i = (l - 1);
        for (let j = l; j <= r - 1; j++){
            if (this.state.arr[j].getDigit() <= p){
                i = i + 1;
                this.colorToChange(j, i, SWITCH);
                this.swap(j, i);
                await sleep(this.speed);
                this.colorToChange(j, i, PRIME);
            }
        }
        this.colorToChange(l, r, SWITCH);
        this.swap(r, i + 1);
        await sleep(this.speed);
        this.colorToChange(l, r, PRIME);
        return i + 1;
    }

    async quickSort(l, r){
        if (!this.sort)
            this.sort = true;
        if (l < r){
            const pi = await this.partition(l, r);
            if (!this.sort)
                return;
            this.quickSort(l, pi - 1);
            this.quickSort(pi + 1, r);
        }
        this.isSorted();
    }

    async shellSort(){
        if (!this.sort)
            this.sort = true;
        for (var gap = Math.floor(this.values / 2); gap > 0; gap = Math.floor(gap / 2)){
            for (var i = gap; i < this.values; i += 1){
                var temp = this.state.arr[i].getDigit();
                var j;
                for (j = i; j >= gap && this.state.arr[j - gap].getDigit() > temp; j -= gap){
                    this.state.arr[j].setDigit(this.state.arr[j - gap].getDigit());
                    if (!this.sort)
                        return;
                }
                this.colorToChange(j, i, SWITCH);
                this.state.arr[j].setDigit(temp);
                await sleep(this.speed);
                this.setState(this.state.arr);
                this.colorToChange(j, i, PRIME);
                await sleep(this.speed);
            }
        }
        this.isSorted();
    }
     
    getNextGap(gap){
        gap = parseInt((gap * 10) / 13, 10);
        if (gap < 1)
            return 1;
        return gap;
    }

    async combSort(){
        if (!this.sort)
            this.sort = true;
        var gap = this.values;
        var swapper = true;
        while(gap !== 1 || swapper === true){
            gap = this.getNextGap(gap);
            swapper = false;
            for (var i = 0; i < this.values - gap; i++){
                if (this.state.arr[i].getDigit() > this.state.arr[i + gap].getDigit()){
                    this.colorToChange(i + gap, i, SWITCH);
                    this.swap(i + gap, i);
                    await sleep(this.speed);
                    this.colorToChange(i + gap, i, PRIME);
                    await sleep(this.speed);
                    swapper = true;
                }
                if (!this.sort)
                    return;
            }
        }
        this.isSorted();
    }

    async cocktailSort(){
        if (!this.sort)
            this.sort = true;
        var swapper = true;
        var start = 0;
        var end = this.values;
        while (swapper === true){
            swapper = false;
            for (let i = start; i < end - 1; i++){
                if (this.state.arr[i].getDigit() > this.state.arr[i + 1].getDigit()){
                    this.swap(i, i + 1);
                    this.colorToChange(i + 1, i, SWITCH);
                    await sleep(this.speed);
                    this.colorToChange(i + 1, i, PRIME);
                    swapper = true;
                }
            }
            if (swapper === false)
                break;
            swapper = false;
            end = end - 1;
            for (let i = end - 1; i >= start; i--){
                if (this.state.arr[i].getDigit() > this.state.arr[i + 1].getDigit()){
                    this.swap(i, i + 1);
                    this.colorToChange(i + 1, i, SWITCH);
                    await sleep(this.speed);
                    this.colorToChange(i + 1, i, PRIME);
                    swapper = true;
                }

            }
            start = start + 1;
            if (!this.sort)
                return;
        }
        this.isSorted();
    }


    shuffle(){
        let r = []
        for (let i = 0; i < this.values; i++){
            r.push(this.state.arr[i].getDigit());
        }
        r = r.sort(() => Math.random() - 0.5)
        for (let i = 0; i < this.values; i++){
            this.state.arr[i].setDigit(r[i]);
        }
    }
    
    async bogoSort(){
        if (!this.sort)
            this.sort = true;
        var sorted = await this.isSorted();
        while(sorted === false){
            await sleep(this.speed);
            this.shuffle();
            sorted = await this.isSorted();
            if (!this.sort)
                return;
        }
    }

    render(){
        const {arr} = this.state;
        return (
            <div className = "Class-Main">
                <header className = "header">
                    Sorting Algorithm Visualizer
                </header>
                <div className = "buttons">
                    <div className = "main-functions">
                        <button className = "button1" onClick={() => this.makeArray()}>Generate New Array</button>
                        <button className = "button1" onClick={() => this.stopSorting()}>Stop Animation</button>
                    </div>
                    <div className = "speed-functions">
                        <button className = "button1" onClick={() => this.setSpeed(40)}>Fast</button>
                        <button className = "button1" onClick={() => this.setSpeed(60)}>Normal</button>
                        <button className = "button1" onClick={() => this.setSpeed(80)}>Slow</button>
                        <button className = "button1" onClick={() => this.setSpeed(180)}>Steps</button> 
                    </div>
                    <div className = "sorting-buttons">
                        <button className = "button1" onClick={() => this.bubbleSort()}>Bubble Sort</button>
                        <button className = "button1" onClick={() => this.selectionSort()}>Selection Sort</button>
                        <button className = "button1" onClick={() => this.insertionSort()}>Insertion Sort</button>
                        <button className = "button1" onClick={() => this.shellSort()}>Shell Sort</button>
                        <button className = "button1" onClick={() => this.combSort()}>Comb Sort</button>
                        <button className = "button1" onClick={() => this.cocktailSort()}>Cocktail Sort</button>
                        <button className = "button1" onClick={() => this.mergeSort_h(0, this.values - 1)}>Merge Sort</button>
                        <button className = "button1" onClick={() => this.quickSort(0, this.values - 1)}>Quick Sort</button>
                        <button className = "button1" onClick={() => this.bogoSort()}>Bogo Sort</button>
                    </div>
                </div>
                <div className = "slider">
                <RangeSlider 
                        className = "values"
                        min = {10}
                        max = {100}
                        value = {this.values}
                        onChange={e => this.setValues(e.target.value)}
                        color = {'#4fc8dd'}
                    />
                </div>
                <div className = "ArrayContainer">
                    {arr.map((value, idx) => (
                        <div
                            className="array-bar"
                            key={idx}
                            style={{
                                backgroundColor: value.getColor(),
                                height: `${(value.getDigit() * 2) + 3}px`,
                        }}>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.clearArray();
        this.makeArray();
    }
}

function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }

