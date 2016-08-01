// Allow users to click the images to see a larger version with more information.


//wait to start javascript until the page is loaded
// Place your code here, inside the document ready handler.
$(document).on('ready', function(){
  // Create a function called `searchImages()`. This function will handle the
  // process of taking a user's search terms and sending them to Flickr for a
  // response.
  // Accept a string value called `tags` as an argument. Example:
  var searchImages = function(tags) {
    // Define the location of the Flickr API like this:
    // `var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";`
    var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    console.log(tags);
    $('#images').innerHTML = '<li class="search-throbber">Searching...</li>';
    //start JSON
    // Construct a `$.getJSON()` call where you send a request object
    // including the tags the user submitted, and a `done()` handler
    // that displays and refreshes the content appropriately
    $.getJSON( flickrAPI, {
      //what about the text argument?
      tags: tags,
      tagmode: "any",
      format: "json"
    }).done(function( data ) {
      //empty images div
      $('#images').empty();
      //show user what was searched for
      $('h1.search-title').first()[0].innerHTML = "Search for: " + tags;

      // Update the display to add the images to the list with the id
      // `#images`.
      $.each( data.items, function( i, item ) {
        //styling the list items like this works great except for the really long desc.
        // I tried cutting off the descriptions. Couldn't make it work. leaving the
        // height empty also didn't work as bootstrap would adjust oddly
        var newListImg = $("<li class='col-sm-6 col-md-4 col-lg-3' style='height: 500px'>")
        var imgTitle = $('<p class="image-title">').html(item.title).appendTo(newListImg);
        var imgDate = $('<p class="image-date">').text(item.date_taken).appendTo(newListImg);
        var imgLink = $('<a>').attr('href', item.link).text('View on Flickr.').appendTo(newListImg);
        var imgDescription = $('<p class="image-description">').html(item.description).appendTo(newListImg);
        // Some of these images come with very long descriptions. I tried to find a way to
        // shorten that as the arrays and functions project did. But something with jQuery was
        // stopping it.


        // Modal button
        var modalButton = $("<button class='btn btn-sm btn-primary'>enlarge</button>").attr({
          'data-title': item.title,
          'data-toggle': "modal",
          'data-target': "#infoModal",
          'data-imgsrc': item.media.m,
          'data-description': item.description,
          'type': "button"
        }).appendTo(newListImg);
        newListImg.appendTo( "#images" );
        if ( i === 19 ) {
          return false;
        }
      });
    });
  };

  //when the button is clicked, search flickr for that term
  // Attach an event to the search button (`button.search`) to execute the
  // search when clicked.
  $('button.search').on('click', function(event){
    // Prevent the default event execution so the browser doesn't
    event.preventDefault();
    // Get the value of the 'input[name="searchText"]' and use that
    // as the `tags` value you send to `searchImages()`.
    var searchTextInput = $(event.target.parentElement).find('input[name="searchText"]')[0];
    console.log(searchTextInput);
    //  Execute the `searchImages()` function to fetch images for the
    //  user.
    searchImages(searchTextInput.value);
  });

  $('#infoModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var title = button.data('title'); // Extract info from data-* attributes
    var imgSrc = button.data('imgsrc');
    var imageDescription = button.data('description');

    // Update the modal's content
    var modal = $(this);
    //update modal title to whatever flickr sends
    modal.find('.modal-title').html(title);
    //clear out modal body for the image
    var modalBody = modal.find('.modal-body');
    modalBody.empty();
    var modalDescription = $("<p class='image-description'>").html(imageDescription).appendTo(modalBody);
  });

});
