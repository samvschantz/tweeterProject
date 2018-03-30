$(function(){
  //function for transforming received tweet data into HTML
  function createTweetElement(tweetData){
    var name = tweetData['user']['name'];
    var largeAvatar = tweetData['user']['avatars']['large'];
    var handle = tweetData['user']['handle'];
    var content = tweetData['content']['text'];
    var dateNums = (tweetData['created_at']);
    var dayPosted = new Date(dateNums);
    var currentDay = new Date();

    var $tweet = $("<article>").addClass("oldTweet");

    //security against xss
    function escape(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    //header
    var $img = $("<img>").attr("src", largeAvatar);
    var $displayName = $(`<div class="displayName">${name}</div>`);
    var $userName = $(`<div>`).addClass("userName").append(`${handle}</div>`);
    var $header = $("<header>");
    $($header).append($img);
    $($header).append($displayName);
    $($header).append($userName);

    $($tweet).append($header);

    //content
    var $content = $(`<div>${escape(content)}</div>`).addClass("content");
    $($tweet).append($content);

    //footer
    var $footer = $(`<footer>`);
    var $daysSince = $(`<div>${(currentDay.getUTCDay() - dayPosted.getUTCDay())} days ago</div>`).addClass("daysSince");
    var $icons = $(`<div>`).addClass("icons");
    var $test = $(`<div>test</div>`)
    var $heart = $(`<i>`).addClass("fa fa-heart")
    var $retweet = $(`<i>`).addClass("fa fa-retweet")
    var $flag = $(`<i>`).addClass("fa fa-flag")
    $($icons).append($heart);
    $($icons).append($retweet);
    $($icons).append($flag);
    $($footer).append($daysSince);

    $($footer).append($icons);

    $($tweet).append($footer);
    $($tweet).append("</article>");

    return $tweet;
  }

  //goes through tweets and displays using previously defined function
  function renderTweets(tweets) {
    for (i in tweets){
      var $tweet = createTweetElement(tweets[i]);
      $('#tweetContainer').prepend($tweet);
    }
  }

  function loadTweets(){
    $.ajax({
      url: 'http://localhost:8080/tweets',
      method: 'GET',
      success: function (tweets) {
        renderTweets(tweets);
      }
    })
  }

  loadTweets();

  var $button = $('#sendtweet');
    $button.on('click', function(event){
      event.preventDefault();
      var charLeft = $('form').text();
      if (charLeft > 139){
        $.flash('Write more!');
      } else if (charLeft < 0){
        $.flash('Tweets must be less than 140 characters!');
      } else {
        $.get('/tweets').done(function() {
          $('#tweetContainer').empty();
          $('.new-tweet textarea').val('');
          $('.counter').html('<span class="counter" style="float:right;padding:0em1em0em1em;font-style:italic;font-size:normal;">140</span>');
        })

        var data = $('form').serialize();

        $.post('/tweets', data).done(function() {
          loadTweets();
        })
      }
      loadTweets();
    });

  var $compose = $('#compose');
  $compose.on('click', function(event){
    event.preventDefault();
    $('.new-tweet').slideToggle('slow', function(){
      $('.new-tweet textarea').focus();
    });
  })
})
