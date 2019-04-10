$('document').ready(function()  {

    var tbody = $("#books");

    var genres = {
        "1" : "Romans",
        "2" : "Obyczajowa",
        "3" : "Sci-fi i fantasy",
        "4" : "Literatura faktu",
        "5" : "Popularnonaukowa",
        "6" : "Poradnik",
        "7" : "Kryminał, sensacja"
    }

    tbody.on("click", ".details", function(event) {

        event.preventDefault();

        var link = $(this);
        var tr = $(event.target).closest("tr");

        if (link.text() === "show") {

            link.text("hide");
            var bookId = link.data("id");

            $.get(`http://localhost:8000/book/${bookId}`).done(function(book) {

                    var tr_details = $('<tr>');
                    var td_details = $(`<td colspan="3">`)
                    var details = $(`<div class="bookDetails">`)

                    var p1 = $(`<p><b>ISBN</b>: ${book.isbn}</p>`);
                    var p2 = $(`<p><b>Publisher</b>: ${book.publisher}</p>`);
                    var p3 = $(`<p><b>Genre</b>: ${genres[`${book.genre}`]}</p>`)

                    details.append(p1)
                    .append(p2)
                    .append(p3)

                    td_details.append(details)
                    tr_details.append(td_details)
                    tr_details.insertAfter(tr);
                    
                })
                .fail(function() {
                    alert("We are unable to connect to server");

                });

        } else {

            link.text("show");
            tr.next().remove();

        }
    });

    $.get("http://localhost:8000/book/").done(function(books) {
        tbody.empty();
        books.forEach(function(element)   {
            var tr = $(`<tr class="list">`);
            tr.append($(`<td>${element.author}</td>`))
            tr.append($(`<td>${element.title}</td>`))
            tr.append($(`<td><button class="details btn btn-default" href="#" data-id="${element.id}">show</button></td>`))

            tbody.append(tr);

        });
    });
});