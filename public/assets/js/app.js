$(document).ready(function() {
    $(document).on("click", ".scrape-new", handleArticleScrape);

    function handleArticleScrape() {
        // This function handles the user clicking any "scrape new article" buttons
        $.get("/api/fetch").then(function(data) {
          // If we are able to successfully scrape the NYTIMES and compare the articles to those
          // already in our collection, re render the articles on the page
          // and let the user know how many unique articles we were able to save
          // initPage();
          console.log(data)
          // data.message = "Scrape completed!"
          // bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
          window.location.href = "/";
        });
      }
});