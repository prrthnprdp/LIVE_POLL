let chartInstance = null;
const questionIds = ["Q1", "Q2", "Q3", "Q4", "Q5"];
let currentQuestionIndex = 0;

function loadQuestion(qid) {
    fetch(`/get_poll?qid=${qid}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("poll-question").innerText = data.question;
            document.getElementById("poll-question").setAttribute("data-id", data.id);
            document.getElementById("poll-options").innerHTML = "";
            document.getElementById("poll-options").style.display = "block";
            document.getElementById("submit-vote").style.display = "block";
            document.getElementById("result").style.display = "none";

            for (let [key, value] of Object.entries(data.options)) {
                const label = document.createElement("label");
                label.innerHTML = `<input type="radio" name="option" value="${key}"> ${value}`;
                document.getElementById("poll-options").appendChild(label);
                document.getElementById("poll-options").appendChild(document.createElement("br"));
            }
        });
}

function submitVote() {
    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) {
        alert("Please select an option.");
        return;
    }

    const qid = document.getElementById("poll-question").getAttribute("data-id");

    fetch('/vote', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: qid, option: selected.value })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("poll-options").style.display = "none";
        document.getElementById("submit-vote").style.display = "none";
        document.getElementById("result").style.display = "block";

        const ctx = document.getElementById('resultsChart').getContext('2d');
        const labels = Object.keys(data.votes);
        const counts = Object.values(data.votes);

     if (chartInstance) {
    chartInstance.destroy();
}

chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Votes',
            data: counts,
            backgroundColor: 'rgba(0, 123, 255, 0.6)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});


        currentQuestionIndex++;
        if (currentQuestionIndex < questionIds.length) {
            setTimeout(() => {
                loadQuestion(questionIds[currentQuestionIndex]);
            }, 3000);
        } else {
            setTimeout(() => {
                document.getElementById("poll-question").innerText = "Thank you! Poll completed.";
                document.getElementById("result").style.display = "none";
            }, 3000);
        }
    });
}

window.onload = function () {
    loadQuestion(questionIds[currentQuestionIndex]);
};
