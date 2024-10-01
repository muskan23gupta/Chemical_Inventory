document.addEventListener("DOMContentLoaded", function() {
    let selectedRow = null;
    let chemicalsData = JSON.parse(localStorage.getItem("chemicalsData")) || [...chemicals];
  
    const tableBody = document.querySelector("#chemicalTable tbody");
   
    //RENDER FUNCTION
    function renderTable(data) {
      tableBody.innerHTML = ""; 
      data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.id}</td>
          <td contenteditable="true">${item.name}</td>
          <td contenteditable="true">${item.vendor}</td>
          <td contenteditable="true">${item.density}</td>
          <td contenteditable="true">${item.viscosity}</td>
          <td contenteditable="true">${item.packaging}</td>
          <td contenteditable="true">${item.packSize}</td>
          <td contenteditable="true">${item.unit}</td>
          <td contenteditable="true">${item.quantity}</td>
        `;
        row.addEventListener('click', () => selectRow(index));
    
        Array.from(row.children).forEach((cell, cellIndex) => {
            if (cellIndex > 0) { // Skip ID column (index 0)
                cell.addEventListener('input', () => {
                    const columnMap = ["id", "name", "vendor", "density", "viscosity", "packaging", "packSize", "unit", "quantity"];
                    chemicalsData[index][columnMap[cellIndex]] = cell.innerText;
                    saveToLocalStorage();
                });
            }
        });

        tableBody.appendChild(row);
      });
    }
     //Function to save data to local storage
    function saveToLocalStorage() {
        localStorage.setItem("chemicalsData", JSON.stringify(chemicalsData));
    }
  
    function selectRow(index) {
      selectedRow = index;
      Array.from(tableBody.children).forEach((row, idx) => {
        row.style.backgroundColor = idx === index ? '#d3d3d3' : '';
      });
    }
  
    function sortTable(column, asc = true) {
      chemicalsData.sort((a, b) => {
        const valA = a[column];
        const valB = b[column];
        return asc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
      console.log("Sorted by", column, "in", asc ? "ascending" : "descending", "order");
      renderTable(chemicalsData);
    }
  
    // Addition of Row
    document.getElementById("addRow").addEventListener("click", () => {
      const newRow = { id: chemicalsData.length + 1, name: "", vendor: "", density: 0, viscosity: 0, packaging: "", packSize: "", unit: "", quantity: 0 };
      chemicalsData.push(newRow);
      renderTable(chemicalsData);
      saveToLocalStorage();
    });
  
    // Deletion of selected Row
    document.getElementById("deleteRow").addEventListener("click", () => {
      if (selectedRow !== null) {
        chemicalsData.splice(selectedRow, 1); 
        renderTable(chemicalsData); 
        saveToLocalStorage();
        selectedRow = null; 
      }
      else{
        alert("Please select a row to delete.");
      }
    });
  
    // Move row up
    document.getElementById("moveUp").addEventListener("click", () => {
      if (selectedRow > 0) {
        [chemicalsData[selectedRow], chemicalsData[selectedRow - 1]] = [chemicalsData[selectedRow - 1], chemicalsData[selectedRow]];
        selectedRow--; 
        renderTable(chemicalsData); 
        saveToLocalStorage();
      }
    });
  
    // Move row down
    document.getElementById("moveDown").addEventListener("click", () => {
      if (selectedRow < chemicalsData.length - 1) {
        [chemicalsData[selectedRow], chemicalsData[selectedRow + 1]] = [chemicalsData[selectedRow + 1], chemicalsData[selectedRow]];
        selectedRow++; 
        renderTable(chemicalsData); 
        saveToLocalStorage();
      }
    });
  
    //Refresh 
    document.getElementById("refresh").addEventListener("click", () => {
        if (confirm("Are you sure you want to refresh the data? Any unsaved changes will be lost.")) {
           chemicalsData = [...chemicals]; 
            renderTable(chemicalsData);
            selectedRow = null; 
           // saveToLocalStorage();
        }
    });
  
    document.getElementById("save").addEventListener("click", () => {
        localStorage.setItem("chemicalsData", JSON.stringify(chemicalsData));
        alert("Data has been saved!");
        //console.log("Saved Data:", chemicalsData
    });
  
    // Sorting
    document.querySelectorAll("th").forEach((header, index) => {
      let ascending = true;
      header.addEventListener("click", () => {
        const columnMap = ["id", "name", "vendor", "density", "viscosity", "packaging", "packSize", "unit", "quantity"];
        sortTable(columnMap[index], ascending); 
        ascending = !ascending; 
      });
    });

    renderTable(chemicalsData);
  });


  
 