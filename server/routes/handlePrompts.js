const express = require('express');
const con = require('./../dbconnection');

function query(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports.add = async function (req, res) {
    var text = req.body.text;
    var type
    if (req.body.type === 'addSystem') {
        type = 0
    } else {
        type = 1
    }
    var sql = "INSERT INTO `prompts`(`prompt`, `type`) VALUES ('" + text + "', " + type + ")";
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.send({
                'code': 400,
            })
        } else {
            res.send({
                'code': 200,
            })
        }
    })
}

module.exports.read = async function (req, res) {
    const prompts = {
        system: [],
        user: []
    };
    var sql_system = "SELECT * FROM `prompts` WHERE type = 0";
    var sql_user = "SELECT * FROM `prompts` WHERE type = 1";

    try {
        const systemResult = await query(sql_system);
        prompts.system = systemResult;

        const userResult = await query(sql_user);
        prompts.user = userResult;

        res.send({
            body: prompts,
        });
    } catch (err) {
        console.log(err);
        res.send({
            error: "An error occurred while retrieving prompts.",
        });
    }
}

module.exports.edit = async function (req, res) {
    var id = req.params.id;
    var promptText = req.body.text;
    var sql = `UPDATE prompts SET prompt = "${promptText}" WHERE id = ${id}`;
    try {
        await query(sql);
        res.send({
            'code': 200,
        })
    } catch (err) {
        console.log(err);
        res.send({
            'code': 400,
        })
    }
}

module.exports.delete = async function (req, res) {
    var id = req.params.id;
    var sql = `DELETE FROM prompts WHERE id = ${id}`
    try {
        await query(sql);
        res.send({
            'code': 200,
        });
    } catch (err) {
        console.log(err);
        res.send({
            'code': 400,
        });
    }
}