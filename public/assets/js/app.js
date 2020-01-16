$(document).ready(function () {
  $(document).on("click", ".scrape-new", scrapeArticle);
  $(document).on("click", ".clear", clearArticle);
  $(document).on("click", ".save", saveArticle);

  function scrapeArticle() {
    // This function handles the user clicking any "scrape new article" buttons
    $.get("/api/fetch").then(function (data) {
      console.log(data)
      setTimeout(
        function () {
          window.location.href = "/";
        }, 2000);
    });
  }

  //This function sends request to server to delete article in the collection
  function clearArticle() {
    $.get("/api/clear").then(function (data) {
      console.log(data)
      $(".articleContainer").empty();
      location.reload();
    });
  }

  //This function is called when user click save article, send a request to server to update the document in collection to be saved.
  function saveArticle() {

  }
});