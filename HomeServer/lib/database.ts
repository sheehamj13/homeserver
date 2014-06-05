﻿
/// <reference path="../Scripts/typings/node/mongodb.d.ts" />


import mongodb = require("mongodb");
import event = require("events");



export module network {


    export class database extends event.EventEmitter {

        public collections: Map<string, collection>;
        public db: mongodb.Db;
        public name: string;
        public ip: string;
        public port: number;


        constructor(name: string, address: string) {
            super();
            
            this.name = name;

            var parts = address.split(":");
            this.ip = parts[0];
            this.port = parseInt(parts[1]);

            this.db = new mongodb.Db(name, new mongodb.Server(this.ip, this.port, { auto_reconnect: true }));
            this.open();
        }


        public open() {
            var self = this;
            this.db.open(function (err, db: mongodb.Db) {

                if (err) {
                    self.emit('error', err);
                    return;
                }

                self.emit('connect');
            });
        }


        public close(lazy: boolean = false) {
            if (this.db) {
                var self = this;
                this.db.close(lazy, function (err, result) {
                    if (err) {
                        self.emit('error', err);
                        return;
                    }

                    self.emit('close', result);
                });
            }
        }


        public collection(name: string) {

            var c: collection = new collection(name, this.db.collection(name));
            return c;

            //this.collections[name] = c;
        }

    }



    export class collection extends event.EventEmitter {


        public collection: mongodb.Collection;
        public name: string;


        constructor(name: string, c: mongodb.Collection) {
            super();

            this.name = name;
            this.collection = c;
        }


        public insert(data: Array<any>, cb?: (result: any) => void) {
            var self = this;
            this.collection.insert(data, function (err, result) {

                if (err) {
                    self.emit('error', err);
                    return;
                }

                if (cb) {
                    cb(result)
                }

            });
        }


        public update(data: Array<any>) {
            var self = this;
            this.collection.update(data, function (err, result) {

                if (err) {
                    self.emit('error', err);
                    return;
                }


            });
        }


        public drop() {
            var self = this;
            this.collection.drop(function (err, result) {

                if (err) {
                    self.emit('error', err);
                    return;
                }
            });
        }

    }



    export class document {

        public traits: Map<string, field>;

        constructor(schema: any) {

            for (var i = 0; i < schema.length; i++) {
                var field = schema[i];
            }
        }
    }




    export class field {

        public key: any;

        constructor(key: any) {

            this.key = key;
        }

    }

}