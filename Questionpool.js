  
    // 1. ROLLEN-LOGIK
    const params = new URLSearchParams(window.location.search);
    const isDozent = params.get('role') === 'dozent';

    // UI Initialisierung
    const roleBadge = document.getElementById('roleBadge');
    if (isDozent) {
        roleBadge.innerText = "DOZENTEN-MODUS";
        roleBadge.className = "badge dozent-badge";
        document.getElementById('inputSection').classList.add('hidden');
    } else {
        roleBadge.innerText = "STUDENTEN-MODUS";
        roleBadge.className = "badge student-badge";
    }

    // 2. DATEN-LOGIK
    let questions = JSON.parse(localStorage.getItem('uni_questions')) || [];
    let myVotes = JSON.parse(localStorage.getItem('uni_my_votes')) || [];

    // Sync über Tabs hinweg
    window.addEventListener('storage', (e) => {
        if (e.key === 'uni_questions') {
            questions = JSON.parse(e.newValue);
            render();
        }
    });

    function addQuestion() {
        const input = document.getElementById('questionInput');
        if (!input.value.trim()) return;

        const newQ = {
            id: 'q_' + Date.now(),
            text: input.value,
            votes: 0,
            status: 'open',
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };

        questions.push(newQ);
        input.value = '';
        saveAndRender();
    }

    function toggleVote(id) {
        if (isDozent) return; // Dozenten können nicht voten

        const q = questions.find(item => item.id === id);
        const voteIndex = myVotes.indexOf(id);

        if (voteIndex === -1) {
            // Hinzufügen
            q.votes++;
            myVotes.push(id);
        } else {
            // Zurückziehen
            q.votes--;
            myVotes.splice(voteIndex, 1);
        }

        localStorage.setItem('uni_my_votes', JSON.stringify(myVotes));
        saveAndRender();
    }

    function markAsDone(id) {
        const q = questions.find(item => item.id === id);
        if (q) q.status = 'answered';
        saveAndRender();
    }

    function deleteQuestion(id) {
        questions = questions.filter(item => item.id !== id);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('uni_questions', JSON.stringify(questions));
        render();
    }

    function render() {
        const list = document.getElementById('questionList');
        list.innerHTML = '';

        if (questions.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#999;">Noch keine Fragen im Pool.</p>';
            return;
        }

        // Sortierung: Offen vor Beantwortet, dann nach Votes
        const sorted = [...questions].sort((a, b) => {
            if (a.status !== b.status) return a.status === 'open' ? -1 : 1;
            return b.votes - a.votes;
        });

        sorted.forEach(q => {
            const hasVoted = myVotes.includes(q.id);
            const div = document.createElement('div');
            div.className = `question-item ${q.status === 'answered' ? 'answered' : ''}`;

            div.innerHTML = `
                <p class="question-text">${escapeHtml(q.text)}</p>
                <div class="meta-info">Gestellt um ${q.time}</div>
                <div class="actions">
                    <button class="vote-btn ${hasVoted ? 'active' : ''} ${isDozent ? 'disabled' : ''}" 
                            onclick="toggleVote('${q.id}')">
                        ${hasVoted ? '👍' : '👍'} ${q.votes}
                    </button>
                    
                    ${isDozent && q.status === 'open' ? 
                        `<button class="btn-done" onclick="markAsDone('${q.id}')">Erledigt</button>` : ''}
                    
                    ${isDozent ? 
                        `<button class="btn-delete" onclick="deleteQuestion('${q.id}')">Löschen</button>` : ''}
                    
                    ${q.status === 'answered' ? '<span style="color:var(--success); font-size:0.8rem;">✓ Beantwortet</span>' : ''}
                </div>
            `;
            list.appendChild(div);
        });
    }

    // Sicherheitsfunktion gegen XSS (verhindert HTML-Code in Fragen)
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    render();
