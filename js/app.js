//List holding all my cards

let cards = $('.card');

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Start Game function

function startGame() {
   cards = shuffle(cards);

   // loop through each card and create its HTML
   // add each card's HTML to the page
   // Display the cards on the page

   for (let card of cards){
       	$('.deck').append(card);
       }
       showAllCards();
}
startGame();

//Reset Game (functions and values)

function resetGame() {
    if (cards.hasClass('clicked')) {
      cards.removeClass('clicked');
    }
    if (cards.hasClass('open')) {
      cards.removeClass('open');
    }
    if (cards.hasClass('show')) {
      cards.removeClass('show');
    }
    if (cards.hasClass('match')) {
      cards.removeClass('match');
    }
    if (cards.hasClass('flipInY')) {
      cards.removeClass('flipInY');
    }
    matchedCardsArr = [];
    openCardsArr = [];

    // Reset Timer and Stars

    seconds = 0;
    clearInterval(counter);
    $('#time-info').html('00 : 00');
    firstClick = false;
    move = 0
    $('.moves').html(move);
    starsNumber = 3;
    secondStar.attr('class', 'star-two fa fa-star');
    LastStar.attr('class', 'star-three fa fa-star');

    // Reset Play Status

    play = false;
  }

  // Show cards for a little time and hide

  let play = false;
  function showAllCards() {
     setTimeout(function () {
      cards.addClass('open show flipInY');

    //Removing class after animation

     setTimeout(function () {
       cards.removeClass('flipInY');

       // Flip cards again

       setTimeout(function () {
         cards.removeClass('open show');
         cards.addClass('flipInY');
         setTimeout(function () {
           cards.removeClass('flipInY');
           play = true;
         }, 320);
       }, 1020);
     }, 320);
    }, 250);
  }

  // Loop through cards to check event 'click' and wait while the game is running

  cards.each(function () {
    let $this = $(this);
    $this.on('click', function () {
      if (play) {
        if (!firstClick) {
          timer();
        }

        if (!gameIsRunning) {
          displaySymbol($this);

          // Store card if openCardsArr is empty.

          if (openCardsArr.length < 1 && !$this.hasClass('match')) {
            openCards($this);

            // Check for matches

          } else if (openCardsArr.length == 1 && !$this.hasClass('clicked') && !$this.hasClass('match')) {
            gameIsRunning = true;
            incrementMovecounter($this);
            decrementStars();
            setTimeout(function() {
              matchedOrNotmatchedCards($this);
            }, 320);
          }
        }
      }
    });
  });

  //Display Card Symbol function

  function displaySymbol(element) {
    if (!element.hasClass('show') && !element.hasClass('match')) {
      element.addClass('open show flipInY');
    }
    setTimeout(function () {
      element.removeClass('flipInY');
    }, 320);
  }

  // Open cards list and function to store the clicked cards

  let openCardsArr = [];
  function openCards(element) {
    openCardsArr.push(element);
    if (!element.hasClass('match')) {
      element.addClass('clicked');
    }
  }
  function resetOpenCards() {
    openCardsArr = [];
    if ($('.clicked').length) {
      $('.clicked').removeClass('clicked');
    }
  }

  let gameIsRunning = false;

  // Checking if the game is running

  function  matchedOrNotmatchedCards(element) {

    if (typeof openCardsArr !== 'undefined' && openCardsArr.length > 0) {

      let clickedElement = element;
      let openCardElement =  openCardsArr[openCardsArr.length - 1];
      let clickedClass = element.children().attr('class');
      let openCardClass = openCardsArr[openCardsArr.length - 1].children().attr('class');

        // Lock cards on Matches

        if (clickedClass === openCardClass) {
          clickedElement.removeClass('open show');
          clickedElement.addClass('match');
          openCardElement.removeClass('open show');
          openCardElement.addClass('match');
          clickedElement.addClass('rubberBand');
          openCardElement.addClass('rubberBand');

          // Remove animation after match

          setTimeout(function () {
            clickedElement.removeClass('rubberBand');
            openCardElement.removeClass('rubberBand');
            matchedCardsArr.push(clickedElement, openCardElement);

            // Check if all cards are matched

            winGame();
            resetOpenCards();
            gameIsRunning = false;

          }, 1020);

        } else if (clickedClass !== openCardClass) {

          clickedElement.addClass('wobble wrong-answer');
          openCardElement.addClass('wobble wrong-answer');

          window.setTimeout(function () {
              clickedElement.removeClass('wobble open show wrong-answer');
              openCardElement.removeClass('wobble open show wrong-answer');
              clickedElement.addClass('flipInY');
              openCardElement.addClass('flipInY');
              setTimeout(function () {
                clickedElement.removeClass('flipInY');
                openCardElement.removeClass('flipInY');
              }, 1020);
              resetOpenCards();
              gameIsRunning = false;
          }, 1020);
        }
    }
  }

  // Setting the timer from start to finish

  let firstClick = false;
  let counter;
  let seconds = 0;
  let second = 0;
  let minute = 0;

  function timer() {
    firstClick = true;
    counter = setInterval(function () {
            seconds += 1;
            second = (seconds % 60);
            minute = parseInt(seconds / 60);
            if (second < 10) {
              second = `0${(seconds % 60)}`;
            }
            if (minute < 10) {
              minute = `0${parseInt(seconds / 60)}`;
            }
            $('#time-info').html(`${minute} : ${second}`);
        }, 1000);
  }

  // Prevent the move counter to count all click event

  let move = 0;

  function incrementMovecounter(element) {
    if (!element.hasClass('clicked')) {
      move += 1;
      $('.moves').html(move);
    }
  }

  // Star Counter function

  let starsNumber = 3;
  let secondStar = $('.star-two');
  let LastStar = $('.star-three');

  function decrementStars() {
    if (move == 11) {
      starsNumber = 2;
      LastStar.attr('class', 'star-three fa fa-star-o');
    }
    if (move == 16) {
      starsNumber = 1;
      secondStar.attr('class', 'star-two fa fa-star-o');
    }
  }

  // Score Show Variables
  
  let scoreShow = $('.score-show');
  let scoredMessage = $('.scored');


  // Game Winning Function

  let matchedCardsArr = [];
  function winGame() {
    if (matchedCardsArr.length === 16) {
      clearInterval(counter);
      window.setTimeout(function () {
        $('#win-message-section').css({opacity: 1, visibility: 'visible'});
        $('.righ-mark').addClass('drawn');
        $('.fade-out').addClass('fade-in');

        // Game info display

        $('#moves-number').text(move);
        if (starsNumber === 1) {
          $('#stars-info').text(starsNumber + ' star');
        } else {
          $('#stars-info').text(starsNumber + ' stars');
        }

        // Timer info display

        let minuteTxt = 'minutes';
        let secondTxt = 'seconds';
        if (second === '01') {
          secondTxt = 'second';
        }
        if (minute === '01') {
          minuteTxt = 'minute';
        }
        $('#seconds-info').text(`${minute} ${minuteTxt} and ${second} ${secondTxt}`);
      }, 1000);
    }
  }

  // Restart Game

  $('#restart').on('click', function () {
    resetGame();
    startGame();
  });

  // Play Again function

  $('#play-again').on('click', function () {
    resetGame();
    startGame();
    $('#win-message-section').css({opacity: 0, visibility: 'hidden'});
    $('.righ-mark').removeClass('drawn');
    $('.fade-out').removeClass('fade-in');
  });
