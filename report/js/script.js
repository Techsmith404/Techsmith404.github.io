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

    // Generate PDF using jsPDF with improved logic
    generatePdfBtn.addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let yPos = 20;
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - 2 * margin;
        const lineHeight = 7;
        const sectionSpacing = 15;
        const contentSpacing = 8; // Added space between content items

        const mainColor = '#0066cc';
        const titleColor = '#ffffff';

        // Helper to add a page and reset yPos if content won't fit
        const checkPageBreak = (neededSpace) => {
            if (yPos + neededSpace > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                yPos = margin;
            }
        };

        const addSectionTitle = (title) => {
            doc.setFillColor(mainColor);
            doc.rect(0, yPos, pageWidth, 10, 'F');
            doc.setFontSize(14);
            doc.setTextColor(titleColor);
            doc.text(title, margin, yPos + 7);
            doc.setTextColor('#000000');
            doc.setFont(undefined, 'normal');
            yPos += 15;
        };

        const addSectionContent = (label, value) => {
            const labelText = `${label}: `;
            const textLines = doc.splitTextToSize(value || 'N/A', contentWidth - doc.getTextWidth(labelText));
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(labelText, margin, yPos);
            doc.setFont(undefined, 'normal');
            doc.text(textLines, margin + doc.getTextWidth(labelText), yPos);
            yPos += textLines.length * lineHeight + contentSpacing;
        };
        
        const addCommentBlock = (title, comment) => {
            if (comment) {
                const lines = doc.splitTextToSize(comment, contentWidth);
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text(title, margin, yPos);
                yPos += lineHeight;
                doc.setFont(undefined, 'normal');
                doc.text(lines, margin, yPos);
                yPos += lines.length * lineHeight + contentSpacing;
            }
        };

        // --- Header and General Info ---
        doc.setFillColor(mainColor);
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setFontSize(28);
        doc.setTextColor(titleColor);
        doc.text("Health Check Report", pageWidth / 2, 15, { align: "center" });
        doc.setFontSize(10);
        const clientName = document.getElementById('clientName').value || 'N/A';
        const machineName = document.getElementById('machineName').value || 'N/A';
        const date = document.getElementById('date').value;
        doc.text(`Client: ${clientName} | Machine: ${machineName} | Date: ${date}`, pageWidth / 2, 25, { align: "center" });
        yPos = 40;
        doc.setTextColor('#000000');
        doc.setFont(undefined, 'normal');

        // --- All Section Logic in a single, well-defined flow ---
        const sections = [
            {
                title: "Startup Time",
                content: () => {
                    addSectionContent("Fully Started", `${document.getElementById('fullStartupTime').value} seconds`);
                    addSectionContent("Desktop Shown", `${document.getElementById('desktopTime').value} seconds`);
                    addSectionContent("Longest Process", document.getElementById('longestProcess').value);
                    addCommentBlock("Recommendations & Notes:", document.getElementById('startupComments').value);
                },
                getEstimatedHeight: () => {
                    let height = sectionSpacing + (3 * lineHeight) + (3 * contentSpacing); // Title, 3 lines, 3 spacings
                    const comments = document.getElementById('startupComments').value;
                    if (comments) {
                        const lines = doc.splitTextToSize(comments, contentWidth);
                        height += lineHeight + (lines.length * lineHeight) + contentSpacing;
                    }
                    return height;
                }
            },
            {
                title: "Disk Health",
                content: () => {
                    const disks = Array.from(document.querySelectorAll('.disk-item')).map(item => ({
                        name: item.querySelector('.disk-name').value,
                        health: item.querySelector('.disk-health').value,
                        hours: item.querySelector('.disk-hours').value
                    }));
                    disks.forEach(disk => {
                        const diskContent = `Health: ${disk.health.toUpperCase()}\nPower-On Hours: ${disk.hours || 'N/A'} hours`;
                        addSectionContent(`Disk: ${disk.name}`, diskContent);
                    });
                    addCommentBlock("Recommendations & Notes:", document.getElementById('diskComments').value);
                },
                getEstimatedHeight: () => {
                    const diskCount = document.querySelectorAll('.disk-item').length;
                    let height = sectionSpacing + (diskCount * 2 * lineHeight) + (diskCount * contentSpacing);
                    const comments = document.getElementById('diskComments').value;
                    if (comments) {
                        const lines = doc.splitTextToSize(comments, contentWidth);
                        height += lineHeight + (lines.length * lineHeight) + contentSpacing;
                    }
                    return height;
                }
            },
            {
                title: "CPU Benchmark (Cinebench)",
                content: () => {
                    addSectionContent("Score", document.getElementById('cinebenchScore').value);
                    addSectionContent("Idle Temp", `${document.getElementById('cpuTemp').value} °C`);
                    addSectionContent("Load Temp", `${document.getElementById('cpuLoadTemp').value} °C`);
                    addCommentBlock("Recommendations & Notes:", document.getElementById('cpuComments').value);
                },
                getEstimatedHeight: () => {
                    let height = sectionSpacing + (3 * lineHeight) + (3 * contentSpacing);
                    const comments = document.getElementById('cpuComments').value;
                    if (comments) {
                        const lines = doc.splitTextToSize(comments, contentWidth);
                        height += lineHeight + (lines.length * lineHeight) + contentSpacing;
                    }
                    return height;
                }
            },
            {
                title: "GPU Benchmark (Furmark)",
                content: () => {
                    addSectionContent("Score", document.getElementById('furmarkScore').value);
                    addSectionContent("Idle Temp", `${document.getElementById('gpuTemp').value} °C`);
                    addSectionContent("Load Temp", `${document.getElementById('gpuLoadTemp').value} °C`);
                    addCommentBlock("Recommendations & Notes:", document.getElementById('gpuComments').value);
                },
                getEstimatedHeight: () => {
                    let height = sectionSpacing + (3 * lineHeight) + (3 * contentSpacing);
                    const comments = document.getElementById('gpuComments').value;
                    if (comments) {
                        const lines = doc.splitTextToSize(comments, contentWidth);
                        height += lineHeight + (lines.length * lineHeight) + contentSpacing;
                    }
                    return height;
                }
            },
            {
                title: "Proof of Work (Screenshots)",
                content: async () => {
                    const screenshots = Array.from(document.querySelectorAll('#screenshotPreview img'));
                    if (screenshots.length > 0) {
                        let xPos = margin;
                        const imgWidth = contentWidth / 2 - 5;
                        const imgHeight = imgWidth * 0.5625;
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
                    }
                    addCommentBlock("General Comments:", document.getElementById('screenshotComments').value);
                },
                getEstimatedHeight: () => {
                    const screenshotCount = document.querySelectorAll('#screenshotPreview img').length;
                    if (screenshotCount === 0) return sectionSpacing + lineHeight;
                    const imgWidth = contentWidth / 2 - 5;
                    const imgHeight = imgWidth * 0.5625;
                    const rows = Math.ceil(screenshotCount / 2);
                    let height = sectionSpacing + (rows * (imgHeight + 10)) + contentSpacing;
                    const comments = document.getElementById('screenshotComments').value;
                    if (comments) {
                        const lines = doc.splitTextToSize(comments, contentWidth);
                        height += lineHeight + (lines.length * lineHeight) + contentSpacing;
                    }
                    return height;
                }
            }
        ];

        // Process each section as a block
        for (const section of sections) {
            const neededHeight = section.getEstimatedHeight();
            checkPageBreak(neededHeight);
            addSectionTitle(section.title);
            if (section.content.constructor.name === 'AsyncFunction') {
                await section.content();
            } else {
                section.content();
            }
            yPos += sectionSpacing;
        }

        const formattedClientName = clientName.replace(/\s+/g, '_');
        const formattedMachineName = machineName.replace(/\s+/g, '_');
        const formattedDate = date.replace(/\//g, '-');
        const filename = `${formattedClientName}_${formattedMachineName}_${formattedDate}_Report.pdf`;

        doc.save(filename);
    });
});

