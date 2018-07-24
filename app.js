// var express = require('express');
// var path = require('path');
// var bodyParser = require('body-parser');
// var request = require('request');
// var fs = require("fs");
//
// var popular = require('./json/popular.json');
// var azlist = require('./json/azlist.json');
// var actress = require('./json/actress.json');
// var groupPhotos = require('./json/groupPhotos.json');
// var firebase = require('firebase');
//
// var axios = require('axios');
// const baseURL = "http://pluzapp.com/indianactress/index.php";
//
// const userIds = ["ElBHKcjTOCQf0TIuFFEPCg5dpGq1", "FlfeEFJmxQUCIcfsvtXe8WZ6Ug43", "Iwl3XutxprU3PJieSnP5W3oxmif2", "TQ4wNY62tGYG6wfcFTUdGtyfu3s2"];
//
// var config = {
//     apiKey: "AIzaSyBxWkfzvphXjEg6qPFPlWdPb-5glfnoy1g",
//     authDomain: "hott-4cfa4.firebaseapp.com",
//     databaseURL: "https://hott-4cfa4.firebaseio.com",
//     projectId: "hott-4cfa4",
//     storageBucket: "",
//     messagingSenderId: "905775724347"
// };
// firebase.initializeApp(config);
//
//
// function resetData() {
//     firebase.database().ref('/').set({
//         popular: "",
//         title: "",
//         'a-zlist': "",
//         actresses: "",
//     });
// }
//
// function addUrls() {
//     firebase.database().ref('/users').set({
//         hello: "world"
//     });
// }
//
// var app = express();
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
//
//
// let popularJSON = [];
//
// function getPopularByPage(page) {
//     popular.page = page;
//     axios.post(baseURL, popular)
//         .then(success => {
//         const data = success.data.result.list;
//         const page = success.data.result.page;
//
//         popularJSON = popularJSON.concat(data);
//
//         if(page > 0 && data.length >0) {
//             getPopularByPage(page);
//         } else {
//
//             popularJSON = JSON.parse( JSON.stringify(popularJSON ));
//             fs.writeFile('./results/poplarJSON.json', JSON.stringify(popularJSON, null, 2) , 'utf-8');
//
//             firebase.database().ref('/popular').set({
//                 popularJSON
//             });
//         }
// }).catch(error => {
//         console.log(error)
// })
// }
//
// let azlistJSON = [];
// let actressesJSON = {};
// let titleJSON = {};
//
//
// function getAZlistByPage(page) {
//     azlist.page = page;
//     axios.post(baseURL, azlist)
//         .then(success => {
//         const data = success.data.result.list;
//     const page = success.data.result.page;
//
//     azlistJSON = azlistJSON.concat(data);
//
//     if(page > 0 && data.length >0) {
//         getAZlistByPage(page);
//     } else {
//
//         azlistJSON = JSON.parse( JSON.stringify(azlistJSON ));
//         fs.writeFile('./results/azlistJSON.json', JSON.stringify(azlistJSON, null, 2) , 'utf-8');
//
//         firebase.database().ref('/a-zlist').set({
//             azlistJSON
//         });
//
//         getActresses(0, 1);
//     }
// }).catch(error => {
//         console.log(error)
// })
// }
//
//
// function getActresses(i, page) {
//
//     console.log("index: ", i, "page: ", page);
//     if(i >= azlistJSON.length - 1) {
//     // if(i >= 10) {
//         // save to file and firebase
//
//         actressesJSON = JSON.parse( JSON.stringify(actressesJSON ));
//         fs.writeFile('./results/actressJSON.json', JSON.stringify(actressesJSON, null, 2) , 'utf-8');
//         fs.writeFile('./results/titleJSON.json', JSON.stringify(titleJSON, null, 2) , 'utf-8');
//
//         firebase.database().ref('/actresses').set({
//             actressesJSON
//         });
//
//         firebase.database().ref('/title').set({
//             titleJSON
//         });
//
//     } else {
//         var aid = azlistJSON[i].aid;
//         if(page === 1) {
//             actressesJSON[aid] = [];
//         } else if(page < 0) {
//             // call for next actress
//             getActresses(i+1, 1);
//             return;
//         }
//         actress.aid = aid;
//         actress.page = page;
//
//         if(titleJSON[aid]) {
//             console.log("aid already exists: ", aid);
//         } else {
//             titleJSON[aid] = {};
//         }
//
//         axios.post(baseURL, actress)
//             .then(success => {
//             const data = success.data.result.list;
//             const page = success.data.result.page;
//             actressesJSON[aid] = actressesJSON[aid].concat(data);
//
//             // data is an array
//
//             let promiseArr = data.map(item => {
//                 const titleid = item.titleid;
//                 groupPhotos.titleid = titleid;
//                 groupPhotos.aid = aid;
//                 let gp = JSON.parse(JSON.stringify(groupPhotos));
//
//                 return axios.post(baseURL, gp)
//                     .then(success => {
//
//                         let g = gp;
//                         // only note the first page here.
//                         const d = success.data.result.list;
//                         console.log('titleId: ', g.titleid, 'aid: ', g.aid, 'data length:  ', d.length);
//                         titleJSON[g.aid][g.titleid] = d;
//
//                     }).catch(error => {
//                             console.log(error);
//                     })
//                 });
//
//             Promise.all(promiseArr).then(values => {
//                 console.log("group ");
//                 getActresses(i, page);
//             })
//
//             return;
//
//     }).catch(error => {
//             console.log(error);
//         })
//     }
// }
//
//
// // resetData();
//
// addUrls();
//
// // getPopularByPage(1);
// //getAZlistByPage(1);
//
// /* GET home page. */
// app.get('/', function(req, res, next) {
//   res.setHeader('Content-Type', 'application/json');
//
//   res.send(JSON.stringify({
//     "hello": "world"
//   }));
// });
//
// app.get('/v1/properties', function(req, res, next) {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify(properties));
// });
//
// app.use(express.static('html'));
//
// var port = process.env.PORT || 3002;
// app.listen(port);
// console.log('Sample app is listening on port ' + port);
