#!/usr/bin/env node

/*
File :- db.js
Description :- This file is used to create database & schema in cassandra.
This file is execute when we want to create new database of our application.
Created Date :- 27-02-2017
Modify Date :- 27-02-2017
*/
var config = require("../config");
var databaseip = config.databaseip;
var databasename = config.databasename;
var cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: [databaseip]});
/**
* Creates a table and retrieves its information
*/
client.connect()
.then(function () {
  const query = "CREATE KEYSPACE IF NOT EXISTS " + databasename + " WITH replication =" +
  "{'class': 'SimpleStrategy', 'replication_factor': '1' }";
  return client.execute(query);
})
.then(function () {
  const query1 = "CREATE TABLE " + databasename  + ".tbl_available_dev_info (avldevicedbid uuid ,deviceid varchar,proto varchar,category varchar,gatewayid varchar,data varchar,create_ts timestamp,schematype varchar,PRIMARY KEY (avldevicedbid,deviceid));";
  const query2 = "CREATE TABLE " + databasename  + ".tbl_deviceinfo (devicedbid uuid,deviceid varchar,proto varchar,category varchar,gatewayid varchar,devicedatatb varchar,data varchar,create_ts timestamp,created_by varchar,mod_ts timestamp,mod_by varchar,isactive boolean,schematype varchar,type varchar,PRIMARY KEY (devicedbid,deviceid));";
  const query3 = "CREATE TABLE " + databasename  + ".tbl_device_type (devicetypedbid uuid,devicetype varchar,create_ts timestamp,created_by varchar,mod_ts timestamp,mod_by varchar,isactive boolean,PRIMARY KEY (devicetypedbid,devicetype));;";
  client.execute(query1).then(dispalytable.bind(null,'tbl_available_dev_info'));
  client.execute(query2).then(dispalytable.bind(null,'tbl_deviceinfo'));
  client.execute(query3).then(dispalytable.bind(null,'tbl_device_type'));
}).then(function(){
  console.log("All tables Created successfully");
})
.catch(function (err) {
  console.error('There was an error', err);
  return client.shutdown();
});

//callback function
function dispalytable(tblname)
{
  console.log(tblname);
  client.metadata.getTable(databasename, tblname, function (err, table) {

    if (!err) {
      console.log("------------------------");
      console.log('Table %s', table.name);
      console.log("--------");
      table.columns.forEach(function (column) {
        console.log( column.name);
      });
      console.log("------------------------");
    }
  });
}
