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

    // Toggle Overclocking Section
    const ocToggle = document.getElementById('ocToggle');
    const ocSection = document.getElementById('ocSection');
    ocToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            ocSection.classList.remove('hidden');
        } else {
            ocSection.classList.add('hidden');
        }
    });

    // Handle screenshot uploads and previews
    const dropZone = document.getElementById('dropZone');

    const handleFiles = (files) => {
        if (files) {
            for (const file of files) {
                if (!file.type.startsWith('image/')) continue;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('screenshot-item');

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;

                    const removeBtn = document.createElement('button');
                    removeBtn.classList.add('remove-screenshot-btn');
                    removeBtn.innerHTML = '&times;';
                    removeBtn.addEventListener('click', () => {
                        imgContainer.remove();
                    });

                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeBtn);
                    screenshotPreview.appendChild(imgContainer);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    // File Input Change
    screenshotUpload.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });

    // Drag & Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-over');
    }

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    // --- Data Retrieval Functions ---

    const getExampleData = () => {
        return {
            clientName: "Testy McTesterson",
            machineName: "TestBox",
            date: document.getElementById('date').value,
            
            bootBefore: 45,
            bootAfter: 18,
            desktopBefore: 30,
            desktopAfter: 12,
            longestProcess: "Steam Client Service - 8s",
            startupComments: "Disabled high-impact startup apps (Steam, Spotify, Discord). Adjusted BIOS fast boot settings.",
            
            disks: [
                { name: "Samsung 970 EVO 1TB", health: "good", hours: "4520" }
            ],
            diskComments: "Primary NVMe drive is in excellent health. Recommended routine file cleanup.",
            
            cpuScoreBefore: 12500,
            cpuScoreAfter: 13800,
            cpuClockBefore: 3.8,
            cpuClockAfter: 4.6,
            cpuGflopsBefore: 210,
            cpuGflopsAfter: 245,
            cpuComments: "Applied negative voltage offset (-0.05v) to reduce thermals, allowing higher sustained boost clocks.",
            
            gpuScoreBefore: 18000,
            gpuScoreAfter: 19500,
            gpuFpsBefore: 140,
            gpuFpsAfter: 165,
            gpuGflopsBefore: 9500,
            gpuGflopsAfter: 10200,
            gpuComments: "Custom fan curve applied. Memory overclocked +800MHz stable.",
            
            ocEnabled: true,
            ocCpuVcore: "1.32v",
            ocGpuCore: "+120 MHz",
            ocCpuClock: "5.1 GHz All-Core",
            ocGpuMem: "+1000 MHz",
            ocCpuLlc: "Mode 4 (Flat)",
            ocGpuPower: "115% Max",
            ocFurmarkTemp: 68,
            ocFurmarkDuration: 30,
            ocFurmarkStable: true,
            ocOcctTemp: 82,
            ocOcctDuration: 60,
            ocOcctStable: true,
            ocCinebenchScore: 18450,
            ocCinebenchTemp: 85,
            ocSuperposScore: 8900,
            ocSuperposFps: 65,
            ocSuperposPreset: "1080p Extreme",
            
            screenshots: [],
            screenshotComments: "Screenshots confirm stability under load and improved benchmark scores."
        };
    };

    const getFormData = () => {
        const disks = Array.from(document.querySelectorAll('.disk-item')).map(item => ({
            name: item.querySelector('.disk-name').value,
            health: item.querySelector('.disk-health').value,
            hours: item.querySelector('.disk-hours').value
        }));

        // For screenshots in form data, we need the actual image elements to read src
        const screenshotImgs = Array.from(document.querySelectorAll('#screenshotPreview img'));

        return {
            clientName: document.getElementById('clientName').value || 'Client',
            machineName: document.getElementById('machineName').value || 'Machine',
            date: document.getElementById('date').value,
            
            bootBefore: document.getElementById('fullStartupTimeBefore').value,
            bootAfter: document.getElementById('fullStartupTimeAfter').value,
            desktopBefore: document.getElementById('desktopTimeBefore').value,
            desktopAfter: document.getElementById('desktopTimeAfter').value,
            longestProcess: document.getElementById('longestProcess').value,
            startupComments: document.getElementById('startupComments').value,
            
            disks: disks,
            diskComments: document.getElementById('diskComments').value,
            
            cpuScoreBefore: document.getElementById('cpuScoreBefore').value,
            cpuScoreAfter: document.getElementById('cpuScoreAfter').value,
            cpuClockBefore: document.getElementById('cpuClockBefore').value,
            cpuClockAfter: document.getElementById('cpuClockAfter').value,
            cpuGflopsBefore: document.getElementById('cpuGflopsBefore').value,
            cpuGflopsAfter: document.getElementById('cpuGflopsAfter').value,
            cpuComments: document.getElementById('cpuComments').value,
            
            gpuScoreBefore: document.getElementById('gpuScoreBefore').value,
            gpuScoreAfter: document.getElementById('gpuScoreAfter').value,
            gpuFpsBefore: document.getElementById('gpuFpsBefore').value,
            gpuFpsAfter: document.getElementById('gpuFpsAfter').value,
            gpuGflopsBefore: document.getElementById('gpuGflopsBefore').value,
            gpuGflopsAfter: document.getElementById('gpuGflopsAfter').value,
            gpuComments: document.getElementById('gpuComments').value,
            
            ocEnabled: document.getElementById('ocToggle').checked,
            ocCpuVcore: document.getElementById('ocCpuVcore').value,
            ocGpuCore: document.getElementById('ocGpuCore').value,
            ocCpuClock: document.getElementById('ocCpuClock').value,
            ocGpuMem: document.getElementById('ocGpuMem').value,
            ocCpuLlc: document.getElementById('ocCpuLlc').value,
            ocGpuPower: document.getElementById('ocGpuPower').value,
            ocFurmarkTemp: document.getElementById('ocFurmarkTemp').value,
            ocFurmarkDuration: document.getElementById('ocFurmarkDuration').value,
            ocFurmarkStable: document.getElementById('ocFurmarkStable').checked,
            ocOcctTemp: document.getElementById('ocOcctTemp').value,
            ocOcctDuration: document.getElementById('ocOcctDuration').value,
            ocOcctStable: document.getElementById('ocOcctStable').checked,
            ocCinebenchScore: document.getElementById('ocCinebenchScore').value,
            ocCinebenchTemp: document.getElementById('ocCinebenchTemp').value,
            ocSuperposScore: document.getElementById('ocSuperposScore').value,
            ocSuperposFps: document.getElementById('ocSuperposFps').value,
            ocSuperposPreset: document.getElementById('ocSuperposPreset').value,
            
            screenshots: screenshotImgs, // Array of img elements
            screenshotComments: document.getElementById('screenshotComments').value
        };
    };

    // --- PDF Generation ---
    const generateReportPdf = async (data) => {
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
        
        const addSubHeader = (title) => {
            checkPageBreak(15);
            yPos += 5;
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(mainColor);
            doc.text(title, margin, yPos);
            doc.setTextColor('#000000');
            doc.setFont(undefined, 'normal');
            yPos += 10;
        }

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

        const addExplanation = (text) => {
             checkPageBreak(15);
             doc.setFontSize(9);
             doc.setTextColor('#555555');
             doc.setFont(undefined, 'italic');
             const lines = doc.splitTextToSize(text, contentWidth - 10); 
             doc.text(lines, margin + 5, yPos); 
             doc.setFont(undefined, 'normal');
             doc.setTextColor('#000000');
             yPos += (lines.length * 5) + 8;
        };

        // Visual Comparison Bar Chart
        const addComparisonChart = (label, before, after, unit, lowerIsBetter = true) => {
            const bVal = parseFloat(before);
            const aVal = parseFloat(after);

            if (isNaN(bVal)) return;

            if (isNaN(aVal)) {
                addTextRow(label, `${bVal} ${unit}`);
                return;
            }

            checkPageBreak(35); 

            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text(label, margin, yPos);
            
            let text = `${bVal} ${unit}`;
            let improvement = 0;
            let isImproved = false;

            if (lowerIsBetter) {
                improvement = ((bVal - aVal) / bVal) * 100;
                isImproved = aVal < bVal;
            } else {
                improvement = ((aVal - bVal) / bVal) * 100;
                isImproved = aVal > bVal;
            }
            
            const displayImp = Math.abs(improvement).toFixed(1);
            
            let impText = "";
            if (lowerIsBetter) {
                 if (isImproved) impText = `(Improved by ${displayImp}%)`;
                 else impText = `(Slower/Hotter by ${displayImp}%)`;
            } else {
                if (isImproved) impText = `(Improved by ${displayImp}%)`;
                else impText = `(Decreased by ${displayImp}%)`;
            }

            text += `  ->  ${aVal} ${unit}  ${impText}`;

            doc.setFont(undefined, 'normal');
            doc.text(text, margin + 60, yPos);
            yPos += 8;

            // Draw Bars
            const maxVal = Math.max(bVal, aVal) * 1.1; 
            const chartWidth = 120; 
            const barHeight = 6;

            // Before Bar
            const bWidth = (bVal / maxVal) * chartWidth;
            doc.setFillColor(barColorBefore);
            doc.rect(margin, yPos, bWidth, barHeight, 'F');
            doc.setFontSize(8);
            doc.setTextColor('#555');
            doc.text("Before", margin + bWidth + 2, yPos + 4);
            yPos += barHeight + 2;

            // After Bar
            const aWidth = (aVal / maxVal) * chartWidth;
            doc.setFillColor(barColorAfter);
            doc.rect(margin, yPos, aWidth, barHeight, 'F');
            doc.text("After", margin + aWidth + 2, yPos + 4);
            yPos += barHeight + 5;
            
            doc.setTextColor('#000000');
        };

        // --- Header ---
        const drawHeader = () => {
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

            // Client Info
            doc.setFontSize(10);
            
            doc.text(`Date: ${data.date}`, pageWidth - margin, 15, { align: 'right' });
            doc.text(`Client: ${data.clientName}`, pageWidth - margin, 20, { align: 'right' });
            doc.text(`Machine: ${data.machineName}`, pageWidth - margin, 25, { align: 'right' });

            yPos = 50;
            doc.setTextColor('#000000');
        };
        
        drawHeader();

        // --- Executive Summary (Dynamic) ---
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Executive Summary", margin, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);

        let summaryPoints = [];

        // 1. Boot Performance
        const bootBefore = parseFloat(data.bootBefore) || 0;
        const bootAfter = parseFloat(data.bootAfter) || 0;
        if (bootBefore > 0 && bootAfter > 0 && bootAfter < bootBefore) {
            const imp = ((bootBefore - bootAfter) / bootBefore * 100).toFixed(0);
            summaryPoints.push(`Your system is starting up ${imp}% faster. We reduced the boot time from ${bootBefore}s to ${bootAfter}s by streamlining startup applications and disabling unnecessary system services.`);
        }

        // 2. Processor (CPU)
        const cpuBefore = parseFloat(data.cpuScoreBefore) || 0;
        const cpuAfter = parseFloat(data.cpuScoreAfter) || 0;
        if (cpuBefore > 0 && cpuAfter > 0 && cpuAfter > cpuBefore) {
            const imp = ((cpuAfter - cpuBefore) / cpuBefore * 100).toFixed(0);
            summaryPoints.push(`Processing power has increased by ${imp}%. This improvement means faster application loading, smoother multitasking, and a more responsive experience overall.`);
        }

        // 3. Graphics (GPU)
        const gpuBefore = parseFloat(data.gpuScoreBefore) || 0;
        const gpuAfter = parseFloat(data.gpuScoreAfter) || 0;
        if (gpuBefore > 0 && gpuAfter > 0 && gpuAfter > gpuBefore) {
            const imp = ((gpuAfter - gpuBefore) / gpuBefore * 100).toFixed(0);
            summaryPoints.push(`Graphics performance saw a ${imp}% boost. You can expect smoother visuals, higher frame rates in games, and better performance in video playback or creative tasks.`);
        }

        // 4. Overclocking
        if (data.ocEnabled) {
            summaryPoints.push("Advanced enthusiast-level tuning was applied to your hardware. We have safely increased the operating speed of your components while verifying stability, squeezing every bit of performance out of your system.");
        }

        // 5. General Health / Maintenance
        summaryPoints.push("We performed a comprehensive system health check, including software optimizations and internal maintenance to ensure optimal performance and stability.");

        // 6. Disk Warning
        const hasBadDisk = data.disks.some(d => d.health === 'bad');
        if (hasBadDisk) {
            summaryPoints.push("CRITICAL NOTE: We detected potential issues with one or more storage drives. Please refer to the Disk Health section below and considering backing up your data immediately.");
        }

        // Combine points
        const fullSummary = summaryPoints.join(" ");
        const summaryLines = doc.splitTextToSize(fullSummary, contentWidth);
        doc.text(summaryLines, margin, yPos);
        yPos += (summaryLines.length * lineHeight) + 10;

        // --- Sections ---
        
        // 1. Startup Time
        addSectionTitle("Startup & Boot Performance");
        addComparisonChart("Fully Started", data.bootBefore, data.bootAfter, "s", true);
        addComparisonChart("Desktop Shown", data.desktopBefore, data.desktopAfter, "s", true);
        addTextRow("Longest Process", data.longestProcess);
        addCommentBlock("Analyst Notes", data.startupComments);


        // 2. Disk Health
        addSectionTitle("Disk Health Status");
        if (data.disks.length === 0) {
            doc.text("No disk data recorded.", margin, yPos);
            yPos += 10;
        } else {
            data.disks.forEach(disk => {
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
        addCommentBlock("Analyst Notes", data.diskComments);


        // 3. CPU Benchmarks
        addSectionTitle("CPU Performance (Novabench)");
        addComparisonChart("Overall Score", data.cpuScoreBefore, data.cpuScoreAfter, "pts", false);
        addComparisonChart("Clock Speed", data.cpuClockBefore, data.cpuClockAfter, "GHz", false);
        addComparisonChart("GFLOPS", data.cpuGflopsBefore, data.cpuGflopsAfter, "GFLOPS", false);
        
        // Explanation for CPU GFLOPS
        const cpuGflopsB_val = parseFloat(data.cpuGflopsBefore);
        const cpuGflopsA_val = parseFloat(data.cpuGflopsAfter);
        if (cpuGflopsA_val > cpuGflopsB_val) {
             const imp = ((cpuGflopsA_val - cpuGflopsB_val) / cpuGflopsB_val * 100).toFixed(1);
             addExplanation(`GFLOPS measures the raw computational speed of your CPU for heavy calculations. The ${imp}% increase means your processor is now faster at demanding tasks like video editing, 3D rendering, and serious multitasking.`);
        } else {
             addExplanation(`GFLOPS measures the raw computational speed of your CPU. This score reflects your processor's ability to handle heavy, complex calculations like video editing and multitasking.`);
        }

        addCommentBlock("Analyst Notes", data.cpuComments);


        // 4. GPU Benchmarks
        addSectionTitle("GPU Performance (Novabench)");
        addComparisonChart("Overall Score", data.gpuScoreBefore, data.gpuScoreAfter, "pts", false);
        addComparisonChart("FPS", data.gpuFpsBefore, data.gpuFpsAfter, "FPS", false);
        addComparisonChart("GFLOPS", data.gpuGflopsBefore, data.gpuGflopsAfter, "GFLOPS", false);

        // Explanation for GPU GFLOPS
        const gpuGflopsB_val = parseFloat(data.gpuGflopsBefore);
        const gpuGflopsA_val = parseFloat(data.gpuGflopsAfter);
        if (gpuGflopsA_val > gpuGflopsB_val) {
             const imp = ((gpuGflopsA_val - gpuGflopsB_val) / gpuGflopsB_val * 100).toFixed(1);
             addExplanation(`GFLOPS here measures the raw mathematical power of your graphics card. The ${imp}% boost means better performance in modern games, faster 3D rendering, and smoother high-resolution video playback.`);
        } else {
             addExplanation(`This GFLOPS score measures the raw mathematical power of your graphics card. A higher score translates to better performance in gaming, 3D rendering, and video workloads.`);
        }
            
        addCommentBlock("Analyst Notes", data.gpuComments);


        // --- OPTIONAL: Overclocking Section ---
        if (data.ocEnabled) {
            doc.addPage();
            yPos = 20; // Reset Y for new page
            drawHeader(); // Re-draw header on new page
            yPos = 50; // Reset Y below header

            addSectionTitle("Overclocking & Stability Report");
            
            // Tuning Configuration
            addSubHeader("Tuning Configuration");
            
            // CPU Tuning
            doc.setFont(undefined, 'bold');
            doc.text("CPU Settings:", margin, yPos);
            yPos += 6;
            doc.setFont(undefined, 'normal');
            addTextRow("VCore", data.ocCpuVcore);
            addTextRow("Clock / Ratio", data.ocCpuClock);
            addTextRow("LLC / Misc", data.ocCpuLlc);
            
            yPos += 5;

            // GPU Tuning
            doc.setFont(undefined, 'bold');
            doc.text("GPU Settings:", margin, yPos);
            yPos += 6;
            doc.setFont(undefined, 'normal');
            addTextRow("Core Offset", data.ocGpuCore);
            addTextRow("Mem Offset", data.ocGpuMem);
            addTextRow("Power Limit", data.ocGpuPower);

            yPos += 10;

            // Stability
            addSubHeader("Stability Stress Tests");
            
            // Furmark
            doc.setFont(undefined, 'bold');
            doc.text("GPU Stability (Furmark):", margin, yPos);
            yPos += 6;
            doc.setFont(undefined, 'normal');
            addTextRow("Max Temp", data.ocFurmarkTemp ? `${data.ocFurmarkTemp} \u00B0C` : "");
            addTextRow("Duration", data.ocFurmarkDuration ? `${data.ocFurmarkDuration} min` : "");
            
            doc.setFont(undefined, 'bold');
            doc.text("Status:", margin, yPos);
            doc.setTextColor(data.ocFurmarkStable ? '#009900' : '#cc0000');
            doc.text(data.ocFurmarkStable ? "STABLE" : "UNSTABLE / NOT PASSING", margin + 50, yPos);
            doc.setTextColor('#000000');
            yPos += 10;

            // OCCT
            doc.setFont(undefined, 'bold');
            doc.text("CPU Stability (OCCT):", margin, yPos);
            yPos += 6;
            doc.setFont(undefined, 'normal');
            addTextRow("Max Temp", data.ocOcctTemp ? `${data.ocOcctTemp} \u00B0C` : "");
            addTextRow("Duration", data.ocOcctDuration ? `${data.ocOcctDuration} min` : "");
            
            doc.setFont(undefined, 'bold');
            doc.text("Status:", margin, yPos);
            doc.setTextColor(data.ocOcctStable ? '#009900' : '#cc0000');
            doc.text(data.ocOcctStable ? "STABLE" : "UNSTABLE / NOT PASSING", margin + 50, yPos);
            doc.setTextColor('#000000');
            yPos += 15;


            // Benchmarks
            addSubHeader("Enthusiast Benchmarks");
            
            // Cinebench
            doc.setFont(undefined, 'bold');
            doc.text("Cinebench R23/24:", margin, yPos);
            yPos += 6;
            doc.setFont(undefined, 'normal');
            addTextRow("Score", data.ocCinebenchScore);
            addTextRow("Max Temp", data.ocCinebenchTemp ? `${data.ocCinebenchTemp} \u00B0C` : "");
            yPos += 5;

            // Superposition
            doc.setFont(undefined, 'bold');
            doc.text("Unigine Superposition:", margin, yPos);
            yPos += 6;
            doc.setFont(undefined, 'normal');
            addTextRow("Score", data.ocSuperposScore);
            addTextRow("Avg FPS", data.ocSuperposFps);
            addTextRow("Preset", data.ocSuperposPreset);
        }


        // 5. Screenshots
        checkPageBreak(50); 
        addSectionTitle("Visual Proof of Work");
        
        if (data.screenshots && data.screenshots.length > 0) {
            for (let i = 0; i < data.screenshots.length; i++) {
                const img = data.screenshots[i];
                
                // Calculate dimensions
                const imgRatio = img.naturalHeight / img.naturalWidth;
                const renderWidth = contentWidth;
                const renderHeight = renderWidth * imgRatio;

                checkPageBreak(renderHeight + 10);

                try {
                    const imageData = await new Promise((resolve) => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth;
                        canvas.height = img.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        resolve(canvas.toDataURL('image/jpeg', 0.8));
                    });
                    
                    doc.addImage(imageData, 'JPEG', margin, yPos, renderWidth, renderHeight);
                    yPos += renderHeight + 10; 
                } catch (e) {
                    console.error("Failed to add image to PDF:", e);
                }
            }
        } else {
            doc.text("No screenshots attached.", margin, yPos);
            yPos += 10;
        }
        addCommentBlock("General Comments", data.screenshotComments);


        // Footer
        const pageCount = doc.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor('#999999');
            doc.text(`Generated by TechSmith404 - Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }

        // Save PDF
        const formattedClientName = String(data.clientName).replace(/\s+/g, '_');
        const formattedMachineName = String(data.machineName).replace(/\s+/g, '_');
        const formattedDate = String(data.date).replace(/\//g, '-');
        const filename = `${formattedClientName}_${formattedMachineName}_${formattedDate}_Optimization_Report.pdf`;

        doc.save(filename);
    };

    // --- Event Listeners ---
    const generateExamplePdfBtn = document.getElementById('generateExamplePdfBtn');
    if (generateExamplePdfBtn) {
        generateExamplePdfBtn.addEventListener('click', () => {
            generateReportPdf(getExampleData());
        });
    }

    generatePdfBtn.addEventListener('click', () => {
        generateReportPdf(getFormData());
    });
});
