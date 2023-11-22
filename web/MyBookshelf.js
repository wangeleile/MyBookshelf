// Define the dimensions of the bookshelf
const width = 800;
const height = 400;

// Create an SVG container
const svg = d3.select("#bookshelf")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Create a group element to contain the book covers
const bookGroup = svg.append("g")
    .attr("class", "book-group");

d3.csv('./../MyBooks/books.csv')
    .then(function (data) {

        console.log(data[19]);
        // data is now whole  data set
        // draw chart in here!
        function tabulate(data, columns) {
            var table = d3.select("body").append("table")
                .attr("style", "margin-left: 250px"),
                thead = table.append("thead"),
                tbody = table.append("tbody");

            // append the header row
            thead.append("tr")
                .selectAll("th")
                .data(columns)
                .enter()
                .append("th")
                .text(function (column) { return column; });

            // create a row for each object in the data
            var rows = tbody.selectAll("tr")
                .data(data)
                .enter()
                .append("tr");

            // create a cell in each row for each column
            var cells = rows.selectAll("td")
                .data(function (row) {
                    return columns.map(function (column) {
                        return { column: column, value: row[column], image: row['Image_Path']  };
                    });
                })
                .enter()
                .append("td")
                .attr("style", "font-family: Courier") // sets the font style
                .html(function (d) {
                    // Check if the column is for images and create an img element if so
                    if (d.column === 'Image_Path') {
                        return "<img src='" + d.value + "' width='50' height='75'>"; // Adjust width and height as needed
                    }
                    return d.value;
                });

            return table;
        }

        // render the table
        var peopleTable = tabulate(data, ["Book Id","Title", "Author", "ISBN","Number of Pages"]);

        // Create a function to render the bookshelf
        function renderBookshelf(data) {
            // Select all book covers
            
             const books = bookGroup.selectAll(".book")
                 .data(data);

            // Enter new books
            const newBooks = books.enter()
                .append("g")
                .attr("class", "book")
                .attr("transform", (d, i) => `translate(${i * 120}, 50)`); // Adjust the positioning as needed

            // Append book covers
            // newBooks.append("image")
            //     .attr("xlink:href", d => d.coverUrl)
            //     .attr("width", 100)
            //     .attr("height", 150);

            // // Append book titles and authors
            newBooks.append("text")
                .text(d => `${d.Title} by ${d.Author}`)
                .attr("y", 170)
                .attr("x", 50)
                .attr("text-anchor", "middle");
        }

        // Call the renderBookshelf function with the loaded CSV data
        renderBookshelf(data);
        
        
        function visualizeBookshelf(data) {
            const bookHeight = 150; // Fixed height for all books
            const pageToWidthRatio = 0.1; // How wide a book will be based on its number of pages
        
            const svg = d3.select("#bookshelf")
                          .append("svg")
                          .attr("width", 1000) // set a fixed width, adjust as needed
                          .attr("height", bookHeight);
        
            let xOffset = 0;
        
            books.forEach(book => {
                // Convert pages to a number and handle potential non-numeric values
                const pages = parseInt(book.pages, 10);
                if (isNaN(pages)) {
                    console.error(`Invalid pages value for book: ${book.title}`);
                    return;  // Skip this book and continue with the next
                }
        
                const bookWidth = pages * pageToWidthRatio;
                const bookGroup = svg.append("g")
                                     .attr("transform", `translate(${xOffset}, 0)`);
        
                // Drawing the book rectangle (back)
                bookGroup.append("rect")
                         .attr("width", bookWidth)
                         .attr("height", bookHeight)
                         .attr("fill", "#f4f4f4")
                         .attr("stroke", "black");
        
                // Adding the book title text
                bookGroup.append("text")
                         .attr("x", bookWidth / 2)
                         .attr("y", bookHeight / 2)
                         .attr("text-anchor", "middle")
                         .attr("dominant-baseline", "middle")
                         .text(book.title)
                         .attr("font-size", 10)
                         .attr("fill", "black");
        
                xOffset += bookWidth + 10; // 10 is the gap between books
            });
        }
        visualizeBookshelf(data);

    })
    .catch(function (error) {
        // handle error   
        console.error("Error loading CSV data:", error);

    })