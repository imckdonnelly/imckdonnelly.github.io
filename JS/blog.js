$(document).ready(function() {

  function showMenu() {
      $('#nav-bar').css({
        "width":"35%", 
        "padding":"6em 1em 2em"
      });
      $('#close-button').css("display", "block");
  }
  
  function hideMenu() {
    $('#nav-bar').css({
      "width": "0", 
      "padding": "0"
    });
    $('#close-button').css("display", "none");
  }
  
  var articles = $('#articles')
  var states = $('#visualizer')
  var about = $('#about')
  function adjustArticles() {
    states.toggleClass('lowered');
    var lowered = states.hasClass('lowered');
    states.animate
      ({marginTop: lowered ? '450px' : 0}, 300);
    $('#article-names').toggle(300)
  }
  
  function adjustStates() {
    about.toggleClass('lowered');
    var lowered = about.hasClass('lowered');
    about.animate
      ({marginTop: lowered ? '250px' : 0}, 300);
    $('#states').toggle(300)
  }
  
  
  
  $('#open-button').click(function() {
    if ($(".header").css("display") === "flex"){
      return false;
    }
    else {
      showMenu();
    }
  });
  
  $('#close-button').click(function() {
    if ($(".header").css("display") === "flex"){
      return false;
    }
    else {
      hideMenu();
    }
  });
  
  $('#articles').click(function() {
    if ($(".header").css("display") === "block"){
      adjustArticles();
    }
  });
  
  $('#visualizer').click(function() {
    if ($(".header").css("display") === "block"){
      adjustStates();
    }
  });
  
});