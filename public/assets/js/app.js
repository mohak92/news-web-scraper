$(document).ready(function () {
  $(document).on("click", ".scrape-new", scrapeArticle);
  $(document).on("click", ".clear", clearArticle);
  $(document).on("click", ".clear-saved", clearSavedArticle);
  $(document).on("click", ".save", saveArticle);
  $(document).on("click", ".delete", deleteSavedArticle);
  $(document).on("click", ".notes", addNotesToArticle);

  // This function handles the user clicking any "scrape new article" buttons
  function scrapeArticle() {
    $(".article-container").prepend( '<div class="loader"></div>' );
    $.get("/api/fetch").then(function (data) {
      console.log(data)
      setTimeout(
        function () {
          window.location.href = "/";
        }, 2000);
    });
  }

  //This function sends request to server to delete unsaved article in the collection
  function clearArticle() {
    $.get("/api/clear").then(function (data) {
      console.log(data)
      $(".articleContainer").empty();
      location.reload();
    });
  }

  //This function sends request to server to delete unsaved article in the collection
  function clearSavedArticle() {
    $.get("/api/clear/saved").then(function (data) {
      console.log(data)
      $(".articleContainer").empty();
      location.reload();
    });
  }

  //This function is called when user click save article, send a request to server to update the document in collection to be saved.
  function saveArticle() {
    // get ID od the article to save
    var articleID = $(this)
    .parents(".card")
    .data();

    // removes article from home page. the article is available on Saved page.
    $(this)
    .parents(".card")
    .remove();

    // put method to update in database to save article for comments
    $.ajax({
      method: "PUT",
      url: "/api/save/" + articleID._id
    }).then(function(data) {
      console.log(data);
    });
  }

  //this function called when user wants to delete specific article
  function deleteSavedArticle() {
    // get ID od the article to save
    var articleID = $(this)
    .parents(".card")
    .data();

    // removes article from saved page.
    $(this)
    .parents(".card")
    .remove();

    $.get("/api/deleteSaved/"+articleID._id);
  }

  //this fucntion gets article id crates a modal with text area and adds a note
  function addNotesToArticle() {
    var articleID = $(this)
    .parents(".card")
    .data();
    
    $.get("/api/notes/" + articleID._id).then(function(data) {
      console.log(data)
      // Constructing our initial HTML to add to the notes modal
      var modalText = $("<div class='container-fluid text-center'>").append(
        $("<h4>").text("Notes For Article: " + articleID._id),
        $("<hr>"),
        $("<ul class='list-group note-container'>"),
        $("<textarea placeholder='New Note' rows='4' cols='50'>"),
        $("<button class='btn btn-success save'>Save Note</button>")
      );
      console.log(modalText)
      // Adding the formatted HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: articleID._id,
        notes: data || []
      };
      console.log('noteData:' + JSON.stringify(noteData))
      // Adding some information about the article and article notes to the save button for easy access
      // When trying to add a new note
      $(".btn.save").data("article", noteData);
      // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
      renderNotesList(noteData);
    });
  }
});