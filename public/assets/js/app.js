$(document).ready(function () {
  $(document).on("click", ".scrape-new", scrapeArticle);
  $(document).on("click", ".clear", clearArticle);
  $(document).on("click", ".clear-saved", clearSavedArticle);
  $(document).on("click", ".save", saveArticle);
  $(document).on("click", ".delete", deleteSavedArticle);
  $(document).on("click", ".notes", addNotesToArticle);
  $(document).on("click", ".note-save", saveNote);
  $(document).on("click", ".note-delete", deleteNote);

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

  //This fucntion gets article id crates a modal with text area and adds a note
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
        $("<button class='btn btn-success note-save'>Save Note</button>")
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
      //Pulling article ID to be accessible in the save notes method
      $(".note-save").data("article", noteData);
      // getAllNotes will populate the actual note HTML inside of the modal we just created/opened
      getAllNotes(noteData);
    });
  }

  // This function called when user click on X to delete a note
  function deleteNote() {
    // First we grab the id of the note we want to delete
    // We stored this data on the delete button when we created it
    var noteID= $(this).data("_id");
    // AJAX request to server to delete note
    $.ajax({
      url: "/api/notes/" + noteID,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }

  //Function called when user clicks save button on the modal
  function saveNote() {
    var noteData;
    var newNote = $(".bootbox-body textarea")
      .val()
      .trim();
    console.log(newNote);
    if (newNote) {
      noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
      console.log(noteData);
      $.post("/api/notes", noteData).then(function() {
        // When complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  //Display all notes related to article
  function getAllNotes(data) {
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      // If we have no notes, just display a message explaining this
      currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
      notesToRender.push(currentNote);
    } else {
      // If we do have notes, go through each one
      for (var i = 0; i < data.notes.length; i++) {
        // Constructs an li element to contain our noteText and a delete button
        currentNote = $("<li class='list-group-item note'>")
          .text(data.notes[i].noteText)
          .append($("<button class='btn btn-danger note-delete'>x</button>"));
        // Store the note id on the delete button for easy access when trying to delete
        currentNote.children("button").data("_id", data.notes[i]._id);
        // Adding our currentNote to the notesToRender array
        notesToRender.push(currentNote);
      }
    }
    // Now append the notesToRender to the note-container inside the note modal
    $(".note-container").append(notesToRender);
  }
});