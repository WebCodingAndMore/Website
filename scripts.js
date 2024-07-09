document.addEventListener("DOMContentLoaded", function () {
  const syllabus = document.getElementById("syllabus");
  const modal = document.getElementById("classModal");
  const span = document.getElementsByClassName("close")[0];

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
            let classDate = new Date(classItem.date + "T00:00:00-05:00"); // Nashville, TN is in CST (UTC-5)
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
    const notesList = classItem.notes
      ? `<ul class="modal-list">${classItem.notes
          .map((note) => `<li>${note}</li>`)
          .join("")}</ul>`
      : "";
    const classDate = new Date(classItem.date + "T00:00:00-05:00"); // Nashville, TN is in CST (UTC-5)

    modalTitle.textContent = classItem.title;
    modalSubtitle.textContent = classItem.subTitle;
    modalBody.innerHTML = `
            <p><strong>Date:</strong> ${classDate.toLocaleDateString("en-US", {
              timeZone: "America/Chicago",
            })}</p>
            <p>${classItem.description}</p>
            <p><strong>Notes:</strong></p>
            ${notesList}
        `;

    // Add target="_blank" to all links in the notes
    const links = modalBody.querySelectorAll(".modal-list a");
    links.forEach((link) => link.setAttribute("target", "_blank"));

    modal.style.display = "block";
  }
});
