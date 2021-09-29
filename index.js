
const express = require('express');
const app = express();
app.use(express.static('public'));
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');


const settingsBill = SettingsBill();



const exphbs  = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())



app.get('/', function(req,res){
res.render('index', {
    settings: settingsBill.getSettings(),
    totals: settingsBill.totals()

});
});

app.post('/settings', function(req,res){
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });
        res.redirect('/')
});

app.post('/action', function(req,res){
  settingsBill.recordAction(req.body.actionType);

    res.redirect('/')

});

app.get('/actions', function(req,res){
res.render('actions', {actions:settingsBill.actions()});
});

app.get('/actions/:actionType', function(req,res){
    const actionType = req.params.actionType;
    res.render('actions', {actions:settingsBill.actionsFor(actionType)});
});




const PORT = process.env.PORT || 3008;
app.listen(PORT,function(){
console.log("app started at port", PORT)
});