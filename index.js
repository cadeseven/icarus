function game(){
  theGame = this;
  theGame.cont = $('#gamespace');
  theGame.player = $('#player');
  $('.landscape').remove();
  theGame.player.css("top",'')
  $('#gameover').fadeOut('med');
  theGame.player.removeClass("dead");
  theGame.width = theGame.cont.width();
  theGame.height = theGame.cont.height();
  theGame.gravity = 10;
  theGame.score = 800;
  theGame.barWidth = 50;
  theGame.cont.append('<style>#gamespace div.landscape{width:'+theGame.barWidth+'px}</style>');
  theGame.cont.append('<div class="landscape"><div class="bar top"></div><div class="bar bottom"></div></div>');
  theGame.last = -50;
  theGame.change = 5;

  function move(){
    var highest = 0;
    $('.landscape').each(function(){
        var right = parseInt($(this).css("right"));
        if(right>highest){
          highest=right;
        }
        $(this).css("right",right+theGame.barWidth+"px");
        if(right>theGame.width){
          theGame.score++;
          $(this).css("right","0px");
          var num = Math.random();
          if(num>0.9){
            theGame.change *= -1;
          }
          if(theGame.last==0){
            if(theGame.change>0){
              theGame.change *= -1;
            }
          }
          if(theGame.last==-80){
            if(theGame.change<0){
              theGame.change *= -1;
            }
          }
          $(this).css("top",(theGame.last+theGame.change)+"px");
          var top = parseInt($(this).css("top"));
          theGame.last = top;
        }
      });
    if(highest!=(theGame.width+theGame.barWidth)){
      theGame.cont.append('<div class="landscape"><div class="bar top"></div><div class="bar bottom"></div></div>');
    }
  }

  function blockMove(){
    if(theGame.clicked){
      theGame.gravity -= 3;
    } else {
      theGame.gravity += 8;
    }
    if(theGame.gravity>10){
      theGame.gravity = 10;
    }
    if(theGame.gravity<-10){
      theGame.gravity = -10;
    }
    theGame.player.animate({top: "+="+theGame.gravity}, 1);
  }

  function checkCollisions(){
    theGame.player.left = parseInt(theGame.player.css("left"));
    theGame.player.top = parseInt(theGame.player.css("top"));
    var width = theGame.player.width();
    var height = theGame.player.height();
    theGame.player.right = theGame.player.left+width;
    theGame.player.bottom = theGame.player.top+height;
    if(theGame.player.bottom>=theGame.height){
      gameOver();
    } else if(theGame.player.top<=0){
      gameOver();
    }

    $('.landscape').each(function(){
        var left = theGame.width-(parseInt($(this).css("right")));
        var right = left-theGame.barWidth;
        if(left<=theGame.player.right&&right>=theGame.player.left){
          var totalHeight = $(this).height();
          var height = $('.top',this).height();
          var top = parseInt($(this).css("top"));
          var bottom = top+totalHeight;
          top += height;
          bottom -= width;
          if(top>=theGame.player.top||bottom<=theGame.player.bottom){
           gameOver();
          }
        }
      });
  }

  function colorise(){
    if(theGame.score>2000){
      $('.landscape:not(.high)').addClass('high');
      $('.landscape.med)').removeClass('med');
    } else if(theGame.score>1500){
      $('.landscape:not(.med)').addClass('med');
      $('.landscape.low)').removeClass('low');
    } else if(theGame.score>1000){
      $('.landscape:not(.low)').addClass('low');
    }

  }

  function gameOver(){
    window.clearTimeout(theGame.Tick);
    var best = localStorage.getItem("highscore");
    if(best<theGame.score){
      localStorage.setItem("highscore",theGame.score);
    }
    theGame.player.addClass("dead");
    $('span.highscore','#gameover').html(localStorage.getItem("highscore"));
    $('span.score','#gameover').html(theGame.score);
    $('#gameover').fadeIn('med');
  }

  this.tick = function(){
    move();
    blockMove();
    $('#score').html(theGame.score);
    colorise();
    theGame.Tick = window.setTimeout(theGame.tick,(50000/theGame.score));
    checkCollisions();
  }

}

var gameWin = $('#gamespace');
$('a','#gameover').click(function(){
  gameWin.game = new game();
  gameWin.game.tick();
});

gameWin.game = new game();
gameWin.game.tick();
gameWin.mousedown(function(){
    gameWin.game.clicked = true;
  });
gameWin.mouseup(function(){
    gameWin.game.clicked = false;
  });
