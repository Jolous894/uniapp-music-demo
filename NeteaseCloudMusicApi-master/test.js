
let obj =  {
    name:"张三",
    age:12,
    showInfo(){
        console.log(this);
    }
}

function showInfo(){
    console.log(this);
}

showInfo()