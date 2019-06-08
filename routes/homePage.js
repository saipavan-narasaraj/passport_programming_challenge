
/* 
  home page. 
*/
module.exports = (req, res, next) => {
  res.send(path.join(__dirname + '/public/index.html'));
};


