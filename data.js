// ===== DONNÉES DE LA CHORALE "LA GLOIRE DE DIEU" =====
const choraleData = {
    composition: {
        title: "Chansons de Composition",
        description: "Créations originales de LA GLOIRE DE DIEU",
        subthemes: {
            "sainte-scene": {
                title: "Sainte Scène",
                icon: "fas fa-church",
                description: "Chants pour les moments sacrés",
                songs: [
                    {
                        id: "comp-sainte-1",
                        title: "SHAMAH NDILO JINA LAKO",
                        note: "RE",
                        lyrics: `shamah ndilo jina lako
                                 shamah ndilo jina lako
                                 ume tu towa kwenye zarau


[COUPLET 2]
`,

                        audio: "audio/gloire.mp3",
                        notes: "RE sans transposition🎵 ♪" ,
                    },
                        
                    {
                        id: "autre-autres-3",
                        title: "Psaume de Joie",
                        note: "A",
                        lyrics: `[COUPLET 1]
Mon âme exalte le Seigneur
Mon esprit se réjouit en Dieu
Car Il a jeté les yeux sur moi
Et m'a comblé de Ses bienfaits

[REFRAIN]
Joie, joie dans mon cœur
Joie, joie pour mon Sauveur
Il a fait pour moi de grandes choses
Saint est Son nom`,

                        audio: "audio/psaume-joie.mp3",
                        notes: "RÉ MI FA# SOL LA SI DO# RÉ\n🎵 ♪ 🎶 ♫",
                        duration: "3:50",
                        quality: "HD"
                    }
                ]
            }
        }
    }
};

// === STATISTIQUES DE LA BIBLIOTHÈQUE ===
function getLibraryStats() {
    let totalSongs = 0;
    let totalDuration = 0;
    
    // Compter les chansons
    Object.values(choraleData).forEach(theme => {
        Object.values(theme.subthemes).forEach(subtheme => {
            totalSongs += subtheme.songs.length;
            subtheme.songs.forEach(song => {
                const [min, sec] = song.duration.split(':').map(Number);
                totalDuration += min * 60 + sec;
            });
        });
    });
    
    // Convertir la durée totale en format lisible
    const totalHours = Math.floor(totalDuration / 3600);
    const totalMinutes = Math.floor((totalDuration % 3600) / 60);
    
    return {
        totalSongs: totalSongs,
        totalDuration: `${totalHours > 0 ? totalHours + 'h ' : ''}${totalMinutes}min`,
        byTheme: {
            composition: Object.values(choraleData.composition.subthemes).reduce((acc, sub) => acc + sub.songs.length, 0),
            autres: Object.values(choraleData.autres.subthemes).reduce((acc, sub) => acc + sub.songs.length, 0)
        },
        bySubtheme: {
            "Sainte Scène": choraleData.composition.subthemes["sainte-scene"].songs.length + 
                           choraleData.autres.subthemes["sainte-scene"].songs.length,
            "Adoration": choraleData.composition.subthemes["adoration"].songs.length + 
                        choraleData.autres.subthemes["adoration"].songs.length,
            "Autres": choraleData.composition.subthemes["autres"].songs.length + 
                     choraleData.autres.subthemes["autres"].songs.length
        }
    };
}

// === FONCTIONS D'ACCÈS AUX DONNÉES ===
function getAllSongs() {
    const allSongs = [];
    
    Object.values(choraleData).forEach(theme => {
        Object.values(theme.subthemes).forEach(subtheme => {
            subtheme.songs.forEach(song => {
                allSongs.push({
                    ...song,
                    theme: theme.title,
                    subtheme: subtheme.title
                });
            });
        });
    });
    
    return allSongs;
}

function getSongsByTheme(themeName) {
    return choraleData[themeName] ? getAllSongs().filter(song => song.theme === choraleData[themeName].title) : [];
}

function getSongsBySubtheme(themeName, subthemeName) {
    if (choraleData[themeName] && choraleData[themeName].subthemes[subthemeName]) {
        return choraleData[themeName].subthemes[subthemeName].songs;
    }
    return [];
}

function searchSongs(query) {
    const allSongs = getAllSongs();
    const searchTerm = query.toLowerCase();
    
    return allSongs.filter(song => 
        song.title.toLowerCase().includes(searchTerm) ||
        song.lyrics.toLowerCase().includes(searchTerm) ||
        song.notes.toLowerCase().includes(searchTerm)
    );
}

// === EXPORT DES DONNÉES ===
function exportChoraleData() {
    const exportData = {
        chorale: "LA GLOIRE DE DIEU",
        data: choraleData,
        stats: getLibraryStats(),
        exportDate: new Date().toISOString(),
        version: "1.0"
    };
    
    return JSON.stringify(exportData, null, 2);
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
// Initialisation et statistiques
console.log('🎵 LA GLOIRE DE DIEU - Données chargées');
console.log('📊 Statistiques:', getLibraryStats());