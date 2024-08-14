const config = {
    presets: {
        presetBetrieb: {
            anwesenheit: 1,
            ort: 2,
            eintrag: 2,
            dauer: 8,
            punkte: true
        },
        presetSchule: {
            anwesenheit: 1,
            ort: 1,
            eintrag: 1
        },
        presetUrlaub: {
            anwesenheit: 2
        },
    },
    themes: {
        light: {
            background: '#f7f9fc',
            color: '#333',
            logo: '../assets/icon48.png',
            settings: '../assets/settings.png'
        }
    },
    defaultSettings: {
        theme: 'light',
        language: 'en',
        email: '',
        password: ''
    }
};

export default config;