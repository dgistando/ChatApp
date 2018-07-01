export default function(){

var obj = {
        name:"Me and this. permanenet yet?",
       image:"here.jpeg",
       dateCreated: new Date().getTime(),
       lastActive: 10,
       hash: require('crypto').randomBytes(8).toString('hex')
}
//obj.hash = hashIt(obj.name, obj.dateCreated, Math.floor(Math.random() * 15))

var obj2 = {
        name:"Me and",
        image:"here.jpeg",
        dateCreated: new Date().getTime(),
        lastActive: 10,
        hash: require('crypto').randomBytes(8).toString('hex')
}
//obj2.hash = hashIt(obj2.name, obj2.dateCreated, Math.floor( Math.random() * 200))


    return [obj, obj2]
}

/*function hashIt(name, dateCreated, salt){
    var h = salt

    h = h * 101 + name.charCodeAt(0)
    h = h * 101 + name.charCodeAt(name.length/2)
    h = h * 101 + name.charCodeAt(name.length-1)
    h = h*1000000 + dateCreated

    return h;
}*/

