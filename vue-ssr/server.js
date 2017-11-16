//express server
const express = require('express');
const server = express();
const fs = require('fs');
const path = require('path');
//obtain bundle
const bundle =  require('./dist/server.bundle.js');
//get renderer from vue server renderer
const renderer = require('vue-server-renderer').createRenderer({
    //set template
    template: fs.readFileSync('./index.html', 'utf-8')
});

server.use('/dist', express.static(path.join(__dirname, './dist')));

//start server
server.get('*', (req, res) => { 
    
    bundle.default({ url: req.url }).then((app) => {    
        //context to use as data source
        //in the template for interpolation
        const context = {
            title: 'Vue JS - Server Render',
            meta: `
                <meta description="vuejs server side render">
            `
        };

        renderer.renderToString(app, context, function (err, html) {            
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else {
                res.send(html);
            };
        });
    }, (err) => {
        console.log(err);
    });  
});  

server.listen(8080);