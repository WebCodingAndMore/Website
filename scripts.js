document.addEventListener("DOMContentLoaded", function () {
  const syllabus = document.getElementById("syllabus");
  const modal = document.getElementById("classModal");
  const span = document.getElementsByClassName("close")[0];

  function getSecondSunday(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const day = firstDay === 0 ? 8 : 15 - firstDay;
    return new Date(year, month, day);
  }

  function getFirstSunday(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const day = firstDay === 0 ? 1 : 8 - firstDay;
    return new Date(year, month, day);
  }

  function isDaylightSaving(date) {
    const year = date.getFullYear();
    const startDST = getSecondSunday(year, 2); // March
    const endDST = getFirstSunday(year, 10); // November
    return date >= startDST && date < endDST;
  }

  function getAdjustedDate(dateString) {
    const date = new Date(dateString + "T00:00:00");
    const isDST = isDaylightSaving(date);
    const offset = isDST ? "-05:00" : "-06:00";
    return new Date(dateString + "T00:00:00" + offset);
  }

  fetch("syllabus.json")
    .then((response) => response.json())
    .then((data) => {
      data.semesters.forEach((semester) => {
        let semesterSection = document.createElement("section");
        let semesterTitle = document.createElement("h2");
        semesterTitle.textContent = semester.title + " Semester";
        semesterSection.appendChild(semesterTitle);

        let semesterDiv = document.createElement("div");
        semesterDiv.classList.add("semester");

        semester.sections.forEach((section) => {
          let sectionDiv = document.createElement("div");
          sectionDiv.classList.add("section");

          let sectionTitle = document.createElement("h3");
          sectionTitle.textContent = section.title;
          sectionDiv.appendChild(sectionTitle);

          let ul = document.createElement("ul");
          section.classes.forEach((classItem, index) => {
            let li = document.createElement("li");
            let classDate = getAdjustedDate(classItem.date);
            let today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of today
            let dateClass = "date";

            if (classDate < today) {
              dateClass += " past";
            } else if (
              classDate.toDateString() === today.toDateString() ||
              (classDate - today) / (1000 * 60 * 60 * 24) <= 6
            ) {
              dateClass += " near";
            }

            li.innerHTML = `<span class="class-title">Class ${index + 1}: ${
              classItem.title
            }</span><span class="${dateClass}">${classDate.toLocaleDateString(
              "en-US",
              { timeZone: "America/Chicago" }
            )}</span>`;
            li.addEventListener("click", () => {
              showModal(classItem);
            });
            ul.appendChild(li);
          });

          sectionDiv.appendChild(ul);
          semesterDiv.appendChild(sectionDiv);
        });

        semesterSection.appendChild(semesterDiv);
        syllabus.appendChild(semesterSection);
      });
    });

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  function showModal(classItem) {
    const modalTitle = document.getElementById("modal-title");
    const modalSubtitle = document.getElementById("modal-subtitle");
    const modalBody = document.getElementById("modal-body");
    const tipsList =
      classItem.tips && classItem.tips.length > 0
        ? `<ul class="modal-list">${classItem.tips
            .map((note) => `<li>${note}</li>`)
            .join("")}</ul>`
        : "";
    const classDate = getAdjustedDate(classItem.date);

    modalTitle.textContent = classItem.title;
    modalSubtitle.textContent = classItem.subTitle;
    modalBody.innerHTML = `
            <p><strong>Date:</strong> ${classDate.toLocaleDateString("en-US", {
              timeZone: "America/Chicago",
            })}</p>
            <p>${classItem.description}</p>
        `;
    console.log("tipsList", tipsList);
    modalBody.innerHTML =
      tipsList !== ""
        ? modalBody.innerHTML +
          `   
            <p><strong>Tips:</strong></p>
            ${tipsList}`
        : modalBody.innerHTML;
    // Add target="_blank" to all links in the tips
    const links = modalBody.querySelectorAll("a");
    links.forEach((link) => link.setAttribute("target", "_blank"));

    modal.style.display = "block";
  }
});

