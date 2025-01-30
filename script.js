document.addEventListener("DOMContentLoaded", () => {
  const nhsSelect = document.getElementById("nhsServiceList");
  const privateSelect = document.getElementById("privateServiceList");
  const nhsButton = document.getElementById("addNhsService");
  const privateButton = document.getElementById("addPrivateService");
  const serviceList = document.getElementById("serviceList");

  // Results Elements
  const dailyRevenueEl = document.getElementById("dailyRevenue");
  const weeklyRevenueEl = document.getElementById("weeklyRevenue");
  const monthlyRevenueEl = document.getElementById("monthlyRevenue");
  const yearlyRevenueEl = document.getElementById("yearlyRevenue");
  const dailyTimeEl = document.getElementById("dailyTime");
  const timeForServicesSection = document.querySelector(".time-for-services");

  function toggleEditService(li) {
    const timeDisplay = li.querySelector(".service-time-display");
    const revenueDisplay = li.querySelector(".service-revenue-display");
    const editButton = li.querySelector(".edit-service");
  
    if (editButton.textContent === "Edit") {
      // Switch to editing mode
      const currentTime = li.dataset.time;
      const currentRevenue = li.dataset.revenue;
  
      // Replace time and revenue spans with input fields
      timeDisplay.innerHTML = `<input type="number" class="editable-time form-control" value="${currentTime}" min="0" style="width: 60px;">`;
      revenueDisplay.innerHTML = `<input type="number" class="editable-revenue form-control" value="${currentRevenue}" min="0" style="width: 80px;">`;
  
      // Change button text
      editButton.textContent = "Save";
    } else {
      // Save edits
      const newTime = parseFloat(li.querySelector(".editable-time").value) || 0;
      const newRevenue = parseFloat(li.querySelector(".editable-revenue").value) || 0;
  
      // Update dataset and display
      li.dataset.time = newTime;
      li.dataset.revenue = newRevenue;
      timeDisplay.textContent = newTime;
      revenueDisplay.textContent = newRevenue;
  
      // Change button text
      editButton.textContent = "Edit";
  
      // Update results
      updateResults();
    }
  }
  
  
  // Add NHS service to the list
  nhsButton.addEventListener("click", () => {
    addServiceToList(nhsSelect);
  });

  // Add Private service to the list
  privateButton.addEventListener("click", () => {
    addServiceToList(privateSelect);
  });

  // Function to add a service to the list
  function addServiceToList(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const serviceName = selectedOption.textContent;
    const defaultTime = parseFloat(selectedOption.getAttribute("data-time"));
    const defaultRevenue = parseFloat(selectedOption.getAttribute("data-revenue"));
    const serviceType = selectElement.id === "nhsServiceList" ? "NHS" : "Private"; // Determine service type
  
    if (selectElement.value) {
      const existingService = Array.from(serviceList.children).find(
        (li) => li.dataset.value === selectElement.value
      );
      if (existingService) {
        alert("This service is already in your list!");
        return;
      }
  
      const li = document.createElement("li");
      li.classList.add("list-group-item", "d-flex", "align-items-center", "justify-content-between");
      li.dataset.value = selectElement.value;
      li.dataset.time = defaultTime;
      li.dataset.revenue = defaultRevenue;
  
      li.innerHTML = `
        <div class="service-info">
          <strong>${serviceName}</strong>
          <br>
          <small>(${serviceType})</small>
          <small>Time: <span class="service-time-display">${defaultTime}</span> min, Revenue: £<span class="service-revenue-display">${defaultRevenue}</span></small>
        </div>
        <div class="d-flex align-items-center">
          <input type="number" class="form-control service-count" placeholder="Qty/day" min="0" value="0" style="width: 100px; margin-right: 10px;">
          <button class="btn btn-secondary btn-sm edit-service mr-2">Edit</button>
          <button class="btn btn-danger btn-sm remove-service">Remove</button>
        </div>
      `;
  
      li.querySelector(".edit-service").addEventListener("click", () => {
        toggleEditService(li);
      });
  
      li.querySelector(".remove-service").addEventListener("click", () => {
        li.remove();
        updateResults();
      });
  
      li.querySelector(".service-count").addEventListener("input", () => {
        updateResults();
      });
  
      serviceList.appendChild(li);
      selectElement.value = ""; // Reset dropdown
  
      updateResults(); // Update results after adding
    } else {
      alert("Please select a service first!");
    }
  }
  

// Function to show or hide the "Time for Services" section with a reveal animation
function checkTimeForServices() {
  const timeText = dailyTimeEl.textContent; // Example: "1h 30m"
  const [hours, minutes] = timeText.match(/\d+/g).map(Number); // Extract hours and minutes

  if (hours >= 1) {
    timeForServicesSection.classList.remove("hidden"); // Make the section visible
    timeForServicesSection.classList.add("reveal"); // Add reveal animation
  } else {
    timeForServicesSection.classList.remove("reveal"); // Remove the animation class
    setTimeout(() => {
      timeForServicesSection.classList.add("hidden"); // Add hidden class after animation
    }, 700); // Matches the animation duration
  }
}




  function updateResults() {
    let totalRevenue = 0;
    let totalTime = 0;

    Array.from(serviceList.children).forEach((li) => {
      const qty = parseInt(li.querySelector(".service-count").value) || 0;
      const time = parseFloat(li.dataset.time);
      const revenue = parseFloat(li.dataset.revenue);

      totalRevenue += qty * revenue;
      totalTime += qty * time;
    });

    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;

    dailyRevenueEl.textContent = totalRevenue.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
    weeklyRevenueEl.textContent = (totalRevenue * 7).toLocaleString("en-GB", { style: "currency", currency: "GBP" });
    monthlyRevenueEl.textContent = (totalRevenue * 30).toLocaleString("en-GB", { style: "currency", currency: "GBP" });
    yearlyRevenueEl.textContent = (totalRevenue * 365).toLocaleString("en-GB", { style: "currency", currency: "GBP" });

    dailyTimeEl.textContent = `${hours}h ${minutes}m`;

    // Check if "Time for Services" section should be displayed
    checkTimeForServices();
  }
});


