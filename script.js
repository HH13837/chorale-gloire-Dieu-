// ===== ÉTAT DE L'APPLICATION =====
let currentState = {
    currentSection: 'themes',
    currentTheme: null,
    currentSubTheme: null,
    currentSong: null
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Simulation du chargement
    simulateLoading();
    setupEventListeners();
}

function setupEventListeners() {
    // Fermer le modal en cliquant à l'extérieur
    document.getElementById('contact-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeContactModal();
        }
    });
    
    // Raccourci clavier Échap pour fermer le modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeContactModal();
            if (currentState.currentSection === 'song-detail') {
                showSection('songs');
            } else if (currentState.currentSection === 'songs') {
                showSection('subthemes');
            } else if (currentState.currentSection === 'subthemes') {
                showSection('themes');
            }
        }
    });
}

function simulateLoading() {
    let progress = 0;
    const progressBar = document.querySelector('.loading-progress');
    const percentage = document.querySelector('.loading-percentage');
    
    const interval = setInterval(() => {
        progress += 1;
        progressBar.style.width = progress + '%';
        percentage.textContent = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(showApp, 500);
        }
    }, 30);
}

function showApp() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        app.style.display = 'block';
        showSection('themes');
    }, 500);
}

// ===== GESTION DE LA NAVIGATION =====
function showSection(sectionName) {
    // Cacher toutes les sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section demandée
    document.getElementById(sectionName + '-section').classList.add('active');
    currentState.currentSection = sectionName;
    
    // Arrêter l'audio si on quitte la section détail
    if (sectionName !== 'song-detail') {
        const audioPlayer = document.getElementById('audio-player');
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
    }
    
    // Fermer le menu mobile
    toggleMobileMenu(false);
}

function showSubThemes(themeName) {
    currentState.currentTheme = themeName;
    const theme = choraleData[themeName];
    
    // Mettre à jour le titre
    document.getElementById('subtheme-title').textContent = theme.title;
    document.getElementById('subtheme-description').textContent = theme.description;
    
    // Générer les sous-thèmes
    const container = document.getElementById('subthemes-container');
    container.innerHTML = '';
    
    Object.entries(theme.subthemes).forEach(([key, subtheme]) => {
        const subthemeCard = createSubThemeCard(key, subtheme);
        container.appendChild(subthemeCard);
    });
    
    showSection('subthemes');
}

function createSubThemeCard(key, subtheme) {
    const card = document.createElement('div');
    card.className = 'subtheme-card';
    card.onclick = () => showSongs(key);
    
    card.innerHTML = `
        <i class="${subtheme.icon}"></i>
        <h3>${subtheme.title}</h3>
        <p>${subtheme.description}</p>
        <div class="song-count">${subtheme.songs.length} chanson${subtheme.songs.length > 1 ? 's' : ''}</div>
    `;
    
    return card;
}

function showSongs(subThemeKey) {
    currentState.currentSubTheme = subThemeKey;
    const theme = choraleData[currentState.currentTheme];
    const subtheme = theme.subthemes[subThemeKey];
    
    // Mettre à jour le titre
    document.getElementById('songs-title').textContent = subtheme.title;
    document.getElementById('songs-description').textContent = `${theme.title} - ${subtheme.description}`;
    
    // Générer le tableau des chansons
    const tableBody = document.getElementById('songs-table-body');
    tableBody.innerHTML = '';
    
    subtheme.songs.forEach(song => {
        const row = createSongRow(song);
        tableBody.appendChild(row);
    });
    
    showSection('songs');
}

function createSongRow(song) {
    const row = document.createElement('tr');
    row.className = 'song-row';
    row.onclick = () => showSongDetail(song);
    
    row.innerHTML = `
        <td>
            <div class="song-title">
                <i class="fas fa-music"></i>
                ${song.title}
            </div>
        </td>
        <td>
            <span class="song-note note-${song.note.replace('+', '-plus')}">${song.note}</span>
        </td>
    `;
    
    return row;
}

function showSongDetail(song) {
    currentState.currentSong = song;
    
    // Mettre à jour les informations de la chanson
    document.getElementById('detail-title').textContent = song.title;
    document.getElementById('detail-category').textContent = 
        `${choraleData[currentState.currentTheme].title} - ${choraleData[currentState.currentTheme].subthemes[currentState.currentSubTheme].title}`;
    document.getElementById('detail-note').textContent = song.note;
    document.getElementById('detail-lyrics').textContent = song.lyrics;
    document.getElementById('detail-notes').textContent = song.notes;
    
    // Configurer l'audio
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.createElement('source');
    audioSource.src = song.audio;
    audioSource.type = 'audio/mpeg';
    
    // Vider les sources existantes et ajouter la nouvelle
    while (audioPlayer.firstChild) {
        audioPlayer.removeChild(audioPlayer.firstChild);
    }
    audioPlayer.appendChild(audioSource);
    
    // Mettre à jour les infos audio
    document.getElementById('audio-duration').textContent = song.duration;
    document.getElementById('audio-quality').textContent = `Qualité: ${song.quality}`;
    
    showSection('song-detail');
}

// ===== GESTION DU MENU MOBILE =====
function toggleMobileMenu(forceClose) {
    const mobileMenu = document.getElementById('mobile-menu');
    if (forceClose === false) {
        mobileMenu.classList.remove('active');
    } else {
        mobileMenu.classList.toggle('active');
    }
}

// ===== GESTION DU MODAL DE CONTACT =====
function showContactModal() {
    document.getElementById('contact-modal').classList.add('active');
    toggleMobileMenu(false);
}

function closeContactModal() {
    document.getElementById('contact-modal').classList.remove('active');
}

function sendEmail() {
    window.location.href = 'mailto:benjaminbanyene6@gmail.com?subject=Contact%20-%20LA%20GLOIRE%20DE%20DIEU&body=Bonjour,%20je%20vous%20contacte%20au%20sujet%20du%20répertoire%20musical...';
}

function openFacebook() {
    window.open('https://www.facebook.com/ben.banyene.octave', '_blank');
}

// ===== GESTION AUDIO =====
function setupAudioPlayer() {
    const audioPlayer = document.getElementById('audio-player');
    
    audioPlayer.addEventListener('loadedmetadata', function() {
        console.log('Audio chargé:', this.duration);
    });
    
    audioPlayer.addEventListener('error', function(e) {
        console.error('Erreur audio:', e);
        showAudioError();
    });
}

function showAudioError() {
    // Vous pourriez afficher un message d'erreur stylisé ici
    console.warn('Fichier audio non disponible');
}

// ===== FONCTIONS UTILITAIRES =====
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== OFFLINE SUPPORT =====
// Enregistrement du Service Worker pour le cache
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker enregistré avec succès: ', registration.scope);
            })
            .catch(function(error) {
                console.log('Échec enregistrement ServiceWorker: ', error);
            });
    });
}

// ===== SAUVEGARDE DES DONNÉES UTILISATEUR =====
function saveUserPreferences() {
    const preferences = {
        lastTheme: currentState.currentTheme,
        lastSubTheme: currentState.currentSubTheme,
        lastSection: currentState.currentSection,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('choraleGloireDieu_preferences', JSON.stringify(preferences));
}

function loadUserPreferences() {
    const saved = localStorage.getItem('choraleGloireDieu_preferences');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

// ===== INITIALISATION AVANCÉE =====
function advancedInit() {
    // Charger les préférences utilisateur
    const prefs = loadUserPreferences();
    if (prefs) {
        // Vous pourriez restaurer la dernière section visitée
        console.log('Préférences chargées:', prefs);
    }
    
    // Configurer le player audio
    setupAudioPlayer();
    
    // Vérifier la connexion
    if (!navigator.onLine) {
        showOfflineMessage();
    }
}

function showOfflineMessage() {
    // Afficher un indicateur de mode hors-ligne
    console.log('Mode hors-ligne activé');
}

// Événement de connexion/déconnexion
window.addEventListener('online', function() {
    console.log('Connexion rétablie');
});

window.addEventListener('offline', function() {
    console.log('Mode hors-ligne');
    showOfflineMessage();
});

// Initialisation finale
setTimeout(advancedInit, 1000);
// ===== FONCTIONNALITÉ DE RECHERCHE GLOBALE =====
function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    const searchClear = document.getElementById('search-clear');
    const searchResults = document.getElementById('search-results');
    
    // Recherche en temps réel
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        if (query.length > 0) {
            searchClear.classList.add('show');
            performSearch(query);
        } else {
            searchClear.classList.remove('show');
            hideSearchResults();
        }
    });
    
    // Effacer la recherche
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.classList.remove('show');
        hideSearchResults();
        searchInput.focus();
    });
    
    // Fermer les résultats en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            hideSearchResults();
        }
    });
    
    // Recherche avec la touche Entrée
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query.length > 0) {
                performSearch(query);
            }
        }
    });
}

function performSearch(query) {
    const results = searchSongs(query);
    displaySearchResults(results, query);
}

function searchSongs(query) {
    const searchTerm = query.toLowerCase();
    const allSongs = getAllSongs();
    
    return allSongs.filter(song => {
        return (
            song.title.toLowerCase().includes(searchTerm) ||
            song.lyrics.toLowerCase().includes(searchTerm) ||
            song.notes.toLowerCase().includes(searchTerm) ||
            song.theme.toLowerCase().includes(searchTerm) ||
            song.subtheme.toLowerCase().includes(searchTerm)
        );
    });
}

function getAllSongs() {
    const allSongs = [];
    
    Object.entries(choraleData).forEach(([themeKey, theme]) => {
        Object.entries(theme.subthemes).forEach(([subthemeKey, subtheme]) => {
            subtheme.songs.forEach(song => {
                allSongs.push({
                    ...song,
                    theme: theme.title,
                    subtheme: subtheme.title,
                    themeKey: themeKey,
                    subthemeKey: subthemeKey
                });
            });
        });
    });
    
    return allSongs;
}

function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');
    const searchInput = document.getElementById('global-search');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>Aucun résultat trouvé pour "<strong>${query}</strong>"</p>
                <p style="margin-top: 0.5rem; font-size: 0.8rem;">Essayez d'autres mots-clés</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.map(song => `
            <div class="search-result-item" onclick="navigateToSong('${song.themeKey}', '${song.subthemeKey}', '${song.id}')">
                <div class="search-result-icon">
                    <i class="fas fa-music"></i>
                </div>
                <div class="search-result-content">
                    <div class="search-result-title">${song.title}</div>
                    <div class="search-result-meta">
                        <span>${song.theme}</span>
                        <span>•</span>
                        <span>${song.subtheme}</span>
                    </div>
                </div>
                <div class="search-result-note">${song.note}</div>
            </div>
        `).join('');
    }
    
    searchResults.classList.add('active');
    
    // Ajuster la position si nécessaire
    positionSearchResults();
}

function navigateToSong(themeKey, subthemeKey, songId) {
    // Naviguer vers la chanson
    currentState.currentTheme = themeKey;
    currentState.currentSubTheme = subthemeKey;
    
    const theme = choraleData[themeKey];
    const subtheme = theme.subthemes[subthemeKey];
    const song = subtheme.songs.find(s => s.id === songId);
    
    if (song) {
        showSubThemes(themeKey);
        setTimeout(() => {
            showSongs(subthemeKey);
            setTimeout(() => {
                showSongDetail(song);
                hideSearchResults();
                document.getElementById('global-search').value = '';
                document.getElementById('search-clear').classList.remove('show');
            }, 100);
        }, 100);
    }
}

function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    searchResults.classList.remove('active');
}

function positionSearchResults() {
    const searchContainer = document.querySelector('.search-container');
    const searchResults = document.getElementById('search-results');
    const header = document.querySelector('.app-header');
    
    // S'assurer que les résultats sont bien positionnés sous la barre de recherche
    const headerRect = header.getBoundingClientRect();
    const containerRect = searchContainer.getBoundingClientRect();
    
    searchResults.style.top = '100%';
    searchResults.style.left = '0';
    searchResults.style.right = '0';
}

// ===== MODIFICATIONS À APPORTER À L'INITIALISATION =====
function initializeApp() {
    // Simulation du chargement
    simulateLoading();
    setupEventListeners();
    initializeSearch(); // ← AJOUTER CETTE LIGNE
}