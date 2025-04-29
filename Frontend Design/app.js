// Dummy data for courses
const coursesData = [
    {
      id: "HIST101",
      name: "Ancient Civilizations",
      thumbnail: "https://source.unsplash.com/400x200/?ancient,history",
      instructor: "Dr. Sarah Johnson",
      category: "Ancient",
      time: "8h",
      description: "Explore the wonders of Ancient Egypt, Greece, Rome, and more. Dive into the origins of civilization.",
      subtopics: [
        {
          name: "The Rise of Egypt",
          intro: "Discover how the Nile shaped Egypt's history.",
          tags: ["Egypt", "Nile"],
          video: "https://youtu.be/ru_5PA8cwkE?si=uIuVZV5s5WxNJgqv",
          pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        },
        {
          name: "Greek Democracy",
          intro: "How democracy was born in Athens.",
          tags: ["Greece", "Democracy"],
          video: "https://www.youtube.com/embed/4PJ0jyoG2b8",
          pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        }
      ],
      quiz: [
        {
          q: "Which river is essential to Ancient Egypt?",
          options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
          answer: 1
        },
        {
          q: "Where was democracy first developed?",
          options: ["Rome", "Athens", "Babylon", "Carthage"],
          answer: 1
        }
      ]
    },
    {
      id: "HIST202",
      name: "World War II",
      thumbnail: "https://source.unsplash.com/400x200/?ww2,history",
      instructor: "Prof. Michael Brown",
      category: "War",
      time: "10h",
      description: "A comprehensive look at the causes, events, and aftermath of World War II.",
      subtopics: [
        {
          name: "Causes of WWII",
          intro: "Understand the political and economic factors.",
          tags: ["Causes", "Politics"],
          video: "https://www.youtube.com/embed/HUqy-OQvVtI",
          pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        },
        {
          name: "Major Battles",
          intro: "Key battles that shaped the war.",
          tags: ["Battles", "Europe"],
          video: "https://www.youtube.com/embed/1vZDVbqRhyM",
          pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        }
      ],
      quiz: [
        {
          q: "When did World War II end?",
          options: ["1943", "1945", "1950", "1939"],
          answer: 1
        },
        {
          q: "Which event started WWII?",
          options: ["Pearl Harbor", "Invasion of Poland", "D-Day", "Battle of Britain"],
          answer: 1
        }
      ]
    }
  ];
  
  // Dummy stats
  const stats = [
    { icon: "fa-book", label: "Total Courses", value: 12 },
    { icon: "fa-users", label: "Total Students", value: 340 },
    { icon: "fa-clock", label: "Total Hours", value: 90 },
    { icon: "fa-question", label: "Total Quizzes", value: 24 }
  ];
  
  // Preloader
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      document.getElementById("preloader")?.remove();
    }, 600);
  });
  
  // Dark mode
  function setDarkMode(on) {
    if (on) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
    localStorage.setItem("darkMode", on ? "1" : "0");
  }
  document.getElementById("darkModeToggle")?.addEventListener("click", () => {
    setDarkMode(!document.body.classList.contains("dark"));
  });
  if (localStorage.getItem("darkMode") === "1") setDarkMode(true);
  
  // Back to top
  const backToTop = document.getElementById("backToTop");
  window.onscroll = () => {
    if (window.scrollY > 300) backToTop.style.display = "flex";
    else backToTop.style.display = "none";
  };
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  
  // Featured Carousel (index.html)
  if (document.getElementById("featuredCarousel")) {
    const carousel = document.getElementById("featuredCarousel");
    coursesData.slice(0, 3).forEach((course, idx) => {
      carousel.innerHTML += `
        <div class="course-card" data-id="${course.id}">
          <img src="${course.thumbnail}" alt="${course.name}">
          <i class="fa-heart fa-regular favorite" title="Add to favorites"></i>
          <div class="course-card-content">
            <h3>${course.name}</h3>
            <div class="meta">${course.instructor} • ${course.time}</div>
            <div class="tags">${course.category}</div>
            <a href="course-details.html?id=${course.id}" class="btn accent">View Details</a>
          </div>
        </div>
      `;
    });
    // Carousel auto-slide
    let scrollPos = 0;
    setInterval(() => {
      scrollPos += 300;
      if (scrollPos > carousel.scrollWidth - carousel.clientWidth) scrollPos = 0;
      carousel.scrollTo({ left: scrollPos, behavior: "smooth" });
    }, 3500);
    // Favorite
    carousel.querySelectorAll(".favorite").forEach((fav, i) => {
      fav.addEventListener("click", e => {
        fav.classList.toggle("active");
        e.stopPropagation();
      });
    });
  }
  
  // Stats section (index.html)
  if (document.getElementById("statsGrid")) {
    const statsGrid = document.getElementById("statsGrid");
    stats.forEach(stat => {
      statsGrid.innerHTML += `
        <div class="stat-card">
          <h3><i class="fa ${stat.icon}"></i> ${stat.value}</h3>
          <p>${stat.label}</p>
        </div>
      `;
    });
  }
  
  // Courses grid (courses.html)
  if (document.getElementById("coursesGrid")) {
    const grid = document.getElementById("coursesGrid");
    function renderCourses(list) {
      grid.innerHTML = "";
      list.forEach(course => {
        grid.innerHTML += `
          <div class="course-card" data-id="${course.id}">
            <img src="${course.thumbnail}" alt="${course.name}">
            <i class="fa-heart fa-regular favorite" title="Add to favorites"></i>
            <div class="course-card-content">
              <h3>${course.name}</h3>
              <div class="meta">${course.instructor} • ${course.time}</div>
              <div class="tags"><span>${course.category}</span></div>
              <a href="course-details.html?id=${course.id}" class="btn accent">View Details</a>
            </div>
          </div>
        `;
      });
      grid.querySelectorAll(".favorite").forEach(fav => {
        fav.addEventListener("click", e => {
          fav.classList.toggle("active");
          e.stopPropagation();
        });
      });
    }
    renderCourses(coursesData);
  
    // Search/filter
    document.getElementById("searchBar").addEventListener("input", e => {
      const v = e.target.value.toLowerCase();
      renderCourses(coursesData.filter(c => c.name.toLowerCase().includes(v)));
    });
    document.getElementById("categoryFilter").addEventListener("change", e => {
      const v = e.target.value;
      renderCourses(v ? coursesData.filter(c => c.category === v) : coursesData);
    });
  }
  
  // Course details (course-details.html)
  if (document.getElementById("courseDetailsSection")) {
    const params = new URLSearchParams(window.location.search);
    const course = coursesData.find(c => c.id === params.get("id")) || coursesData[0];
    const section = document.getElementById("courseDetailsSection");
    // Dummy progress
    let courseProgress = parseInt(localStorage.getItem("progress_" + course.id) || "0");
    section.innerHTML = `
      <div class="course-card" style="max-width:600px;margin:auto;">
        <img src="${course.thumbnail}" alt="${course.name}">
        <div class="course-card-content">
          <h3>${course.name}</h3>
          <div class="meta">${course.instructor} • ${course.time} • <span>${course.category}</span></div>
          <p>${course.description}</p>
          <div class="progress-bar"><div class="progress-bar-inner" style="width:${courseProgress}%;"></div></div>
        </div>
      </div>
      <h2 style="margin-top:2rem;">Subtopics</h2>
      <div id="subtopics"></div>
      <div id="quizSection"></div>
    `;
    // Subtopics accordion
    const subtopicsDiv = document.getElementById("subtopics");
    course.subtopics.forEach((st, i) => {
      subtopicsDiv.innerHTML += `
        <div class="accordion" data-idx="${i}">
          <div class="accordion-header">
            <span>${st.name}</span>
            <i class="fas fa-chevron-right"></i>
          </div>
          <div class="accordion-content">
            <p>${st.intro}</p>
            <div class="subtopic-tags">${st.tags.map(t => `<span>${t}</span>`).join("")}</div>
            <div style="margin:1rem 0;">
              <iframe width="100%" height="220" src="${st.video}" frameborder="0" allowfullscreen></iframe>
            </div>
            <a href="${st.pdf}" target="_blank" class="btn" style="margin-bottom:1rem;">Download PDF</a>
            <button class="mark-read-btn" data-idx="${i}">Mark as Read</button>
          </div>
        </div>
      `;
    });
    // Accordion logic
    subtopicsDiv.querySelectorAll(".accordion-header").forEach(header => {
      header.addEventListener("click", () => {
        header.parentElement.classList.toggle("open");
      });
    });
    // Mark as read logic
    let readArr = JSON.parse(localStorage.getItem("read_" + course.id) || "[]");
    subtopicsDiv.querySelectorAll(".mark-read-btn").forEach((btn, i) => {
      if (readArr.includes(i)) btn.classList.add("read"), btn.textContent = "Read";
      btn.addEventListener("click", () => {
        btn.classList.toggle("read");
        if (btn.classList.contains("read")) {
          btn.textContent = "Read";
          readArr.push(i);
        } else {
          btn.textContent = "Mark as Read";
          readArr = readArr.filter(idx => idx !== i);
        }
        localStorage.setItem("read_" + course.id, JSON.stringify(readArr));
        // Update progress
        let progress = Math.round((readArr.length / course.subtopics.length) * 100);
        localStorage.setItem("progress_" + course.id, progress);
        document.querySelector(".progress-bar-inner").style.width = progress + "%";
      });
    });
  
    // Quiz Section
    const quizDiv = document.getElementById("quizSection");
    let quizIdx = 0, quizScore = 0;
    function renderQuiz() {
      if (quizIdx >= course.quiz.length) {
        quizDiv.innerHTML = `
          <div class="quiz-section">
            <div class="quiz-score">Your Score: ${quizScore} / ${course.quiz.length}</div>
            <button class="quiz-btn" id="retakeQuiz">Retake Quiz</button>
            <a href="#" class="btn accent" style="margin-left:1rem;">Share Score</a>
          </div>
        `;
        document.getElementById("retakeQuiz").onclick = () => {
          quizIdx = 0; quizScore = 0; renderQuiz();
        };
        return;
      }
      const q = course.quiz[quizIdx];
      quizDiv.innerHTML = `
        <div class="quiz-section">
          <div class="quiz-question">${quizIdx + 1}. ${q.q}</div>
          <div class="quiz-options">
            ${q.options.map((opt, i) =>
              `<label><input type="radio" name="quizopt" value="${i}"><span>${opt}</span></label>`
            ).join("")}
          </div>
          <div class="quiz-feedback" id="quizFeedback"></div>
          <button class="quiz-btn" id="nextQuizBtn" disabled>Next</button>
        </div>
      `;
      let selected = null;
      document.querySelectorAll('input[name="quizopt"]').forEach(inp => {
        inp.addEventListener("change", e => {
          selected = parseInt(e.target.value);
          document.getElementById("nextQuizBtn").disabled = false;
          // Feedback
          const fb = document.getElementById("quizFeedback");
          if (selected === q.answer) {
            fb.textContent = "Correct!";
            fb.style.color = "#45b36b";
          } else {
            fb.textContent = `Wrong! Correct: ${q.options[q.answer]}`;
            fb.style.color = "#FF6B35";
          }
        });
      });
      document.getElementById("nextQuizBtn").onclick = () => {
        if (selected === q.answer) quizScore++;
        quizIdx++;
        setTimeout(renderQuiz, 400);
      };
    }
    quizDiv.innerHTML = `<div class="quiz-section"><button class="quiz-btn" id="startQuizBtn">Start Quiz</button></div>`;
    document.getElementById("startQuizBtn").onclick = renderQuiz;
  }
  