document.addEventListener('DOMContentLoaded', function() {
    const syllabus = document.getElementById('syllabus');
    const modal = document.getElementById('classModal');
    const span = document.getElementsByClassName('close')[0];

    fetch('syllabus.json')
        .then(response => response.json())
        .then(data => {
            data.semesters.forEach(semester => {
                let semesterSection = document.createElement('section');
                let semesterTitle = document.createElement('h2');
                semesterTitle.textContent = semester.title + ' Semester';
                semesterSection.appendChild(semesterTitle);

                let semesterDiv = document.createElement('div');
                semesterDiv.classList.add('semester');

                semester.sections.forEach(section => {
                    let sectionDiv = document.createElement('div');
                    sectionDiv.classList.add('section');

                    let sectionTitle = document.createElement('h3');
                    sectionTitle.textContent = section.title;
                    sectionDiv.appendChild(sectionTitle);

                    let ul = document.createElement('ul');
                    section.classes.forEach((classItem, index) => {
                        let li = document.createElement('li');
                        li.innerHTML = `<span class="class-title">Class ${index + 1}: ${classItem.title}</span><span class="date">${classItem.date}</span>`;
                        li.addEventListener('click', () => {
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

    span.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    function showModal(classItem) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>${classItem.title}</h2>
            <p><strong>Date:</strong> ${classItem.date}</p>
            <p><strong>Subtitle:</strong> ${classItem.subTitle}</p>
            <p><strong>Description:</strong> ${classItem.description}</p>
        `;
        modal.style.display = 'block';
    }
});
