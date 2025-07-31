document.addEventListener("DOMContentLoaded", function () {
  // Initialize the application
  initToolSelection();
  initInputOptions();
  initFormHandlers();

  // Mock data for demonstration
  loadMockData();
});

function initToolSelection() {
  const toolItems = document.querySelectorAll(".tool-selection li");

  toolItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all items
      toolItems.forEach((i) => i.classList.remove("active"));

      // Add active class to clicked item
      this.classList.add("active");

      // Show corresponding panel
      const toolName = this.getAttribute("data-tool");
      showToolPanel(toolName);
    });
  });
}

function initInputOptions() {
  const inputButtons = document.querySelectorAll(".input-options .btn");

  inputButtons.forEach((button) => {
    button.addEventListener("click", function () {
      inputButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Handle different input methods
      const inputType = this.getAttribute("data-input-type");
      handleInputMethodChange(inputType);
    });
  });
}

function handleInputMethodChange(method) {
  const genomeInput = document.getElementById("genome-input");

  switch (method) {
    case "paste":
      genomeInput.placeholder = "Paste DNA sequence here...";
      genomeInput.disabled = false;
      break;
    case "upload":
      genomeInput.placeholder = "File will be processed after upload...";
      genomeInput.disabled = true;
      // Here you would implement file upload logic
      break;
    case "database":
      genomeInput.placeholder = "Select a genome from the database...";
      genomeInput.disabled = true;
      // Here you would implement database selection
      break;
  }
}

function initFormHandlers() {
  // Find guides button
  document.getElementById("find-guides").addEventListener("click", function () {
    const sequence = document.getElementById("genome-input").value.trim();
    const casType = document.getElementById("cas-type").value;
    const pamSequence = document.getElementById("pam-sequence").value;

    if (!sequence) {
      alert("Please enter a genome sequence");
      return;
    }

    // In a real app, this would call your Python backend
    findGuideRNAs(sequence, casType, pamSequence);
  });

  // Score guides button
  document
    .getElementById("score-guides")
    .addEventListener("click", function () {
      // Get selected guides and score them
      const selectedGuides = getSelectedGuides();

      if (selectedGuides.length === 0) {
        alert("Please select at least one guide RNA to score");
        return;
      }

      // In a real app, this would call your Python backend
      scoreGuides(selectedGuides);
    });
}

function findGuideRNAs(sequence, casType, pamSequence) {
  // This is mock functionality - in reality, this would call your Python backend
  console.log("Finding guide RNAs for:", { sequence, casType, pamSequence });

  // Simulate API call delay
  setTimeout(() => {
    // Mock data
    const mockGuides = generateMockGuides(sequence, casType, pamSequence);
    displayGuideResults(mockGuides);
  }, 1000);
}

function generateMockGuides(sequence, casType, pamSequence) {
  // Generate some mock guide RNAs for demonstration
  const guides = [];
  const guideLength = 20; // Standard length for most Cas9 guides

  // Use default PAM if none provided
  const effectivePAM = pamSequence || (casType === "cas9" ? "NGG" : "TTTN");

  // Find all potential PAM sites in the sequence
  const pamRegex = new RegExp(effectivePAM.replace(/N/g, "[ATCG]"), "gi");
  let match;

  while ((match = pamRegex.exec(sequence.toUpperCase())) !== null) {
    const pamPos = match.index;
    const strand = Math.random() > 0.5 ? "+" : "-";

    // Extract guide sequence (position depends on Cas type)
    let guideSeq;
    if (casType === "cas9") {
      // For Cas9, guide is upstream of PAM
      const startPos = Math.max(0, pamPos - guideLength);
      guideSeq = sequence.substring(startPos, pamPos);
    } else {
      // For other Cas types, guide might be downstream
      const endPos = Math.min(
        sequence.length,
        pamPos + effectivePAM.length + guideLength
      );
      guideSeq = sequence.substring(pamPos + effectivePAM.length, endPos);
    }

    if (guideSeq.length === guideLength) {
      guides.push({
        position: pamPos,
        sequence: guideSeq,
        pam: match[0],
        strand: strand,
        gcContent: calculateGCContent(guideSeq),
        thermoScore: (Math.random() * 5 + 5).toFixed(2),
      });
    }

    // Limit to 10 guides for demo
    if (guides.length >= 10) break;
  }

  return guides;
}

function calculateGCContent(sequence) {
  const gcCount = (sequence.match(/[GC]/gi) || []).length;
  return ((gcCount / sequence.length) * 100).toFixed(1) + "%";
}

function displayGuideResults(guides) {
  const tableBody = document.querySelector("#guide-results tbody");
  tableBody.innerHTML = "";

  guides.forEach((guide, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><input type="checkbox" data-guide-id="${index}"></td>
            <td>${guide.position}</td>
            <td class="guide-sequence">${guide.sequence}</td>
            <td>${guide.pam}</td>
            <td>${guide.strand}</td>
            <td>${guide.gcContent}</td>
            <td>
                <button class="btn small analyze-btn" data-guide-id="${index}">Analyze</button>
            </td>
        `;
    tableBody.appendChild(row);
  });

  // Add event listeners to analyze buttons
  document.querySelectorAll(".analyze-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const guideId = this.getAttribute("data-guide-id");
      analyzeGuide(guides[guideId]);
    });
  });
}

function getSelectedGuides() {
  const selected = [];
  document
    .querySelectorAll('#guide-results input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      const guideId = checkbox.getAttribute("data-guide-id");
      const row = checkbox.closest("tr");
      const sequence = row.querySelector(".guide-sequence").textContent;
      selected.push({
        id: guideId,
        sequence: sequence,
      });
    });
  return selected;
}

function analyzeGuide(guide) {
  // Update properties panel
  document.getElementById("guide-seq").textContent = guide.sequence;
  document.getElementById("pam-seq").textContent = guide.pam;
  document.getElementById("gc-content").textContent = guide.gcContent;
  document.getElementById("thermo-score").textContent = guide.thermoScore;

  // Mock additional data
  document.getElementById("mit-score").textContent = (
    Math.random() * 100
  ).toFixed(1);
  document.getElementById("exact-matches").textContent = Math.floor(
    Math.random() * 3
  );
  document.getElementById("mismatches").textContent = Math.floor(
    Math.random() * 10
  );

  // In a real app, you would also update visualizations here
}

function scoreGuides(guides) {
  console.log("Scoring guides:", guides);
  // In a real app, this would call your Python backend

  // Mock scoring results
  setTimeout(() => {
    alert(
      `Successfully scored ${guides.length} guide RNAs. See properties panel for details.`
    );

    // Update the table with scores (in a real app)
    guides.forEach((guide) => {
      const row = document
        .querySelector(`#guide-results input[data-guide-id="${guide.id}"]`)
        .closest("tr");
      // Add score columns if they don't exist
      if (row.cells.length < 8) {
        const scoreCell = document.createElement("td");
        scoreCell.textContent = (Math.random() * 100).toFixed(1);
        row.appendChild(scoreCell);

        const mitCell = document.createElement("td");
        mitCell.textContent = (Math.random() * 100).toFixed(1);
        row.appendChild(mitCell);
      }
    });
  }, 1500);
}

function showToolPanel(toolName) {
  // Hide all panels
  document.querySelectorAll(".content-panel").forEach((panel) => {
    panel.classList.remove("active");
  });

  // Show selected panel
  document.getElementById(`${toolName}-panel`).classList.add("active");
}

function loadMockData() {
  // For demo purposes, load some mock data
  const mockSequence =
    "ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG" +
    "GGATCCGGATCCGGATCCGGATCCGGATCCGGATCCGGATCCGGATCCGGATCCGGATCC" +
    "CTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAG";

  document.getElementById("genome-input").value = mockSequence;
}
