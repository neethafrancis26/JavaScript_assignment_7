const xhr = new XMLHttpRequest();

const descriptionText = document.getElementById("descriptionText");
const metadata = document.getElementById("metadata");
xhr.onload = function () {
    if (this.status === 200) {
        try {
            const resObj = JSON.parse(this.responseText);
            console.log(resObj);
            const desc = resObj.description;
            document.getElementById("descriptionText").innerHTML = desc;
            const arr = resObj.items;
            console.log(arr);

            function displayCards(item) {
                arr.forEach((element) => {
                    const card = document.createElement("div");
                    card.style.width = "200px";
                    card.style.height = "180px";
                    card.style.borderRadius = "20px"
                    card.style.background = "pink";
                    card.style.color = "black";
                    card.style.margin = "10px";
                    card.style.padding = "10px";

                    card.innerText = `
                        Name: ${element.name} 
                        Description: ${element.description} 
                        Price: ${element.price}
                        `;
                    descriptionText.appendChild(card);

                });
            }
            displayCards(arr);

            // Convert the creation date format from "YYYY-MM-DD" to a more readable format, such as "January 10, 2024"(don't hardcode it)
            const originalDate = resObj.metadata.creationDate;
            const date = new Date(originalDate);
            const option = { year: "numeric", month: "long", day: "numeric" };
            const stringDate = date.toLocaleDateString("en-us", option);

            metadata.innerHTML = `
                Author: ${resObj.metadata.author}
                Creation Date: ${stringDate}
            `;

            // Question 1: Write a JavaScript function to filter items in the array based on price (e.g., show only items over $500).
            function renderHTML(container, items) {
                container.innerHTML = items
                    .map((item) => `
                <div>
                    Name: ${item.name} <br>
                    Description: ${item.description} <br>
                    Price: ${item.price} <br><br>
                </div
                `).join("");
            }

            const filterPrice = document.getElementById("filterPrice");
            function CheckPrice(item) {
                return item.price >= 500;
            }

            const result = arr.filter(CheckPrice);
            renderHTML(filterPrice, result);

            // Question 2: Create a function to sort the array of items by name or price in ascending or descending order.
            const sortedName = document.getElementById("sortedName");
            function sortedItems(item) {
                return item.sort((a, b) => a.name.localeCompare(b.name));
            }

            const newArray = sortedItems(arr);
            renderHTML(sortedName, newArray);

            // Question 3: Create a simple form (also add validation) to add a new items to the items array and display it immediately in the card section.
            const detailsForm = document.getElementById("detailsForm");
            const fname = document.getElementById("fname");
            const price = document.getElementById("price");
            const descriptions = document.getElementById("desc");
            const nameError = document.getElementById("nameError");
            const descError = document.getElementById("descError");
            const priceError = document.getElementById("priceError");

            nameError.style.display = "none";
            descError.style.display = "none";
            priceError.style.display = "none";

            detailsForm.addEventListener("submit", function (event) {
                event.preventDefault();

                let valid = true;

                if (!fname.value.trim()) {
                    nameError.style.display = "block";
                    valid = false;
                } else {
                    nameError.style.display = "none";
                }

                if (!descriptions.value.trim()) {
                    descError.style.display = "block";
                    valid = false;
                } else {
                    descError.style.display = "none";
                }

                const priceValue = price.value.trim();
                if (!/^\d+$/.test(priceValue)) {
                    priceError.style.display = "block";
                    valid = false;
                } else {
                    priceError.style.display = "none";
                }

                if (valid) {
                    const newItem = {
                        name: fname.value,
                        description: descriptions.value,
                        price: Number(price.value),
                    };

                    arr.push(newItem);
                    displayCards(arr);
                    console.log(arr);
                    detailsForm.reset();
                    alert("form submitted");
                }
            });

            // Question 4: Write a function to retrieve and display the author and creation date from the nested metadata object in the JSON file.
            const data = resObj.metadata;
            const dataDisplay = document.getElementById("dataDisplay");
            displayMeta(data);

            function displayMeta(item) {
                dataDisplay.innerHTML = `
                <div>
                    Author: ${item.author} <br>
                    Creation Date: ${item.creationDate} 
                </div>
                `;
            }

        } catch (e) {
            console.warn("There Was An Error In JSON Couldn't Parse.");
        }
    } else {
        console.warn("DID NOT REVEIVE THE REQUEST");
    }
};

xhr.open("get", "main.json");
xhr.send();
