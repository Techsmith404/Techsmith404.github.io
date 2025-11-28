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

    // Generate PDF
    generatePdfBtn.addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let yPos = 20;
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - 2 * margin;
        const lineHeight = 7;
        const sectionSpacing = 15;
        const contentSpacing = 8;

        // Colors
        const mainColor = '#0066cc';     // TechSmith Blue
        const accentColor = '#00ff9d';   // TechSmith Green
        const titleColor = '#ffffff';
        const barColorBefore = '#999999';
        const barColorAfter = '#0066cc';

        // --- Helper Functions ---

        const checkPageBreak = (neededSpace) => {
            if (yPos + neededSpace > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                yPos = margin;
            }
        };

        const addSectionTitle = (title) => {
            checkPageBreak(20);
            doc.setFillColor(mainColor);
            doc.rect(0, yPos, pageWidth, 10, 'F');
            doc.setFontSize(14);
            doc.setTextColor(titleColor);
            doc.setFont(undefined, 'bold');
            doc.text(title, margin, yPos + 7);
            doc.setTextColor('#000000');
            doc.setFont(undefined, 'normal');
            yPos += 18;
        };

        const addTextRow = (label, value) => {
            checkPageBreak(15);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text(`${label}:`, margin, yPos);
            doc.setFont(undefined, 'normal');
            const textLines = doc.splitTextToSize(value || 'N/A', contentWidth - 50);
            doc.text(textLines, margin + 50, yPos);
            yPos += (textLines.length * lineHeight);
        };

        const addCommentBlock = (title, comment) => {
            if (comment) {
                checkPageBreak(30);
                yPos += 5;
                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(mainColor);
                doc.text(title, margin, yPos);
                yPos += lineHeight;
                doc.setTextColor('#000000');
                doc.setFont(undefined, 'normal');
                const lines = doc.splitTextToSize(comment, contentWidth);
                doc.text(lines, margin + 5, yPos);
                yPos += lines.length * lineHeight + contentSpacing;
            }
        };

        // Visual Comparison Bar Chart
        const addComparisonChart = (label, before, after, unit, lowerIsBetter = true) => {
            const bVal = parseFloat(before);
            const aVal = parseFloat(after);

            // Skip if invalid
            if (isNaN(bVal)) return;

            checkPageBreak(35); // Space for label + 2 bars

            // 1. Text Line
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text(label, margin, yPos);
            
            // Calculate Improvement
            let text = `${bVal} ${unit}`;
            let improvement = 0;
            let isImproved = false;

            if (!isNaN(aVal)) {
                if (lowerIsBetter) {
                    improvement = ((bVal - aVal) / bVal) * 100;
                    isImproved = aVal < bVal;
                } else {
                    improvement = ((aVal - bVal) / bVal) * 100;
                    isImproved = aVal > bVal;
                }
                
                const sign = improvement > 0 ? '-' : '+'; // For time, - is good. For score, + is good.
                // Actually just show generic % diff
                const arrow = isImproved ? '▼' : '▲'; 
                const displayImp = Math.abs(improvement).toFixed(1);
                
                let impText = "";
                if (lowerIsBetter) {
                     // Lower is better (Time/Temp)
                     if (isImproved) impText = `(Improved by ${displayImp}%)`;
                     else impText = `(Slower/Hotter by ${displayImp}%)`;
                } else {
                    // Higher is better (Score)
                    if (isImproved) impText = `(Improved by ${displayImp}%)`;
                    else impText = `(Decreased by ${displayImp}%)`;
                }

                text += `  ➜  ${aVal} ${unit}  ${impText}`;
            }

            doc.setFont(undefined, 'normal');
            doc.text(text, margin + 60, yPos);
            yPos += 8;

            // 2. Draw Bars
            const maxVal = Math.max(bVal, isNaN(aVal) ? 0 : aVal) * 1.1; // 10% buffer
            const chartWidth = 120; // Max width of bar in mm
            const barHeight = 6;

            // Before Bar
            const bWidth = (bVal / maxVal) * chartWidth;
            doc.setFillColor(barColorBefore);
            doc.rect(margin, yPos, bWidth, barHeight, 'F');
            doc.setFontSize(8);
            doc.setTextColor('#555');
            doc.text("Before", margin + bWidth + 2, yPos + 4);
            yPos += barHeight + 2;

            // After Bar (only if exists)
            if (!isNaN(aVal)) {
                const aWidth = (aVal / maxVal) * chartWidth;
                doc.setFillColor(barColorAfter);
                doc.rect(margin, yPos, aWidth, barHeight, 'F');
                doc.text("After", margin + aWidth + 2, yPos + 4);
                yPos += barHeight + 5;
            } else {
                yPos += 5; // Spacing if no second bar
            }
            
            doc.setTextColor('#000000');
        };

        // --- Header ---
        doc.setFillColor(mainColor);
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        // Logo/Brand
        doc.setFontSize(22);
        doc.setTextColor(titleColor);
        doc.setFont(undefined, 'bold');
        doc.text("TechSmith404", margin, 15);
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        doc.text("Optimization & Health Report", margin, 25);

        // Client Info (Right aligned in header)
        doc.setFontSize(10);
        const clientName = document.getElementById('clientName').value || 'Client';
        const machineName = document.getElementById('machineName').value || 'Machine';
        const date = document.getElementById('date').value;
        
        doc.text(`Date: ${date}`, pageWidth - margin, 15, { align: 'right' });
        doc.text(`Client: ${clientName}`, pageWidth - margin, 20, { align: 'right' });
        doc.text(`Machine: ${machineName}`, pageWidth - margin, 25, { align: 'right' });

        yPos = 50;
        doc.setTextColor('#000000');

        // --- Executive Summary (New) ---
        // Auto-generate a summary if "After" values exist
        let hasAfterValues = false;
        const inputsToCheck = ['fullStartupTimeAfter', 'cinebenchScoreAfter', 'furmarkScoreAfter'];
        inputsToCheck.forEach(id => {
            if (document.getElementById(id).value) hasAfterValues = true;
        });

        if (hasAfterValues) {
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text("Executive Summary", margin, yPos);
            yPos += 7;
            doc.setFont(undefined, 'normal');
            doc.setFontSize(11);
            doc.text("The optimization procedures performed on this machine have resulted in the improvements detailed below. The system has been tuned for better performance, lower temperatures, and faster startup times.", margin, yPos, { maxWidth: contentWidth });
            yPos += 15;
        }

        // --- Sections ---
        
        // 1. Startup Time
        addSectionTitle("Startup & Boot Performance");
        addComparisonChart("Fully Started", 
            document.getElementById('fullStartupTimeBefore').value, 
            document.getElementById('fullStartupTimeAfter').value, 
            "s", true); // Lower is better
        
        addComparisonChart("Desktop Shown", 
            document.getElementById('desktopTimeBefore').value, 
            document.getElementById('desktopTimeAfter').value, 
            "s", true);

        addTextRow("Longest Process", document.getElementById('longestProcess').value);
        addCommentBlock("Analyst Notes", document.getElementById('startupComments').value);


        // 2. Disk Health
        addSectionTitle("Disk Health Status");
        const disks = Array.from(document.querySelectorAll('.disk-item')).map(item => ({
            name: item.querySelector('.disk-name').value,
            health: item.querySelector('.disk-health').value,
            hours: item.querySelector('.disk-hours').value
        }));
        
        if (disks.length === 0) {
            doc.text("No disk data recorded.", margin, yPos);
            yPos += 10;
        } else {
            disks.forEach(disk => {
                checkPageBreak(20);
                let healthColor = '#009900'; // Green
                if (disk.health === 'fair') healthColor = '#cc9900'; // Orange
                if (disk.health === 'bad') healthColor = '#cc0000'; // Red

                doc.setFont(undefined, 'bold');
                doc.text(`Disk: ${disk.name}`, margin, yPos);
                
                doc.setFont(undefined, 'normal');
                doc.setTextColor(healthColor);
                doc.text(`Health: ${disk.health.toUpperCase()}`, margin + 60, yPos);
                doc.setTextColor('#000000');
                
                yPos += 6;
                doc.text(`Power-On Hours: ${disk.hours || 'N/A'} hours`, margin, yPos);
                yPos += 10;
            });
        }
        addCommentBlock("Analyst Notes", document.getElementById('diskComments').value);


        // 3. CPU Benchmarks
        addSectionTitle("CPU Performance (Cinebench)");
        addComparisonChart("Multi-Core Score", 
            document.getElementById('cinebenchScoreBefore').value, 
            document.getElementById('cinebenchScoreAfter').value, 
            "pts", false); // Higher is better

        addComparisonChart("Idle Temp", 
            document.getElementById('cpuTempBefore').value, 
            document.getElementById('cpuTempAfter').value, 
            "°C", true);

        addComparisonChart("Load Temp", 
            document.getElementById('cpuLoadTempBefore').value, 
            document.getElementById('cpuLoadTempAfter').value, 
            "°C", true);
        
        addCommentBlock("Analyst Notes", document.getElementById('cpuComments').value);


        // 4. GPU Benchmarks
        addSectionTitle("GPU Performance (Furmark)");
        addComparisonChart("Benchmark Score", 
            document.getElementById('furmarkScoreBefore').value, 
            document.getElementById('furmarkScoreAfter').value, 
            "pts", false); // Higher is better

        addComparisonChart("Idle Temp", 
            document.getElementById('gpuTempBefore').value, 
            document.getElementById('gpuTempAfter').value, 
            "°C", true);

        addComparisonChart("Load Temp", 
            document.getElementById('gpuLoadTempBefore').value, 
            document.getElementById('gpuLoadTempAfter').value, 
            "°C", true);
            
        addCommentBlock("Analyst Notes", document.getElementById('gpuComments').value);


        // 5. Screenshots
        addSectionTitle("Visual Proof of Work");
        const screenshots = Array.from(document.querySelectorAll('#screenshotPreview img'));
        if (screenshots.length > 0) {
            let xPos = margin;
            const imgWidth = contentWidth / 2 - 5;
            const imgHeight = imgWidth * 0.5625; // 16:9 aspect ratio roughly
            const colSpacing = 10;
            const rowSpacing = 10;
            const imagesPerRow = 2;

            for (let i = 0; i < screenshots.length; i++) {
                if (i > 0 && (i % imagesPerRow === 0)) {
                    xPos = margin;
                    yPos += imgHeight + rowSpacing;
                }
                checkPageBreak(imgHeight + rowSpacing);

                try {
                    const img = screenshots[i];
                    const imageData = await new Promise((resolve) => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        resolve(canvas.toDataURL('image/jpeg', 0.8));
                    });
                    
                    doc.addImage(imageData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
                    xPos += imgWidth + colSpacing;
                } catch (e) {
                    console.error("Failed to add image to PDF:", e);
                }
            }
            yPos += imgHeight + rowSpacing;
        } else {
            doc.text("No screenshots attached.", margin, yPos);
            yPos += 10;
        }
        addCommentBlock("General Comments", document.getElementById('screenshotComments').value);


        // Footer
        const pageCount = doc.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor('#999999');
            doc.text(`Generated by TechSmith404 - Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }

        // Save PDF
        const formattedClientName = clientName.replace(/\s+/g, '_');
        const formattedMachineName = machineName.replace(/\s+/g, '_');
        const formattedDate = date.replace(/\//g, '-');
        const filename = `${formattedClientName}_${formattedMachineName}_${formattedDate}_Optimization_Report.pdf`;

        doc.save(filename);
    });
});