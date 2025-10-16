document.getElementById('templateSelect').addEventListener('change', function() {
    const selectedTemplate = this.value;
    updateTemplate(selectedTemplate);
});

document.getElementById('resumeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const resumeData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        jobTitle: document.getElementById('jobTitle').value,
        company: document.getElementById('company').value,
        years: document.getElementById('years').value,
        degree: document.getElementById('degree').value,
        school: document.getElementById('school').value,
        skills: document.getElementById('skills').value,
        phone: document.getElementById('phone').value
    };

    displayResumePreview(resumeData);
});

function updateTemplate(templateName) {
    const resumePreview = document.getElementById('resumePreview');
    resumePreview.className = ''; // Remove previous class
    resumePreview.classList.add(`${templateName}-template`);
}

function displayResumePreview(resumeData) {
    const resumePreview = document.getElementById('resumePreview');
    resumePreview.style.display = 'block';

    resumePreview.innerHTML = `
        <h2>${resumeData.name}</h2>
        <p>Email: ${resumeData.email}</p>
        <p>Phone: ${resumeData.phone}</p>
        <h3>Work Experience</h3>
        <p>Title: ${resumeData.jobTitle} at ${resumeData.company} for ${resumeData.years} years</p>
        <h3>Education</h3>
        <p>Degree: ${resumeData.degree} from ${resumeData.school}</p>
        <h3>Skills</h3>
        <p>${resumeData.skills}</p>
    `;
}

// File import for JSON (for simplicity, we are not handling CSV here)
document.getElementById('importFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const importedData = JSON.parse(e.target.result);
        // Assuming the JSON has the same structure as the form
        document.getElementById('name').value = importedData.name;
        document.getElementById('email').value = importedData.email;
        document.getElementById('jobTitle').value = importedData.jobTitle;
        document.getElementById('company').value = importedData.company;
        document.getElementById('years').value = importedData.years;
        document.getElementById('degree').value = importedData.degree;
        document.getElementById('school').value = importedData.school;
        document.getElementById('skills').value = importedData.skills;
        document.getElementById('phone').value = importedData.phone;
    };

    reader.readAsText(file);
});
