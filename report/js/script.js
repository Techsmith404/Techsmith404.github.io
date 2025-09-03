document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const addDiskBtn = document.getElementById('addDiskBtn');
    const diskInputs = document.getElementById('diskInputs');
    const screenshotUpload = document.getElementById('screenshotUpload');
    const screenshotPreview = document.getElementById('screenshotPreview');
    const generatePdfBtn = document.getElementById('generatePdfBtn');

    // Set current date
    const today = new Date();
    const dateString = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    dateInput.value = dateString;

    // Dynamically add disk health inputs
    const addDiskInput = () => {
        const diskDiv = document.createElement('div');
        diskDiv.classList.add('disk-item');
        diskDiv.innerHTML = `
            <button type="button" class="remove-btn">&times;</button>
            <div class="form-field">
                <label>Disk Name</label>
                <input type="text" class="disk-name" placeholder="Disk 1">
            </div>
            <div class="form-field">
                <label>Health</label>
                <select class="disk-health">
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="bad">Bad</option>
                </select>
            </div>
            <div class="form-field">
                <label>Power-On Hours (hours)</label>
                <input type="number" class="disk-hours" placeholder="5000">
            </div>
        `;
        diskInputs.appendChild(diskDiv);

        diskDiv.querySelector('.remove-btn').addEventListener('click', () => {
            diskInputs.removeChild(diskDiv);
        });
    };

    addDiskBtn.addEventListener('click', addDiskInput);
    addDiskInput(); // Add initial disk input

    // Handle screenshot uploads and previews
    screenshotUpload.addEventListener('change', (event) => {
        screenshotPreview.innerHTML = ''; // Clear previous previews
        const files = event.target.files;
        if (files) {
            for (const file of files) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    screenshotPreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // Generate PDF using jsPDF
    generatePdfBtn.addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let yPos = 20;
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - 2 * margin;

        const addSectionTitle = (title) => {
            doc.setFontSize(22);
            doc.text(title, margin, yPos);
            yPos += 10;
        };

        const addSectionContent = (label, value) => {
            doc.setFontSize(12);
            doc.text(`${label}: ${value || 'N/A'}`, margin, yPos);
            yPos += 7;
        };

        const addCommentBlock = (title, comment) => {
            if (comment) {
                doc.setFontSize(12);
                doc.text(title, margin, yPos);
                yPos += 5;
                const lines = doc.splitTextToSize(comment, contentWidth - 20);
                doc.text(lines, margin + 5, yPos);
                yPos += lines.length * 6 + 5;
            }
        };

        // --- Header and General Info ---
        doc.setFontSize(30);
        doc.text("TechSmith404 Health Check Report", pageWidth / 2, yPos, { align: "center" });
        yPos += 15;
        doc.setFontSize(12);
        const clientName = document.getElementById('clientName').value || 'N/A';
        const machineName = document.getElementById('machineName').value || 'N/A';
        const date = document.getElementById('date').value;
        doc.text(`Client: ${clientName} • Machine: ${machineName} • Date: ${date}`, pageWidth / 2, yPos, { align: "center" });
        yPos += 20;

        // --- Startup Time ---
        addSectionTitle("Startup Time");
        addSectionContent("Fully Started", `${document.getElementById('fullStartupTime').value} seconds`);
        addSectionContent("Desktop Shown", `${document.getElementById('desktopTime').value} seconds`);
        addSectionContent("Longest Process", document.getElementById('longestProcess').value);
        addCommentBlock("Recommendations & Notes:", document.getElementById('startupComments').value);
        yPos += 5;

        // --- Disk Health ---
        addSectionTitle("Disk Health");
        const disks = Array.from(document.querySelectorAll('.disk-item')).map(item => ({
            name: item.querySelector('.disk-name').value,
            health: item.querySelector('.disk-health').value,
            hours: item.querySelector('.disk-hours').value
        }));
        disks.forEach(disk => {
            addSectionContent(`Disk: ${disk.name}`, '');
            doc.setFontSize(10);
            doc.text(`Health: ${disk.health.toUpperCase()}`, margin + 5, yPos);
            yPos += 5;
            doc.text(`Power-On Hours: ${disk.hours || 'N/A'} hours`, margin + 5, yPos);
            yPos += 7;
        });
        addCommentBlock("Recommendations & Notes:", document.getElementById('diskComments').value);
        yPos += 5;

        // --- CPU Benchmark ---
        addSectionTitle("CPU Benchmark (Cinebench)");
        addSectionContent("Score", document.getElementById('cinebenchScore').value);
        addSectionContent("Idle Temp", `${document.getElementById('cpuTemp').value} °C`);
        addSectionContent("Load Temp", `${document.getElementById('cpuLoadTemp').value} °C`);
        addCommentBlock("Recommendations & Notes:", document.getElementById('cpuComments').value);
        yPos += 5;

        // --- GPU Benchmark ---
        addSectionTitle("GPU Benchmark (Furmark)");
        addSectionContent("Score", document.getElementById('furmarkScore').value);
        addSectionContent("Idle Temp", `${document.getElementById('gpuTemp').value} °C`);
        addSectionContent("Load Temp", `${document.getElementById('gpuLoadTemp').value} °C`);
        addCommentBlock("Recommendations & Notes:", document.getElementById('gpuComments').value);
        yPos += 5;

        // --- Screenshots ---
        const screenshots = Array.from(document.querySelectorAll('#screenshotPreview img'));
        if (screenshots.length > 0) {
            addSectionTitle("Proof of Work (Screenshots)");
            let xPos = margin;
            const imgWidth = contentWidth / 2 - 5;
            const imgHeight = imgWidth * 0.75; // Maintain aspect ratio
            const rowSpacing = 5;

            for (let i = 0; i < screenshots.length; i++) {
                const img = screenshots[i];
                if (yPos + imgHeight > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage();
                    yPos = margin;
                }
                
                try {
                    const imageData = await new Promise((resolve) => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        resolve(canvas.toDataURL('image/jpeg', 0.8));
                    });
                    doc.addImage(imageData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
                } catch (e) {
                    console.error("Failed to add image to PDF:", e);
                }
                
                if (xPos === margin) {
                    xPos = margin + imgWidth + 10;
                } else {
                    xPos = margin;
                    yPos += imgHeight + rowSpacing;
                }
            }
            if (xPos !== margin) {
                yPos += imgHeight + rowSpacing;
            }
            addCommentBlock("General Comments:", document.getElementById('screenshotComments').value);
        }

        doc.save(`Health_Check_Report_${machineName}.pdf`);
    });
});

