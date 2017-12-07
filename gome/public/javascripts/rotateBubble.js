window.onload = function(){
  var oldCount = 0;
  var socket=io.connect();//与服务器进行连接

  var testCount = 0;
  var tempCount;
  socket.on('chatmessage', function(msg){
    localStorage.count = msg
    tempCount = msg;
  })
  setInterval(function(){
    if(localStorage.count){
      // 设置count从本地存储取值
    }
    var count = tempCount ;

    if(oldCount != parseInt(count/10)){
      testCount = 1;
      getData(parseInt(count/10))
      oldCount = parseInt(count/10);

    }else{
      return
    }
  }, 2000);
  // getData()
  function getData(count){
    var tar = document.getElementById('bubbleContainer1');
    var tarNeg = document.getElementById('bubbleContainer')
    console.log(count)
    if( count== NaN) count = 1;

    $.ajax({
      url:'data/'+count+'_Pos(1).json',
      // url:'data/4_Pos(1).json',
      type:'get',
      success:function(data){
        var isPos = data.name
        tranverseData(data,isPos)
      },
      error:function(data){
        console.log(data)
      }
    });
    $.ajax({
      url:'data/'+count+'_Neg(1).json',
      // url:'data/3_Neg(1).json',
      type:'get',
      success:function(data){
        var isPos = data.name
        tranverseData(data,isPos)
      },
      error:function(data){
        console.log(data)
      }
    });

    function tranverseData(data,isPos){
      if( data && data.children){
        var len = data.children.length;
        for(var i=0;i<len;i++){
          drawBubble(data.children[i],isPos)
        }
      }
    }
    function drawBubble(data,isPos){
      var arr = []
      data.children.forEach(function(item){
        // var obj ={};
        // obj[item.name] = item.size
        arr.push(item.size)
      });
      arr.sort(function(a,b) {return b-a})
      var max = arr[arr.length-1]
      var min = arr[0]
      var arrLast = calculatePos(data.children,arr)
      if(isPos == 'positive'){
        $('#bubbleContainer1 div').remove()
      }else{
        $('#bubbleContainer div').remove()
      }
      for(var i=0,len=data.children.length;i<len;i++){
        $('#projectName').html(data.project)
        $('#projectName1').html(data.project)
        addBubble(data.children[i],arrLast[i],i,defaultPos,isPos)
      }

    }
    function c(type){return document.createElement(type)}
    function calculatePos(data,arr){
      //气泡个数 arr.length
      var num = arr.length;
      var upDeg = 45
      //默认上下各有upDeg度 的空间 无气泡
      //顺时针方向
      var arrDeg = new Array(num-1)
      //此处可以生成一个1到10的随机数 使气泡看着更散一点
      //TODO
      //偏一个random 距离 增一个random
      for(var i=0,len=arrDeg.length;i<Math.ceil(len/2);i++){
        arrDeg[i] = upDeg + (360-upDeg*2)/len*i
      }
      for(var len=arrDeg.length,i=Math.ceil(len/2);i<len;i++){
        arrDeg[i] = upDeg*2 + (360-upDeg*2)/len*i
      }
      //计算每个角度对应的 正余弦长度
      for(var len=arr.length,i=1;i<len;i++){
        var temp = {};
        temp['weight'] = arr[i]
        temp['deg'] = arrDeg[i-1]
        arr[i] = temp;
      }
      var centerPoint = arr[0]
      function tranversePos(deg){

      }
      for(var len=arr.length,i=1;i<len;i++){
        //hypotenuse 斜边
        var hypotenuse = centerPoint+arr[i]['weight']
        arr[i]['opsite'] = Math.cos(arr[i].deg)*hypotenuse
        arr[i]['nearsite'] = Math.sin(arr[i].deg)*hypotenuse
        arr[i]['centerPoint'] = centerPoint
      }
      return arr
    }
    var defaultPos =[
      {"opsite":292,
       "nearsite":328},
      {"opsite":120,
       "nearsite":450},
      {"opsite":545,
       "nearsite":366},
      {"opsite":515,
       "nearsite":493},
      {"opsite":154,
       "nearsite":290},
      {"opsite":484,
       "nearsite":222},
       {"opsite":247,
       "nearsite":555},
      {"opsite":404,
       "nearsite":589},
      {"opsite":381,
       "nearsite":222},
      {"opsite":290,
       "nearsite":242},
       {"opsite":247,
       "nearsite":555}
    ]
    var defaultNeg =[
      {"opsite":292,
       "nearsite":328},
      {"opsite":336,
       "nearsite":522},
      {"opsite":129,
       "nearsite":201},
      {"opsite":530,
       "nearsite":335},
      {"opsite":150,
       "nearsite":477},
      {"opsite":463,
       "nearsite":195},
       {"opsite":70,
       "nearsite":376},
      {"opsite":554,
       "nearsite":518},
      {"opsite":212,
       "nearsite":395},
      {"opsite":306,
       "nearsite":176},
       {"opsite":207,
       "nearsite":555}
    ]
    function addBubble(a,b,i,defaultPos,isPos){
      var size = a.size*1
      var step = size/10
      var sizeBig = size+step
      var sizeSmall = size - step;
      var res = c('div')
      var rate = a.size/(a.name.length+2)

      var divOut = c('div');
      var divMiddle = c('div');
      var divIn = c('div');

      divOut.className = 'divOut'
      divOut.style.width = sizeBig +'px'
      divOut.style.height = sizeBig +'px'
      divOut.style.opacity = '0.8'
      if(isPos == 'positive'){
        divOut.style.background = 'url("images/001.png") no-repeat center';
      }else{
        divOut.style.background = 'url("images/005.png") no-repeat center';
      }
      divOut.style.backgroundSize = sizeBig+'px '+ sizeBig+'px';
      divOut.style.position = 'absolute'

      var cx = b.centerPoint+b.opsite
      var cy = b.centerPoint+b.nearsite
      // 每个气泡的位置
      if(isPos == 'positive'){
        res.style.left = defaultPos[i]['opsite'] +'px'
        res.style.top = defaultPos[i]['nearsite'] +'px'
      }else{
        res.style.left = defaultNeg[i]['opsite'] +'px'
      res.style.top = defaultNeg[i]['nearsite'] +'px'
      }
      var arr = ['shake45','shakeHorizal','shake','shake451','shake30'];
      var ba = Math.ceil(Math.random()*10/2)
      res.className = 'tarDiv animated '+arr[ba-1]+' infinite';

      res.style.position = 'absolute'
      divMiddle.className = ' divMiddle '
      
      divIn.innerHTML = a.name
      divMiddle.style.width = size +'px'
      divMiddle.style.height = size +'px'
      divMiddle.style.top = step/2 + 'px'
      divMiddle.style.left = step/2 + 'px'
      // divMiddle.style.opacity = '0.8'


      if(isPos == 'positive'){
        divIn.style.color='rgb(210,171,37)'
        divMiddle.style.background = 'url("images/002.png") no-repeat center';
      }else{
        divIn.style.color='#35bfff'
        divMiddle.style.background = 'url("images/004.png") no-repeat center';
      }
      divMiddle.style.backgroundSize = size+'px '+ size+'px';

      if(size<110){
        divIn.style.fontSize = '18px';
      }else if(110<size<130){
        divIn.style.fontSize = '22px';
      }else if(130<sie<150){
        divIn.style.fontSize = '24px'
      }else if(150<size<170){
        divIn.style.fontSize = '26px'
      }else{
        divIn.style.fontSize = '28px'
      }

      divIn.className = ' divIn'
      divIn.style.width = size +'px'
      divIn.style.height = size +'px'
      divIn.style.top = 0 + 'px'
      divIn.style.left = 0 + 'px'
      divIn.style.lineHeight = sizeSmall +'px'
      divIn.style.fontSize = rate +'px'
      
      divIn.style.backgroundSize = 'contain'

      var divScale = document.createElement('div')
      divScale.backgroundSize = 'contain'
      if(isPos == 'positive'){
        divScale.style.background = 'url("images/003.png") no-repeat center';
      }else{
        divScale.style.background = 'url("images/006.png") no-repeat center';
      }


      divMiddle.appendChild(divIn)
      divOut.appendChild(divMiddle)
      // divOut.appendChild(divScale)
      res.appendChild(divOut)

      if(isPos == 'positive'){
        tar.appendChild(res)
      }else{
        tarNeg.appendChild(res)
      }
    }

  }
}
