const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 8080;
const {pool } = require('./db');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }))
//정적 파일 경로 설정
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.redirect('/estimate');
  });
//업데이트
app.post('/update', async (req, res) => {
    try {
        var dataArr = JSON.parse(req.body.dataArr);
        console.log(dataArr)

        for(var i = 0 ; i< dataArr.length; i++) {
            var ID = dataArr[i].UID;
            var GUBN1 = dataArr[i].UGUBN1.trim();
            var GUBN2 = dataArr[i].UGUBN2.trim();
            var MON = dataArr[i].UMON.trim();
            var AMT = dataArr[i].UAMT.trim();

            var query = await pool
            var result = await query.request()
                .input('P_VALUE1', ID || 0)
                .input('P_VALUE2', GUBN1 || "*")
                .input('P_VALUE3', GUBN2 || "*")
                .input('P_VALUE4', MON || "*")
                .input('P_VALUE5', AMT || 0)
                .execute("AMT_Update_boditechd");
        }
        res.redirect('/estimate');
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
});
//조회
app.get('/estimate', async (req, res) => {

    try {
        var query = await pool;
        var GUBN1 = req.query.GUBN1 ? req.query.GUBN1.trim() : '';
        var GUBN2 = req.query.GUBN2 ? req.query.GUBN2.trim() : '';
        var MON = req.query.MON;
        var AMT =  parseFloat(req.query.AMT);


        
        var result = await query.request()
            .input('P_VALUE2', GUBN1 )
            .input('P_VALUE3', GUBN2 )
            .input('P_VALUE4', MON || "*")
            .input('P_VALUE5', AMT || 0)
            .execute("AMT_estimate_boditechd")
           

        var result_data = result.recordsets[0];

        var page_num = 10;
        var page_count = 10;
        var page = 1;
        res.render("view", {
            result_data: result_data, GUBN1:GUBN1, GUBN2:GUBN2, MON:MON, AMT:AMT
            ,page_num: page_num, page_count:page_count,page: page
        });
    }
    catch (err){
        res.status(500);
        res.send(err.message);
    }
});
//삭제
app.post('/delete', async (req, res) => {
    try {
      var selectedRows = JSON.parse(req.body.selectedRows);
      console.log(selectedRows);
      for(var i = 0; i < selectedRows.length; i ++) {
        var id = selectedRows[i];

        var query = await pool;
        var result = await query.request()
        .input('P_VALUE1', id)
        .execute("AMT_Delete_boditechd")
      }
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
    res.redirect('/estimate');
  });
//저장
app.post('/save', async (req, res) => {
  try {
    var dataArr = JSON.parse(req.body.dataArr);
    console.log(dataArr);
    for (var i = 0; i < dataArr.length; i++) {
      var SGUBN1 = dataArr[i].SGUBN1.trim();
      var SGUBN2 = dataArr[i].SGUBN2.trim();
      var SMON = dataArr[i].SMON.trim();
      var SAMT = dataArr[i].SAMT.trim();
      
      var query = await pool
      var result = await query.request()
        .input('P_VALUE2', SGUBN1 || "*")
        .input('P_VALUE3', SGUBN2 || "*")
        .input('P_VALUE4', SMON || "*")
        .input('P_VALUE5', SAMT || 0)
        .execute("AMT_Save_boditechd");
    }
    res.redirect('/estimate');
  } catch (err) {
    res.status(500);
    res.send(err.message);
  }
});
app.listen(PORT, () => {
    console.log('Server On : http://localhost:${PORT}/');
});