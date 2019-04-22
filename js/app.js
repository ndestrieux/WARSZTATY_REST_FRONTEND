$('document').ready(function()  {

    var url = "http:localhost:8000/book/"

    var form = $("#newBook");
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

        
    function ajaxCall(url, type, data=undefined)    {
        // Main AJAX call function
        return  $.ajax({
                url: url,
                type: type,
                data: data,
                error: function()   {
                    alert("We are unable to connect to server");
                },
            });
    };

    function displayData(books) {
        // Display data loaded from REST server
        tbody.empty();
        books.forEach(function(element)   {
            var tr = $(`<tr class="list">`);
            tr.append($(`<td>${element.author}</td>`))
            tr.append($(`<td>${element.title}</td>`))
            tr.append($(`<td><button class="details btn btn-default" data-type="GET" data-id="${element.id}">show</button></td>`))
            tr.append($(`<td><button class="delete btn btn-danger" data-type="DELETE" data-id="${element.id}">delete</button></td>`))

            tbody.append(tr);
        });
    };


    ajaxCall(url, 'GET')
        .done(function(books)    {

            displayData(books);

            tbody.on("click", ".details", function(event) {
                // Show/hide details of the entry
                event.preventDefault();
        
                var tr = $(event.target).closest("tr");
        
                if ($(this).text() === "show") {
                    $(this).text("hide");
                    const type = $(this).data("type");
                    const actionUrl = url + $(this).data("id")

                    ajaxCall(actionUrl, type).done(function(book){
                        const tr_details = $('<tr>');
                        const td_details = $(`<td colspan="4">`)
                        const details = $(`<div class="bookDetails">`)

                        const p1 = $(`<p><b>ISBN</b>: ${book.isbn}</p>`);
                        const p2 = $(`<p><b>Publisher</b>: ${book.publisher}</p>`);
                        const p3 = $(`<p><b>Genre</b>: ${genres[`${book.genre}`]}</p>`)

                        details.append(p1)
                        .append(p2)
                        .append(p3)

                        td_details.append(details)
                        tr_details.append(td_details)
                        tr_details.insertAfter(tr);

                    })
                } else {
        
                    $(this).text("show");
                    tr.next().remove();
        
                }

            });


            form.submit(function(event) {
                // create new entry from form on REST server
                event.preventDefault();
        
                const type = form.data("type")
                const formData = form.serialize();
        
                ajaxCall(url, type, formData).done(function(element) {
                    var tr = $(`<tr class="list">`);
                    tr.append($(`<td>${element.author}</td>`))
                    tr.append($(`<td>${element.title}</td>`))
                    tr.append($(`<td><button class="details btn btn-default" data-type="GET" data-id="${element.id}">show</button></td>`))
                    tr.append($(`<td><button class="delete btn btn-danger" data-type="DELETE" data-id="${element.id}">delete</button></td>`))
                    
                    tbody.append(tr);
                });
                
            });

            
            tbody.on("click", ".delete", function(event)    {
                // delete entry on REST server
                event.preventDefault();

                const type = $(this).data("type");
                const actionUrl = url + $(this).data("id");
                const trDelete = $(this).closest("tr");

                ajaxCall(actionUrl, type).done(function()   {
                    trDelete.remove();
                });

            });
        });

});