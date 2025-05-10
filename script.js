function showForm() {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("form-section").classList.remove("hidden");
}

function startTest() {
  document.getElementById("form-section").classList.add("hidden");
  document.getElementById("quiz-section").classList.remove("hidden");
}

document.getElementById("quizForm").onsubmit = function(e) {
  e.preventDefault();
  const selects = document.querySelectorAll("#quizForm select");
  let score = 0;
  selects.forEach(sel => score += parseInt(sel.value || 0));
  
  if (score < 2) {
    document.getElementById("quiz-section").classList.add("hidden");
    document.getElementById("result-message").innerText = "Sorry, you have not been selected.";
    document.getElementById("result-section").classList.remove("hidden");
    return;
  }

  const form = document.getElementById("recruitForm");
  const name = form.name.value;
  const email = form.email.value;
  const cvFile = form.cv.files[0];

  const reader = new FileReader();
  reader.onload = function () {
    const base64String = reader.result.split(',')[1];

    fetch("https://script.google.com/macros/s/AKfycbzIKCHQJuG7f81U355L1TMULqVUXWXuTxVJZWjs6x34rdfpgCI1Kh1jPj__xy-ICEhGXQ/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        cvName: cvFile.name,
        cvBase64: base64String
      })
    })
    .then(res => res.text())
    .then(response => {
      document.getElementById("quiz-section").classList.add("hidden");
      if (response.includes("DUPLICATE")) {
        document.getElementById("result-message").innerText = "You've already applied with this email.";
      } else if (response.includes("Success")) {
        document.getElementById("result-message").innerText = "Application submitted!";
      } else {
        document.getElementById("result-message").innerText = "Something went wrong.";
      }
      document.getElementById("result-section").classList.remove("hidden");
    })
    .catch(err => {
      alert("Error submitting: " + err);
    });
  };
  reader.readAsDataURL(cvFile);
};