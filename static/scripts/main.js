const client_id = 'e765fc7fda4742db904d604ef058e604';
const redirect_uri = 'https://mattocksjmj.github.io/Stats-for-Spotify/callback';
// const redirect_uri = 'http://127.0.0.1:5500/callback.html'
const scope = 'user-read-private user-top-read playlist-modify-public playlist-read-private playlist-read-collaborative';

function logIn() {
    window.location = 'https://accounts.spotify.com/authorize?'
                    + 'client_id=' + client_id 
                    + '&response_type=' + 'token' 
                    + '&redirect_uri=' + redirect_uri 
                    + '&scope=' + scope;
    sessionStorage.setItem('time_rangeA', 'medium_term');
    sessionStorage.setItem('time_rangeS', 'medium_term');
}