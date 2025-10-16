// --- Simulated Template API ---
// In a real application, this could be a fetch call to a backend service.
const templatesAPI = {
    classic: `
        <h2>{{name}}</h2>
        <p>Email: {{email}} | Phone: {{phone}}</p>
        <hr>
        <h3>Work Experience</h3>
        <p><strong>{{jobTitle}}</strong> at {{company}} ({{years}} years)</p>
        <h3>Education</h3>
        <p>{{degree}} from {{school}}</p>
        <h3>Skills</h3>
        <p>{{skills}}</p>
    `,
    modern: `
        <div style="text-align: center; background-color: #005A9E; color: white; padding: 2rem;">
            <h1>{{name}}</h1>
            <p>{{jobTitle}}</p>
        </div>
        <div style="padding: 1rem;">
             <h3>Contact</h3>
             <p>{{email}} | {{phone}}</p>
             <h3>Experience</h3>
             <p><strong>{{company}}</strong> — {{years}} years</p>
             <h3>Education</h3>
             <p><strong>{{school}}</strong> — {{degree}}</p>
             <h3>Key Skills</h3>
             <p>{{skills}}</p>
        </div>
    `,
    professional: `
        <div style="border-bottom: 2px solid #333; padding-bottom: 1rem; margin-bottom: 1rem;">
            <h1 style="text-align: right; margin: 0;">{{name}}</h1>
            <p style="text-align: right; margin: 0;">{{email}} | {{phone}}</p>
        </div>
        <h3>PROFESSIONAL EXPERIENCE</h3>
        <p><strong>{{jobTitle}}</strong>, {{company}}, {{years}} years</p>
        <h3>EDUCATION</h3>
        <p><strong>{{degree}}</strong>, {{school}}</p>
        <h3>TECHNICAL SKILLS</h3>
        <p>{{skills}}</p>
    `
};


document.getElementById('templateSelect').addEventListener('change', function() {
    // This can still be used to apply a root class for font or other base styles
    const selectedTemplate = this.value;
    updateTemplate(selectedTemplate);
});

document.getElementById('resumeForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const resumeData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        jobTitle: document.getElementById('jobTitle').value,
        company: document.getElementById('company').value,
        years: document.getElementById('years').value,
        degree: document.getElementById('degree').value,
        school: document.getElementById('school').value,
        skills: document.getElementById('skills').value
    };

    // 1. Display the preview
    displayResumePreview(resumeData);

    // 2. Generate and download PDF
    // We use a small delay to ensure the DOM has updated before capturing
    setTimeout(generatePdf, 100);
});

function updateTemplate(templateName) {
    const resumePreview = document.getElementById('resumePreview');
    resumePreview.className = ''; // Remove previous classes
    resumePreview.classList.add(`${templateName}-template`);
}

function displayResumePreview(resumeData) {
    const resumePreview = document.getElementById('resumePreview');
    const selectedTemplateKey = document.getElementById('templateSelect').value;

    // Get the template from our simulated API
    let templateHtml = templatesAPI[selectedTemplateKey] || templatesAPI.classic;

    // Replace placeholders with actual data
    for (const key in resumeData) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        templateHtml = templateHtml.replace(regex, resumeData[key] || '');
    }
    
    // Update the preview element and apply the correct class
    resumePreview.innerHTML = templateHtml;
    updateTemplate(selectedTemplateKey);
}

function generatePdf() {
    const { jsPDF } = window.jspdf;
    const resumePreview = document.getElementById('resumePreview');
    const resumeName = document.getElementById('name').value || 'resume';
    
    // Use html2canvas to capture the preview div as an image
    html2canvas(resumePreview, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate dimensions for the PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasHeight / canvasWidth;
        const newHeight = pdfWidth * ratio;
        
        let height = newHeight > pdfHeight ? pdfHeight : newHeight;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, height);
        pdf.save(`${resumeName.replace(/\s/g, '_')}.pdf`);
    });
}

// File import logic (unchanged from original)
document.getElementById('importFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            // Populate the form with imported data
            for (const key in importedData) {
                if (document.getElementById(key)) {
                    document.getElementById(key).value = importedData[key];
                }
            }
        } catch (error) {
            alert('Error parsing JSON file. Please ensure it is correctly formatted.');
        }
    };

    reader.readAsText(file);
});
